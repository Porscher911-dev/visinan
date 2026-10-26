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
  Archive,
  X,
  Boxes
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

interface Props {
  initialOpenAdd?: boolean;
}

export const VessaInventoryView: React.FC<Props> = ({ initialOpenAdd = false }) => {
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

  // Modals & Toast State
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialOpenAdd);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Material Form State
  const [newMatForm, setNewMatForm] = useState({
    sku: '',
    name: '',
    category: 'BAT_IN' as MaterialStock['category'],
    unit: 'Cuộn (80m)',
    quantity: 10,
    minStock: 4,
    unitPrice: 1800000,
    location: 'Kho A - Kệ Cuộn 01'
  });
  const [newMatErrors, setNewMatErrors] = useState<{ name?: string; quantity?: string }>({});

  // Export Stock Form State
  const [exportForm, setExportForm] = useState({
    materialId: items[0]?.id || '',
    quantity: 1,
    orderCode: 'DH-8892',
    note: 'Xuất xưởng in pano & bảng hiệu'
  });
  const [exportError, setExportError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    const nextIdx = items.length + 1;
    setNewMatForm({
      sku: `VT-IN-${nextIdx.toString().padStart(2, '0')}`,
      name: '',
      category: 'BAT_IN',
      unit: 'Cuộn (80m)',
      quantity: 10,
      minStock: 4,
      unitPrice: 1800000,
      location: 'Kho A - Kệ Cuộn Mới'
    });
    setNewMatErrors({});
    setIsAddModalOpen(true);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; quantity?: string } = {};
    if (!newMatForm.name.trim()) errors.name = 'Vui lòng nhập tên và quy cách vật tư';
    if (newMatForm.quantity <= 0) errors.quantity = 'Số lượng nhập phải lớn hơn 0';

    if (Object.keys(errors).length > 0) {
      setNewMatErrors(errors);
      return;
    }

    const newItem: MaterialStock = {
      id: `mat-${Date.now()}`,
      sku: newMatForm.sku.trim() || `VT-${Date.now().toString().slice(-4)}`,
      name: newMatForm.name.trim(),
      category: newMatForm.category,
      unit: newMatForm.unit,
      quantity: Number(newMatForm.quantity),
      minStock: Number(newMatForm.minStock) || 3,
      unitPrice: Number(newMatForm.unitPrice) || 0,
      location: newMatForm.location.trim() || 'Kho Tổng Xưởng',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setItems(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Đã nhập kho thành công: "${newItem.name}" (${newItem.quantity} ${newItem.unit})!`);
  };

  const handleOpenExportModal = () => {
    setExportForm({
      materialId: items[0]?.id || '',
      quantity: 1,
      orderCode: 'DH-8892',
      note: 'Xuất xưởng in cho đơn hàng'
    });
    setExportError(null);
    setIsExportModalOpen(true);
  };

  const handleExportStock = (e: React.FormEvent) => {
    e.preventDefault();
    const target = items.find(it => it.id === exportForm.materialId);
    if (!target) {
      setExportError('Vui lòng chọn vật tư cần xuất');
      return;
    }
    const q = Number(exportForm.quantity);
    if (q <= 0) {
      setExportError('Số lượng xuất phải lớn hơn 0');
      return;
    }
    if (q > target.quantity) {
      setExportError(`Số lượng xuất (${q}) vượt quá tồn kho hiện tại (${target.quantity} ${target.unit})`);
      return;
    }

    setItems(prev => prev.map(it => {
      if (it.id === target.id) {
        return {
          ...it,
          quantity: it.quantity - q,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return it;
    }));

    setIsExportModalOpen(false);
    showToast(`Đã xuất kho ${q} ${target.unit} "${target.name}" cho đơn ${exportForm.orderCode}!`);
  };

  const filteredItems = items.filter(it => {
    const matchCat = catFilter === 'ALL' || it.category === catFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q) || it.location.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const lowStockCount = items.filter(it => it.quantity <= it.minStock).length;
  const totalStockVal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div 
          className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border animate-in slide-in-from-top-4"
          style={{
            background: 'var(--raised)',
            borderColor: 'var(--primary)',
            color: 'var(--text)'
          }}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            onClick={handleOpenExportModal}
            className="vessa-btn vessa-btn-ghost h-10 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span>Xuất Kho Cho Đơn In</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="vessa-btn vessa-btn-primary h-10 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
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

      {/* Modal 1: Nhập Vật Tư Mới */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div 
            className="w-full max-w-lg rounded-3xl p-6 shadow-2xl border animate-in zoom-in-95 duration-150"
            style={{
              background: 'var(--raised)',
              borderColor: 'var(--line)',
              color: 'var(--text)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--well)', color: 'var(--primary)' }}
                >
                  <Package className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Nhập Kho Vật Tư Mới</h3>
                  <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    Bổ sung bạt in, decal, alu, mica, led và can mực vào kho xưởng
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                style={{ background: 'var(--surface-2)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Mã SKU <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMatForm.sku}
                    onChange={(e) => setNewMatForm({ ...newMatForm, sku: e.target.value })}
                    className="vessa-input w-full h-9 px-3 text-xs font-mono font-bold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Danh Mục Vật Tư
                  </label>
                  <select
                    value={newMatForm.category}
                    onChange={(e) => setNewMatForm({ ...newMatForm, category: e.target.value as any })}
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  >
                    <option value="BAT_IN">Bạt In Hiflex / UV Không Gân</option>
                    <option value="DECAL">Decal PP / Decal Sữa Ngoại Trời</option>
                    <option value="TAM_OP">Tấm Ốp Alu / Mica Chống Ố</option>
                    <option value="LED_NGUON">Led Module / Bộ Nguồn Biến Áp</option>
                    <option value="MUC_IN">Mực In Phun Solvent Eco TaiMes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                  Tên & Quy Cách Vật Tư <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMatForm.name}
                  onChange={(e) => {
                    setNewMatForm({ ...newMatForm, name: e.target.value });
                    if (newMatErrors.name) setNewMatErrors({ ...newMatErrors, name: undefined });
                  }}
                  placeholder="Ví dụ: Cuộn Bạt Hiflex 3.2m Dày 0.38mm hoặc Tấm Alu 3mm..."
                  className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                  style={{ background: 'var(--surface-2)', borderColor: newMatErrors.name ? 'var(--bad)' : 'var(--line)' }}
                />
                {newMatErrors.name && (
                  <p className="text-[10px] text-rose-500 mt-1 font-semibold">{newMatErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Đơn Vị Tính
                  </label>
                  <input
                    type="text"
                    value={newMatForm.unit}
                    onChange={(e) => setNewMatForm({ ...newMatForm, unit: e.target.value })}
                    placeholder="Cuộn, Tấm, Can..."
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Số Lượng Nhập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newMatForm.quantity}
                    onChange={(e) => {
                      setNewMatForm({ ...newMatForm, quantity: Number(e.target.value) });
                      if (newMatErrors.quantity) setNewMatErrors({ ...newMatErrors, quantity: undefined });
                    }}
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: newMatErrors.quantity ? 'var(--bad)' : 'var(--line)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Định Mức Min
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newMatForm.minStock}
                    onChange={(e) => setNewMatForm({ ...newMatForm, minStock: Number(e.target.value) })}
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Đơn Giá Vốn Nhập (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={newMatForm.unitPrice}
                    onChange={(e) => setNewMatForm({ ...newMatForm, unitPrice: Number(e.target.value) })}
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Vị Trí Lưu Kho Xưởng
                  </label>
                  <input
                    type="text"
                    value={newMatForm.location}
                    onChange={(e) => setNewMatForm({ ...newMatForm, location: e.target.value })}
                    placeholder="Kho A - Kệ Cuộn 01"
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="vessa-btn vessa-btn-ghost h-9 px-4 text-xs font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="vessa-btn vessa-btn-primary h-9 px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Nhập Kho</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Xuất Kho Cho Đơn In */}
      {isExportModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExportModalOpen(false);
          }}
        >
          <div 
            className="w-full max-w-lg rounded-3xl p-6 shadow-2xl border animate-in zoom-in-95 duration-150"
            style={{
              background: 'var(--raised)',
              borderColor: 'var(--line)',
              color: 'var(--text)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--well)', color: 'var(--good)' }}
                >
                  <ArrowUpRight className="w-5 h-5 stroke-[2.2] text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Phiếu Xuất Kho Vật Tư</h3>
                  <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    Cấp phát cuộn bạt, decal, tấm mica/alu cho thợ máy & xưởng in
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsExportModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                style={{ background: 'var(--surface-2)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExportStock} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                  Chọn Mặt Hàng Cần Xuất <span className="text-rose-500">*</span>
                </label>
                <select
                  value={exportForm.materialId}
                  onChange={(e) => {
                    setExportForm({ ...exportForm, materialId: e.target.value });
                    setExportError(null);
                  }}
                  className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                >
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      [{it.sku}] {it.name} — Còn tồn: {it.quantity} {it.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Số Lượng Xuất <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={exportForm.quantity}
                    onChange={(e) => {
                      setExportForm({ ...exportForm, quantity: Number(e.target.value) });
                      setExportError(null);
                    }}
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: exportError ? 'var(--bad)' : 'var(--line)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Mã Đơn Hàng / Dự Án
                  </label>
                  <input
                    type="text"
                    required
                    value={exportForm.orderCode}
                    onChange={(e) => setExportForm({ ...exportForm, orderCode: e.target.value })}
                    placeholder="DH-8892 (VinFast...)"
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>
              </div>

              {exportError && (
                <div className="p-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-600 text-xs font-semibold">
                  {exportError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                  Ghi Chú Mục Đích Xuất
                </label>
                <input
                  type="text"
                  value={exportForm.note}
                  onChange={(e) => setExportForm({ ...exportForm, note: e.target.value })}
                  placeholder="Giao máy in Mimaki UV số 2..."
                  className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="vessa-btn vessa-btn-ghost h-9 px-4 text-xs font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="vessa-btn vessa-btn-primary h-9 px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Xuất Kho</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
