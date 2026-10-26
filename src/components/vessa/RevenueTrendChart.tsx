import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface TrendPoint {
  day: string;
  rev: number;
  cost: number;
  profit: number;
}

interface Props {
  data: TrendPoint[];
  height?: number;
}

type SeriesKey = 'rev' | 'cost';

const M = { l: 48, r: 20, t: 20, b: 34 };

/** Đường cong mượt, tiếp tuyến ngang tại mỗi điểm nên không bị vọt quá giá trị. */
const smoothPath = (pts: { x: number; y: number }[]) =>
  pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${d} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

const niceMax = (v: number) => {
  const step = v > 100 ? 50 : 25;
  return Math.ceil(v / step) * step;
};

export const RevenueTrendChart: React.FC<Props> = ({ data, height = 280 }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({ rev: true, cost: true });

  // Đo bề rộng thật để vẽ đúng tỉ lệ pixel (không kéo giãn méo hình tròn / chữ)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    ro.observe(el);
    setWidth(Math.max(280, el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    const max = niceMax(Math.max(...data.map((d) => d.rev)));
    const iw = width - M.l - M.r;
    const ih = height - M.t - M.b;
    const x = (i: number) => M.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
    const y = (v: number) => M.t + ih - (v / max) * ih;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
    const rev = data.map((d, i) => ({ x: x(i), y: y(d.rev) }));
    const cost = data.map((d, i) => ({ x: x(i), y: y(d.cost) }));
    const base = M.t + ih;
    const revLine = smoothPath(rev);
    const area = `${revLine} L ${rev[rev.length - 1].x} ${base} L ${rev[0].x} ${base} Z`;
    return { max, iw, ih, x, y, ticks, rev, cost, base, revLine, costLine: smoothPath(cost), area };
  }, [data, width, height]);

  const labelEvery = width < 520 ? 2 : 1;

  const onMove = (e: React.PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const idx = Math.round(((px - M.l) / geo.iw) * (data.length - 1));
    setActive(Math.min(data.length - 1, Math.max(0, idx)));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') setActive((a) => Math.min(data.length - 1, (a ?? -1) + 1));
    else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? data.length) - 1));
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const toggle = (k: SeriesKey) => setVisible((v) => ({ ...v, [k]: !v[k] }));

  const cur = active !== null ? data[active] : null;
  const tipW = 176;
  const tipLeft = cur ? Math.min(Math.max(geo.x(active!) - tipW / 2, 4), width - tipW - 4) : 0;
  const tipTop = cur ? Math.max(geo.y(cur.rev) - 112, 0) : 0;

  const LegendBtn: React.FC<{ k: SeriesKey; label: string; color: string }> = ({ k, label, color }) => (
    <button
      type="button"
      onClick={() => toggle(k)}
      aria-pressed={visible[k]}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 h-7 rounded-full transition-colors"
      style={{
        color: visible[k] ? 'var(--text)' : 'var(--faint)',
        background: visible[k] ? 'var(--well)' : 'transparent',
        textDecoration: visible[k] ? 'none' : 'line-through'
      }}
    >
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, opacity: visible[k] ? 1 : 0.4 }} />
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex items-center justify-end gap-1 mb-1" role="group" aria-label="Chọn chuỗi dữ liệu hiển thị">
        <LegendBtn k="rev" label="Doanh thu" color="var(--primary)" />
        <LegendBtn k="cost" label="Giá vốn" color="var(--faint)" />
      </div>

      <div ref={wrapRef} className="relative w-full" style={{ height }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block overflow-visible outline-none"
          role="img"
          aria-label="Biểu đồ đường doanh thu và giá vốn theo ngày. Dùng phím mũi tên để xem từng ngày."
          tabIndex={0}
          onPointerMove={onMove}
          onMouseMove={onMove}
          onPointerLeave={() => setActive(null)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive((a) => a ?? data.length - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={onKey}
          style={{ touchAction: 'pan-y' }}
        >
          <defs>
            <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Lưới ngang + nhãn trục Y, bắt đầu từ 0 */}
          {geo.ticks.map((t) => (
            <g key={t}>
              <line
                x1={M.l}
                x2={width - M.r}
                y1={geo.y(t)}
                y2={geo.y(t)}
                stroke="var(--line-2)"
                strokeDasharray={t === 0 ? undefined : '3 5'}
                opacity={t === 0 ? 0.7 : 0.55}
              />
              <text x={M.l - 10} y={geo.y(t) + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="var(--muted)">
                {t}
              </text>
            </g>
          ))}
          <text x={M.l - 10} y={M.t - 8} textAnchor="end" fontSize="10" fill="var(--faint)">
            tr đ
          </text>

          {/* Nhãn trục X */}
          {data.map((d, i) =>
            i % labelEvery === 0 ? (
              <text
                key={d.day}
                x={geo.x(i)}
                y={geo.base + 22}
                textAnchor="middle"
                fontSize="11"
                fontWeight={active === i ? 700 : 600}
                fill={active === i ? 'var(--text)' : 'var(--muted)'}
              >
                {d.day}
              </text>
            ) : null
          )}

          {visible.rev && <path d={geo.area} fill="url(#trendArea)" />}

          {visible.cost && (
            <path
              d={geo.costLine}
              fill="none"
              stroke="var(--faint)"
              strokeWidth="2"
              strokeDasharray="2 6"
              strokeLinecap="round"
              opacity="0.9"
            />
          )}

          {visible.rev && (
            <path
              className="chart-draw"
              d={geo.revLine}
              pathLength={1}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Đường dóng + chấm của ngày đang chọn */}
          {cur && (
            <g pointerEvents="none">
              <line x1={geo.x(active!)} x2={geo.x(active!)} y1={M.t} y2={geo.base} stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="1.5" />
              {visible.cost && (
                <circle cx={geo.cost[active!].x} cy={geo.cost[active!].y} r="4" fill="var(--surface)" stroke="var(--faint)" strokeWidth="2" />
              )}
              {visible.rev && (
                <>
                  <circle cx={geo.rev[active!].x} cy={geo.rev[active!].y} r="9" fill="var(--primary)" opacity="0.15" />
                  <circle cx={geo.rev[active!].x} cy={geo.rev[active!].y} r="5" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2.5" />
                </>
              )}
            </g>
          )}

          {/* Chấm nhỏ khi chưa hover */}
          {!cur &&
            visible.rev &&
            geo.rev.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--primary)" pointerEvents="none" />)}
        </svg>

        {cur && (
          <div
            className="absolute pointer-events-none rounded-2xl border text-xs p-3 space-y-1"
            style={{
              left: tipLeft,
              top: tipTop,
              width: tipW,
              background: 'var(--raised)',
              borderColor: 'var(--line)',
              boxShadow: 'var(--shadow-pop)'
            }}
            role="status"
          >
            <div className="font-bold pb-1.5 mb-1 border-b" style={{ color: 'var(--text)', borderColor: 'var(--line)' }}>
              Ngày {cur.day}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                <i className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} /> Doanh thu
              </span>
              <b className="tabular-nums" style={{ color: 'var(--text)' }}>{cur.rev} tr</b>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                <i className="w-2 h-2 rounded-full" style={{ background: 'var(--faint)' }} /> Giá vốn
              </span>
              <b className="tabular-nums" style={{ color: 'var(--text)' }}>{cur.cost} tr</b>
            </div>
            <div className="flex items-center justify-between gap-3 pt-1 border-t" style={{ borderColor: 'var(--line)' }}>
              <span style={{ color: 'var(--muted)' }}>Lợi nhuận gộp</span>
              <b className="tabular-nums" style={{ color: 'var(--good)' }}>+{cur.profit} tr</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
