import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Search,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Layers,
  Archive
} from 'lucide-react';

interface MaterialStock {
  id: string;
  sku: string;
  name: string;
  category: 'BAT_IN' | 'DECAL' | 'TAM_OP' | 'LED_NGUON' | 'MUC_IN';
  unit: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
}

export const VessaInventoryView: React.FC = () => {
  const [items, setItems] = useState<MaterialStock[]>([
    {
      id: 'mat-1',
      sku: 'VT-BAT-01',
      name: 'Cuộn Bạt Hiflex 3.2m Dày 0.36mm (Gân Trắng)',
      category: 'BAT_IN',
      unit: 'Cuộn (80m)',
      quantity: 14,
      minStock: 5,
      unitPrice: 1920000,
      location: 'Kho A - Kệ Cuộn 01',
      lastUpdated: '2026-10-24'
    },
    {
      id: 'mat-2',
      sku: 'VT-BAT-02',
      name: 'Cuộn Bạt Không Gân Cao Cấp UV 3M Khổ 3.2m',
      category: 'BAT_IN',
      unit: 'Cuộn (50m)',
      quantity: 2, // Low stock!
      minStock: 5,
      unitPrice: 4750000,
      location: 'Kho A - Kệ Cuộn 02',
      lastUpdated: '2026-10-25'
    },
    {
      id: 'mat-3',
      sku: 'VT-DEC-01',
      name: 'Cuộn Decal PP Cán Màng Bóng Khổ 1.52m',
      category: 'DECAL',
      unit: 'Cuộn (50m)',
      quantity: 8,
      minStock: 4,
      unitPrice: 1600000,
      location: 'Kho A - Kệ Decal 01',
      lastUpdated: '2026-10-22'
    },
    {
      id: 'mat-4',
      sku: 'VT-ALU-01',
      name: 'Tấm Nhôm Nhựa Alu Alcorest 3mm x 0.10 EV2002',
      category: 'TAM_OP',
      unit: 'Tấm (1.22x2.44m)',
      quantity: 35,
      minStock: 10,
      unitPrice: 385000,
      location: 'Kho B - Giá Tấm Đứng',
      lastUpdated: '2026-10-23'
    },
    {
      id: 'mat-5',
      sku: 'VT-MIC-01',
      name: 'Tấm Mica Đài Loan Chochen 3mm Trong Suốt',
      category: 'TAM_OP',
      unit: 'Tấm (1.22x2.44m)',
      quantity: 18,
      minStock: 6,
      unitPrice: 620000,
      location: 'Kho B - Giá Mica Nằm',
      lastUpdated: '2026-10-21'
    },
    {
      id: 'mat-6',
      sku: 'VT-LED-01',
      name: 'Led Module 3 Bóng Samsung Chip 2835 12V Trắng Lạnh',
      category: 'LED_NGUON',
      unit: 'Vỉ (20 bóng)',
      quantity: 120,
      minStock: 50,
      unitPrice: 95000,
      location: 'Kho C - Tủ Linh Kiện 03',
      lastUpdated: '2026-10-25'
    },
    {
      id: 'mat-7',
      sku: 'VT-NGU-01',
      name: 'Nguồn Tổ Ong Chống Nước Ngoài Trời 12V 400W 33A',
      category: 'LED_NGUON',
      unit: 'Cái',
      quantity: 15,
      minStock: 8,
      unitPrice: 280000,
      location: 'Kho C - Tủ Linh Kiện 01',
      lastUpdated: '2026-10-20'
    },
    {
      id: 'mat-8',
      sku: 'VT-MUC-01',
      name: 'Mực In UV Curable TaiMes Chính Hãng (Can 5L)',
      category: 'MUC_IN',
      unit: 'Can (5L)',
      quantity: 3, // Low stock!
      minStock: 6,
      unitPrice: 3200000,
      location: 'Kho Pha Chế Mực In',
      lastUpdated: '2026-10-24'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  const filteredItems = items.filter(it => {
    const matchCat = catFilter === 'ALL' || it.category === catFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q) || it.location.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const lowStockCount = items.filter(it => it.quantity <= it.minStock).length;
  const totalStockVal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
            Quản Lý Kho Hàng & Vật Tư
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Kho Vật Tư In Ấn & Linh Kiện Bảng Hiệu
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Theo dõi tồn kho thực tế, định mức dự phòng cuộn bạt, decal, tấm alu, mica, led và can mực in.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="vessa-btn vessa-btn-ghost h-10 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span>Xuất Kho Cho Đơn In</span>
          </button>
          <button
            type="button"
            className="vessa-btn vessa-btn-primary h-10 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nhập Vật Tư Mới</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="vessa-stat">
          <div className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Tổng Giá Trị Tồn Kho</div>
          <div className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
            {(totalStockVal / 1000000).toFixed(1)} <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>tr đ</span>
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>8 danh mục vật tư chính</div>
        </div>

        <div className="vessa-stat">
          <div className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Cảnh Báo Sắp Hết Hàng</div>
          <div className="text-2xl font-bold mt-1" style={{ color: lowStockCount > 0 ? 'var(--bad)' : 'var(--good)' }}>
            {lowStockCount} Mặt Hàng
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--bad)' }}>
            Bạt Không Gân UV & Mực In TaiMes
          </div>
        </div>

        <div className="vessa-stat">
          <div className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Vị Trí Lưu Trữ Xưởng</div>
          <div className="text-2xl font-bold mt-1" style={{ color: 'var(--primary)' }}>
            3 Phân Khu Kho
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Kho Cuộn A, Kho Tấm B, Tủ Linh Kiện C</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="vessa-input flex items-center gap-2 px-3 h-10 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm mã SKU, tên vật tư, vị trí..."
            className="bg-transparent border-0 outline-none w-full text-xs font-medium"
            style={{ color: 'var(--text)' }}
          />
        </div>

        <div 
          className="seg flex items-center p-1 rounded-full border overflow-x-auto w-full sm:w-auto"
          style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
        >
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'BAT_IN', label: 'Bạt Hiflex / UV' },
            { id: 'DECAL', label: 'Decal PP / Sữa' },
            { id: 'TAM_OP', label: 'Alu & Mica' },
            { id: 'LED_NGUON', label: 'Led & Nguồn' },
            { id: 'MUC_IN', label: 'Mực In' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCatFilter(cat.id)}
              className="px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap"
              style={{
                background: catFilter === cat.id ? 'var(--text)' : 'transparent',
                color: catFilter === cat.id ? 'var(--bg)' : 'var(--muted)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Material Table */}
      <div className="vessa-card p-0 overflow-hidden">
        <div className="vessa-table-wrap">
          <table className="vessa-table">
            <thead>
              <tr>
                <th>Mã SKU</th>
                <th>Tên Vật Tư In Ấn / Bảng Hiệu</th>
                <th className="text-center">ĐVT</th>
                <th className="text-center">Tồn Kho</th>
                <th className="text-center">Định Mức Min</th>
                <th className="text-right">Đơn Giá Vốn (VNĐ)</th>
                <th>Vị Trí Kho</th>
                <th className="text-center">Tình Trạng</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((it) => {
                const isLow = it.quantity <= it.minStock;
                return (
                  <tr key={it.id}>
                    <td className="font-bold text-xs" style={{ color: 'var(--primary)' }}>
                      {it.sku}
                    </td>
                    <td>
                      <div className="font-bold text-xs" style={{ color: 'var(--text)' }}>
                        {it.name}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                        Cập nhật: {it.lastUpdated}
                      </div>
                    </td>
                    <td className="text-center text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
                      {it.unit}
                    </td>
                    <td className="text-center font-bold text-xs tabular-nums" style={{ color: isLow ? 'var(--bad)' : 'var(--text)' }}>
                      {it.quantity}
                    </td>
                    <td className="text-center text-xs tabular-nums font-semibold" style={{ color: 'var(--muted)' }}>
                      {it.minStock}
                    </td>
                    <td className="text-right text-xs tabular-nums font-semibold" style={{ color: 'var(--text)' }}>
                      {it.unitPrice.toLocaleString()} đ
                    </td>
                    <td className="text-xs" style={{ color: 'var(--muted)' }}>
                      {it.location}
                    </td>
                    <td className="text-center">
                      <span className={`vessa-badge ${isLow ? 'vessa-badge-bad' : 'vessa-badge-good'}`}>
                        {isLow ? 'Sắp hết hàng' : 'Đủ tồn kho'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
