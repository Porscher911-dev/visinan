import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Printer,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Layers,
  Wrench,
  HelpCircle,
  BarChart3,
  Percent,
  FileCheck,
  Eye
} from 'lucide-react';
import { INITIAL_PRINT_ORDERS, INITIAL_PRINT_ESTIMATES } from '../../data/printingData';
import { CountUp } from './CountUp';
import { RevenueTrendChart } from './RevenueTrendChart';

export const VessaExecutiveDashboard: React.FC = () => {
  const { setActiveTab } = useApp();
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'quarter'>('month');

  // Aggregated KPI numbers for Printing & Signage Business
  const totalRevenue = 485200000;       // Doanh thu ghi nhận tháng (485.2 triệu)
  const actualCollected = 398600000;    // Thực thu về tài khoản (398.6 triệu)
  const grossProfit = 228044000;        // Lợi nhuận gộp (228.0 triệu ~ 47%)
  const totalReceivables = 86600000;     // Công nợ phải thu (86.6 triệu)
  const ongoingOrdersValue = 101033480;  // Giá trị đơn hàng đang gia công (101.0 triệu)

  // Monthly Revenue Line Chart Data (Last 10 days)
  const trendData = [
    { day: '16/10', rev: 32, cost: 16, profit: 16 },
    { day: '17/10', rev: 45, cost: 22, profit: 23 },
    { day: '18/10', rev: 38, cost: 19, profit: 19 },
    { day: '19/10', rev: 58, cost: 28, profit: 30 },
    { day: '20/10', rev: 42, cost: 21, profit: 21 },
    { day: '21/10', rev: 65, cost: 31, profit: 34 },
    { day: '22/10', rev: 51, cost: 25, profit: 26 },
    { day: '23/10', rev: 72, cost: 34, profit: 38 },
    { day: '24/10', rev: 68, cost: 33, profit: 35 },
    { day: '25/10', rev: 84, cost: 40, profit: 44 }
  ];


  // Product Distribution Data (Donut segments)
  const productShare = [
    { name: 'Bảng Hiệu Led & Chữ Nổi Inox', percent: 38, amount: 184376000, color: 'var(--primary)' },
    { name: 'Bạt Hiflex & UV Không Gân (3M)', percent: 27, amount: 131004000, color: 'var(--ochre)' },
    { name: 'Mặt Tiền Alu & Chữ Mica Hút Nổi', percent: 18, amount: 87336000, color: 'var(--sky)' },
    { name: 'Decal Kính & PP Bồi Formex', percent: 12, amount: 58224000, color: 'var(--teal)' },
    { name: 'Biển Vẫy & Thi Công Phụ Trợ', percent: 5, amount: 24260000, color: 'var(--sage)' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="head flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
            Bảng Điều Hành Doanh Nghiệp • Tháng 10/2026
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Tổng Quan Điều Hành <em className="not-italic" style={{ color: 'var(--primary)' }}>Giám Đốc</em>
          </h1>
          <p className="text-xs mt-1 font-medium" style={{ color: 'var(--muted)' }}>
            Kiểm soát thời gian thực dòng tiền, sản xuất xưởng in, công nợ và tiến độ công trình bảng hiệu.
          </p>
        </div>

        {/* Time Range Filter Bar */}
        <div 
          className="seg flex items-center p-1 rounded-full border shadow-2xs self-start md:self-auto"
          style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
        >
          {(['day', 'week', 'month', 'quarter'] as const).map((mode) => {
            const labels = { day: 'Hôm nay', week: 'Tuần này', month: 'Tháng 10', quarter: 'Quý 4' };
            const isSelected = timeFilter === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setTimeFilter(mode)}
                className="px-3.5 py-1.5 text-xs font-bold rounded-full transition-all"
                style={{
                  background: isSelected ? 'var(--text)' : 'transparent',
                  color: isSelected ? 'var(--bg)' : 'var(--muted)'
                }}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ROW 1: 5 Executive KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Doanh Thu Ghi Nhận */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="vessa-stat cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
              Doanh Thu Ghi Nhận
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text)' }}>
            <CountUp value={totalRevenue / 1000000} decimals={1} /> <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>tr đ</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t" style={{ borderColor: 'var(--line)' }}>
            <span className="vessa-delta vessa-delta-good">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% so tháng trước
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
          </div>
        </div>

        {/* Card 2: Tiền Thực Thu */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="vessa-stat cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
              Tiền Thực Thu Về Quỹ
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text)' }}>
            <CountUp value={actualCollected / 1000000} decimals={1} /> <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>tr đ</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t" style={{ borderColor: 'var(--line)' }}>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--good)' }}>
              Đạt 82.1% doanh thu
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
          </div>
        </div>

        {/* Card 3: Lợi Nhuận Gộp */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="vessa-stat cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
              Lợi Nhuận Gộp (Margin)
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text)' }}>
            <CountUp value={grossProfit / 1000000} decimals={1} /> <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>tr đ</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t" style={{ borderColor: 'var(--line)' }}>
            <span className="vessa-badge vessa-badge-good text-[10px]">
              Tỷ suất 47.0%
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
          </div>
        </div>

        {/* Card 4: Công Nợ Phải Thu */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="vessa-stat cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
              Công Nợ Phải Thu
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--bad)' }}>
            <CountUp value={totalReceivables / 1000000} decimals={1} /> <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>tr đ</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t" style={{ borderColor: 'var(--line)' }}>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--bad)' }}>
              4 khách hàng nợ &gt; 15 ngày
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
          </div>
        </div>

        {/* Card 5: Đơn Đang Thực Hiện */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="vessa-stat cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
              Đơn Đang Gia Công / Thi Công
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text)' }}>
            <CountUp value={ongoingOrdersValue / 1000000} decimals={1} /> <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>tr đ</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t" style={{ borderColor: 'var(--line)' }}>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--muted)' }}>
              5 dự án xưởng & công trình
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
          </div>
        </div>
      </div>

      {/* ROW 2: Business Analytics & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue & Profit Interactive Trend Chart (2 Cols) */}
        <div className="vessa-card lg:col-span-2">
          <div className="mb-2">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <BarChart3 className="w-4 h-4 text-orange-600" />
              Diễn Biến Doanh Thu & Giá Vốn Sản Xuất (Triệu VNĐ)
            </h2>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Rê chuột hoặc dùng phím mũi tên để xem doanh thu, giá vốn và lợi nhuận gộp theo ngày.
            </p>
          </div>
          <RevenueTrendChart data={trendData} />
        </div>

        {/* Right: Revenue Breakdown by Core Product Group (1 Col) */}
        <div className="vessa-card flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 mb-1" style={{ color: 'var(--text)' }}>
              <Layers className="w-4 h-4 text-amber-600" />
              Cơ Cấu Doanh Thu Sản Phẩm
            </h2>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
              Tỷ trọng đóng góp từ các hạng mục in ấn & bảng hiệu quảng cáo.
            </p>

            {/* Product Breakdown List with Progress Bars */}
            <div className="space-y-3.5">
              {productShare.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold truncate max-w-[200px]" style={{ color: 'var(--text)' }}>
                      {item.name}
                    </span>
                    <span className="font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                      {item.percent}% <span className="font-normal text-[11px]" style={{ color: 'var(--muted)' }}>({(item.amount / 1000000).toFixed(1)} tr)</span>
                    </span>
                  </div>
                  {/* Progress bar track */}
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--well)' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.percent}%`, background: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t text-xs flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
            <span style={{ color: 'var(--muted)' }}>Hạng mục chủ lực:</span>
            <span className="font-bold" style={{ color: 'var(--primary)' }}>Bảng hiệu Led (38%)</span>
          </div>
        </div>
      </div>

      {/* ROW 3: Production Operations Status Bar */}
      <div className="vessa-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Printer className="w-4 h-4 text-blue-600" />
              Điều Hành Sản Xuất & Tiến Độ Xưởng Hiện Tại
            </h2>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Tổng hợp tình trạng 5 máy in công nghiệp và các công trình đang triển khai lắp đặt.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('production')}
            className="vessa-btn vessa-btn-ghost vessa-btn-xs"
          >
            Mở Kanban Xưởng In <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
            <div className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Máy In Đang Chạy</div>
            <div className="text-xl font-bold mt-1" style={{ color: 'var(--good)' }}>4 / 5 Máy</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>Konica, Roland, Mimaki UV</div>
          </div>

          <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
            <div className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Chờ Duyệt File In</div>
            <div className="text-xl font-bold mt-1" style={{ color: 'var(--ochre)' }}>1 Đơn Maket</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>Pano MB Bank bù mép 15cm</div>
          </div>

          <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
            <div className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Gia Công Sau In</div>
            <div className="text-xl font-bold mt-1" style={{ color: 'var(--sky)' }}>2 Lô Hàng</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>Xỏ que Hiflex & Cán màng PP</div>
          </div>

          <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
            <div className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Sẵn Sàng Lắp Đặt</div>
            <div className="text-xl font-bold mt-1" style={{ color: 'var(--teal)' }}>1 Công Trình</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>VinFast Bình Triệu (21h tối)</div>
          </div>

          <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
            <div className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Đã Nghiệm Thu Hôm Nay</div>
            <div className="text-xl font-bold mt-1" style={{ color: 'var(--good)' }}>100% Hoàn Thành</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>Backdrop ĐH FPT Cần Thơ</div>
          </div>
        </div>
      </div>

      {/* ROW 4: Actionable Alerts & Recent Order Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts & Critical Warnings */}
        <div className="vessa-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Cảnh Báo Cần Hành Động Ngay
            </h2>
            <span className="vessa-badge vessa-badge-warn text-[10px]">3 Cảnh Báo</span>
          </div>

          <div className="space-y-2.5">
            {/* Warning 1 */}
            <div className="p-3 rounded-xl border flex items-start justify-between gap-3" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--bad)' }}>
                  <span>Vật Tư Sắp Hết Trong Kho:</span> Bạt Không Gân UV 3.2m
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  Tồn kho chỉ còn 2 cuộn (Định mức tối thiểu là 5 cuộn). Cần tạo đơn đặt hàng nhà cung cấp Deajeong.
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setActiveTab('inventory')}
                className="vessa-btn vessa-btn-ghost vessa-btn-xs flex-shrink-0"
              >
                Nhập Kho
              </button>
            </div>

            {/* Warning 2 */}
            <div className="p-3 rounded-xl border flex items-start justify-between gap-3" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--ochre)' }}>
                  <span>Công Nợ Quá Hạn:</span> Nhà Thuốc FPT Long Châu
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  Còn nợ 9.5 triệu đồng từ đơn hàng DH-8893 đã quá 18 ngày kể từ ngày giao bảng hiệu.
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setActiveTab('finance')}
                className="vessa-btn vessa-btn-ghost vessa-btn-xs flex-shrink-0"
              >
                Nhắc Nợ
              </button>
            </div>

            {/* Warning 3 */}
            <div className="p-3 rounded-xl border flex items-start justify-between gap-3" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--info)' }}>
                  <span>Tiến Độ Thi Công Đêm:</span> VinFast Showroom
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  Bắt đầu thi công dán decal kính lúc 21:00 tối nay. Đội 1 (3 thợ) đã kiểm tra trang bị giàn giáo.
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setActiveTab('installation')}
                className="vessa-btn vessa-btn-ghost vessa-btn-xs flex-shrink-0"
              >
                Chi Tiết
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="vessa-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Clock className="w-4 h-4 text-purple-600" />
              Đơn Hàng & Dự Án Vừa Cập Nhật
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="text-xs font-bold hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-2">
            {INITIAL_PRINT_ORDERS.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                onClick={() => setActiveTab('orders')}
                className="p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
              >
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                    <span style={{ color: 'var(--primary)' }}>{ord.code}</span> — {ord.projectName}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    {ord.customerName} • {ord.contractValue.toLocaleString()} đ • {ord.totalM2}m²
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`vessa-badge ${
                    ord.status === 'COMPLETED' ? 'vessa-badge-good' :
                    ord.status === 'READY_INSTALL' ? 'vessa-badge-info' :
                    ord.status === 'PRINTING' ? 'vessa-badge-warn' : 'vessa-badge-plain'
                  }`}>
                    {ord.status === 'COMPLETED' ? 'Đã nghiệm thu' :
                     ord.status === 'READY_INSTALL' ? 'Chờ thi công' :
                     ord.status === 'POST_PROCESSING' ? 'Đang gia công' :
                     ord.status === 'PRINTING' ? 'Đang in' : 'Chờ duyệt'}
                  </span>
                  <div className="text-[10px] mt-0.5 font-bold" style={{ color: 'var(--muted)' }}>
                    Tiến độ {ord.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
