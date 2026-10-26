import React, { useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { INITIAL_PRINT_ORDERS } from '../../data/printingData';

interface TickerItem {
  id: string;
  tone: string;
  text: React.ReactNode;
}

const fmt = (n: number) => n.toLocaleString('vi-VN');

/** Dải chạy chữ: tin cần hành động, tính từ dữ liệu đơn hàng. */
export const VessaTicker: React.FC = () => {
  const [paused, setPaused] = useState(false);

  const items = useMemo<TickerItem[]>(() => {
    const list: TickerItem[] = [];
    INITIAL_PRINT_ORDERS.forEach((o) => {
      if (o.status !== 'COMPLETED') {
        list.push({
          id: `dl-${o.id}`,
          tone: 'var(--ochre)',
          text: <><b>{o.code}</b> {o.projectName} — hạn giao {o.deadline}</>
        });
      }
      if (o.debtAmount > 0) {
        list.push({
          id: `debt-${o.id}`,
          tone: 'var(--bad)',
          text: <>Công nợ <b>{o.customerName}</b>: {fmt(o.debtAmount)} đ ({o.code})</>
        });
      }
      if (!o.proofApproved) {
        list.push({
          id: `proof-${o.id}`,
          tone: 'var(--info)',
          text: <><b>{o.code}</b> đang chờ khách duyệt maket</>
        });
      }
    });
    return list;
  }, []);

  if (items.length === 0) return null;

  // Nhân đôi nội dung để vòng lặp liền mạch (translateX -50%)
  const loop = [...items, ...items];
  const duration = Math.max(24, items.length * 7);

  return (
    <div className="vessa-ticker" role="region" aria-label="Tin điều hành mới nhất">
      <span className="vessa-ticker__label">
        <span className="vessa-ticker__dot" aria-hidden="true" />
        Cần xử lý
      </span>

      <div className="vessa-ticker__viewport">
        <div
          className="vessa-ticker__track"
          style={{
            ['--ticker-dur' as string]: `${duration}s`,
            animationPlayState: paused ? 'paused' : undefined
          }}
        >
          {loop.map((it, i) => (
            <span
              key={`${it.id}-${i}`}
              className="vessa-ticker__item"
              aria-hidden={i >= items.length ? true : undefined}
              style={{ ['--c' as string]: it.tone }}
            >
              <i />
              {it.text}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="vessa-ticker__toggle"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Tiếp tục chạy chữ' : 'Tạm dừng chạy chữ'}
        title={paused ? 'Tiếp tục' : 'Tạm dừng'}
      >
        {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </button>
    </div>
  );
};
