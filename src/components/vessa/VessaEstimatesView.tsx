import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Download,
  Calculator,
  Search,
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { INITIAL_PRINT_ESTIMATES, PRINT_MATERIALS_CATALOG } from '../../data/printingData';
import { PrintEstimate, PrintEstimateItem, PrintMaterialCategory } from '../../types';

export const VessaEstimatesView: React.FC = () => {
  const { currentUser } = useApp();
  const [estimates, setEstimates] = useState<PrintEstimate[]>(INITIAL_PRINT_ESTIMATES);
  const [selectedEstimate, setSelectedEstimate] = useState<PrintEstimate | null>(INITIAL_PRINT_ESTIMATES[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // New Estimate Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [projectName, setProjectName] = useState('');
  const [items, setItems] = useState<Omit<PrintEstimateItem, 'id'>[]>([
    {
      name: 'Bạt Hiflex Quảng Cáo Mặt Tiền',
      material: 'BAT_HIFLEX',
      widthM: 6.0,
      heightM: 3.0,
      quantity: 1,
      areaM2: 18.0,
      costPerM2: 24000,
      pricePerM2: 55000,
      finishOptions: ['Gấp mép xỏ que'],
      extraCost: 150000,
      totalCost: 18.0 * 24000 + 150000,
      totalAmount: 18.0 * 55000 + 150000 * 1.3
    }
  ]);

  const isExecutive = currentUser.role === 'CEO' || currentUser.role === 'MANAGER';

  // Handle adding a new line item in Estimate Creator
  const handleAddItem = () => {
    const defaultMat = PRINT_MATERIALS_CATALOG[0];
    const newItem: Omit<PrintEstimateItem, 'id'> = {
      name: defaultMat.name,
      material: defaultMat.category,
      widthM: 2.0,
      heightM: 1.0,
      quantity: 1,
      areaM2: 2.0,
      costPerM2: defaultMat.costPerM2,
      pricePerM2: defaultMat.pricePerM2,
      finishOptions: [],
      extraCost: 0,
      totalCost: 2.0 * defaultMat.costPerM2,
      totalAmount: 2.0 * defaultMat.pricePerM2
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    // When material changes, update price & cost defaults
    if (field === 'material') {
      const found = PRINT_MATERIALS_CATALOG.find(m => m.category === value);
      if (found) {
        current.costPerM2 = found.costPerM2;
        current.pricePerM2 = found.pricePerM2;
        current.name = found.name;
      }
    }

    // Recalculate area, cost, amount
    const w = Number(current.widthM) || 0;
    const h = Number(current.heightM) || 0;
    const q = Number(current.quantity) || 1;
    const area = Number((w * h * q).toFixed(2));
    current.areaM2 = area;

    const extra = Number(current.extraCost) || 0;
    current.totalCost = Math.round(area * current.costPerM2 + extra);
    current.totalAmount = Math.round(area * current.pricePerM2 + extra * 1.3);

    updated[index] = current;
    setItems(updated);
  };

  // Grand totals for creator modal
  const calcSubtotal = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const calcCost = items.reduce((sum, item) => sum + item.totalCost, 0);
  const calcProfit = calcSubtotal - calcCost;
  const calcMargin = calcSubtotal > 0 ? ((calcProfit / calcSubtotal) * 100).toFixed(1) : '0';

  const handleSaveEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !projectName) {
      alert('Vui lòng nhập tên khách hàng và tên dự án.');
      return;
    }

    const newEst: PrintEstimate = {
      id: `est-${Date.now()}`,
      code: `BG-2026-${String(estimates.length + 89).padStart(3, '0')}`,
      customerName,
      customerPhone: customerPhone || 'Chưa cung cấp',
      customerCompany,
      projectName,
      items: items.map((item, idx) => ({ ...item, id: `item-${idx}` })),
      totalAreaM2: items.reduce((sum, item) => sum + item.areaM2, 0),
      totalCostVND: calcCost,
      subtotalVND: calcSubtotal,
      discountVND: 0,
      vatRate: 0.08,
      grandTotalVND: Math.round(calcSubtotal * 1.08),
      grossProfitVND: calcProfit,
      marginPercent: Number(calcMargin),
      status: 'SENT',
      validUntil: '2026-11-30',
      createdAt: new Date().toISOString().split('T')[0],
      salesperson: currentUser.name
    };

    setEstimates([newEst, ...estimates]);
    setSelectedEstimate(newEst);
    setShowCreateModal(false);
  };

  const filteredEstimates = estimates.filter(e =>
    !filterQuery ||
    e.code.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.customerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (e.customerCompany && e.customerCompany.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
            Nghiệp Vụ Kinh Doanh • In Ấn & Quảng Cáo
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Báo Giá & Dự Toán Chi Phí Sản Xuất
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Tính tự động diện tích m², đơn giá theo mét vuông, kiểm soát giá vốn và biên lợi nhuận xưởng in.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="vessa-btn vessa-btn-primary h-10 px-4 text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tạo Báo Giá Mới</span>
        </button>
      </div>

      {/* Main Grid: List on Left, Preview Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Estimates Table / List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="vessa-input flex items-center gap-2 px-3 h-10 w-full">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Tìm mã báo giá, tên khách, công ty..."
              className="bg-transparent border-0 outline-none w-full text-xs font-medium"
              style={{ color: 'var(--text)' }}
            />
          </div>

          <div className="space-y-2.5">
            {filteredEstimates.map((est) => {
              const isSelected = selectedEstimate?.id === est.id;
              return (
                <div
                  key={est.id}
                  onClick={() => setSelectedEstimate(est)}
                  className="p-3.5 rounded-2xl border cursor-pointer transition-all"
                  style={{
                    background: isSelected ? 'var(--surface)' : 'var(--surface-2)',
                    borderColor: isSelected ? 'var(--primary)' : 'var(--line)',
                    boxShadow: isSelected ? 'var(--shadow)' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs" style={{ color: 'var(--primary)' }}>
                      {est.code}
                    </span>
                    <span className={`vessa-badge ${
                      est.status === 'ACCEPTED' ? 'vessa-badge-good' :
                      est.status === 'SENT' ? 'vessa-badge-info' : 'vessa-badge-plain'
                    }`}>
                      {est.status === 'ACCEPTED' ? 'Đã chốt đơn' :
                       est.status === 'SENT' ? 'Đã gửi khách' : 'Bản nháp'}
                    </span>
                  </div>

                  <div className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>
                    {est.projectName}
                  </div>
                  <div className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>
                    {est.customerCompany || est.customerName}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs" style={{ borderColor: 'var(--line)' }}>
                    <span className="font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                      {est.grandTotalVND.toLocaleString()} đ
                    </span>
                    {isExecutive && (
                      <span className="vessa-badge vessa-badge-good text-[10px]">
                        Lãi: {est.marginPercent}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Estimate Document Preview (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedEstimate ? (
            <div className="vessa-card space-y-5">
              {/* Top toolbar */}
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                    Chi Tiết Báo Giá In Ấn & Quảng Cáo
                  </span>
                  <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                    {selectedEstimate.code} — {selectedEstimate.projectName}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="vessa-btn vessa-btn-ghost vessa-btn-sm flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> In / PDF
                  </button>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-2xl" style={{ background: 'var(--surface-2)' }}>
                <div>
                  <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--muted)' }}>Khách Hàng</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--text)' }}>{selectedEstimate.customerName}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{selectedEstimate.customerCompany}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>ĐT: {selectedEstimate.customerPhone}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--muted)' }}>Hiệu Lực & Phụ Trách</div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text)' }}>Ngày lập: {selectedEstimate.createdAt}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>Hiệu lực đến: {selectedEstimate.validUntil}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--primary)' }}>Kinh doanh: {selectedEstimate.salesperson}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="vessa-table-wrap border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--line)' }}>
                <table className="vessa-table">
                  <thead>
                    <tr>
                      <th>Hạng Mục In & Gia Công</th>
                      <th className="text-center">Kích Thước (m)</th>
                      <th className="text-center">SL</th>
                      <th className="text-right">Diện Tích (m²)</th>
                      <th className="text-right">Đơn Giá Bán</th>
                      <th className="text-right">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEstimate.items.map((it, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="font-bold text-xs" style={{ color: 'var(--text)' }}>{it.name}</div>
                          {it.finishOptions.length > 0 && (
                            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                              Quy cách: {it.finishOptions.join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="text-center text-xs tabular-nums">
                          {it.widthM} x {it.heightM}m
                        </td>
                        <td className="text-center text-xs tabular-nums font-bold">
                          {it.quantity}
                        </td>
                        <td className="text-right text-xs tabular-nums font-semibold">
                          {it.areaM2} m²
                        </td>
                        <td className="text-right text-xs tabular-nums">
                          {it.pricePerM2.toLocaleString()} đ
                        </td>
                        <td className="text-right text-xs tabular-nums font-bold" style={{ color: 'var(--text)' }}>
                          {it.totalAmount.toLocaleString()} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Summary Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
                {/* Cost & Margin box (Protected view for Executive) */}
                {isExecutive ? (
                  <div className="p-3 rounded-xl border text-xs space-y-1" style={{ background: 'var(--well)', borderColor: 'var(--line)' }}>
                    <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                      <Calculator className="w-3.5 h-3.5 text-blue-500" />
                      Giá Vốn & Biên Lợi Nhuận (Nội bộ Giám Đốc)
                    </div>
                    <div>Giá vốn vật tư & nhân công: <strong>{selectedEstimate.totalCostVND.toLocaleString()} đ</strong></div>
                    <div>Lợi nhuận gộp dự kiến: <strong style={{ color: 'var(--good)' }}>+{selectedEstimate.grossProfitVND.toLocaleString()} đ</strong></div>
                    <div>Tỷ suất margin: <strong style={{ color: 'var(--good)' }}>{selectedEstimate.marginPercent}%</strong></div>
                  </div>
                ) : <div />}

                {/* Final Quote Totals */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted)' }}>Cộng tiền hàng:</span>
                    <span className="font-semibold tabular-nums">{selectedEstimate.subtotalVND.toLocaleString()} đ</span>
                  </div>
                  {selectedEstimate.discountVND > 0 && (
                    <div className="flex justify-between" style={{ color: 'var(--bad)' }}>
                      <span>Chiết khấu:</span>
                      <span className="tabular-nums">-{selectedEstimate.discountVND.toLocaleString()} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted)' }}>Thuế VAT ({(selectedEstimate.vatRate * 100)}%):</span>
                    <span className="font-semibold tabular-nums">
                      {Math.round((selectedEstimate.subtotalVND - selectedEstimate.discountVND) * selectedEstimate.vatRate).toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t" style={{ borderColor: 'var(--line)', color: 'var(--primary)' }}>
                    <span>Tổng Thanh Toán:</span>
                    <span className="tabular-nums">{selectedEstimate.grandTotalVND.toLocaleString()} đ</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="vessa-card text-center py-16" style={{ color: 'var(--muted)' }}>
              Chọn một báo giá từ danh sách bên trái để xem nội dung chi tiết.
            </div>
          )}
        </div>
      </div>

      {/* Quick Create Estimate Modal */}
      {showCreateModal && (
        <div className="vessa-finder-overlay" onClick={() => setShowCreateModal(false)}>
          <div 
            className="vessa-finder-card max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                  Lập Báo Giá & Tính Giá Thành In Ấn Mới
                </h3>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Nhập quy cách kích thước (Rộng x Cao), chọn vật tư in hoặc hộp đèn để hệ thống tự tính giá vốn & đơn giá bán.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEstimate} className="space-y-4">
              {/* Customer Info row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: 'var(--muted)' }}>Tên Khách Hàng *</label>
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Anh Minh..."
                    className="vessa-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: 'var(--muted)' }}>Số Điện Thoại</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="VD: 0903.xxx.xxx"
                    className="vessa-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: 'var(--muted)' }}>Tên Công Ty / Đơn Vị</label>
                  <input
                    type="text"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    placeholder="VD: Cafe Highlands..."
                    className="vessa-input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1" style={{ color: 'var(--muted)' }}>Tên Dự Án / Hạng Mục Thi Công *</label>
                <input
                  required
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="VD: Thi Công Pano Mặt Tiền 6x3m & Biển Vẫy..."
                  className="vessa-input w-full text-xs"
                />
              </div>

              {/* Items List Form */}
              <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                    Danh Mục Sản Phẩm & Kích Thước In
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="vessa-btn vessa-btn-ghost vessa-btn-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Hàng
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-2xl border space-y-3"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        {/* Material selector */}
                        <div className="sm:col-span-5">
                          <label className="text-[10px] font-bold block mb-1" style={{ color: 'var(--muted)' }}>Chất Liệu In / Bảng Hiệu</label>
                          <select
                            value={item.material}
                            onChange={(e) => handleUpdateItem(idx, 'material', e.target.value)}
                            className="vessa-select w-full text-xs h-9 px-3"
                          >
                            {PRINT_MATERIALS_CATALOG.map((mat) => (
                              <option key={mat.category} value={mat.category}>
                                {mat.name} ({mat.pricePerM2.toLocaleString()} đ/{mat.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Width */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold block mb-1" style={{ color: 'var(--muted)' }}>Rộng (m)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={item.widthM}
                            onChange={(e) => handleUpdateItem(idx, 'widthM', parseFloat(e.target.value) || 0)}
                            className="vessa-input w-full text-xs h-9 px-2 text-center"
                          />
                        </div>

                        {/* Height */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold block mb-1" style={{ color: 'var(--muted)' }}>Cao (m)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={item.heightM}
                            onChange={(e) => handleUpdateItem(idx, 'heightM', parseFloat(e.target.value) || 0)}
                            className="vessa-input w-full text-xs h-9 px-2 text-center"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold block mb-1" style={{ color: 'var(--muted)' }}>SL (Tấm)</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                            className="vessa-input w-full text-xs h-9 px-2 text-center font-bold"
                          />
                        </div>

                        {/* Delete line */}
                        <div className="sm:col-span-1 flex items-end justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                            title="Xóa dòng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Calculations summary row */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                        <div className="flex items-center gap-3">
                          <span className="font-bold" style={{ color: 'var(--text)' }}>
                            Diện tích: {item.areaM2} m²
                          </span>
                          <span style={{ color: 'var(--muted)' }}>
                            Đơn giá bán: {item.pricePerM2.toLocaleString()} đ/m²
                          </span>
                        </div>
                        <div className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                          Thành tiền: {item.totalAmount.toLocaleString()} đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator Summary Footer */}
              <div className="p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                <div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>Tổng Giá Trị Báo Giá:</div>
                  <div className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                    {calcSubtotal.toLocaleString()} đ
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--good)' }}>
                    Lợi nhuận gộp dự kiến: +{calcProfit.toLocaleString()} đ ({calcMargin}%)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="vessa-btn vessa-btn-ghost vessa-btn-sm"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="vessa-btn vessa-btn-primary vessa-btn-sm"
                  >
                    Lưu & Xuất Báo Giá
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
