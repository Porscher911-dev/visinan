import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Plus,
  DollarSign,
  Printer,
  ChevronRight,
  ShieldAlert,
  Award
} from 'lucide-react';
import { INITIAL_PRINT_CUSTOMERS, INITIAL_PRINT_ORDERS } from '../../data/printingData';
import { CustomerItem } from '../../types';

export const VessaCrmView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_PRINT_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem>(INITIAL_PRINT_CUSTOMERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  const filteredCustomers = customers.filter(c => {
    const matchTier = tierFilter === 'ALL' || c.tier === tierFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || c.name.toLowerCase().includes(q) || (c.company && c.company.toLowerCase().includes(q)) || c.phone.includes(q);
    return matchTier && matchQ;
  });

  // Orders related to selected customer
  const customerOrders = INITIAL_PRINT_ORDERS.filter(o => 
    o.customerName.toLowerCase().includes(selectedCustomer.name.toLowerCase()) || 
    (selectedCustomer.company && o.customerName.toLowerCase().includes(selectedCustomer.company.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
            Quan Hệ Khách Hàng (CRM)
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Hồ Sơ Khách Hàng In Ấn & Bảng Hiệu
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Quản lý hạn mức công nợ, lịch sử chi tiêu, các dự án thi công và thông tin liên hệ đại diện.
          </p>
        </div>

        <button
          type="button"
          className="vessa-btn vessa-btn-primary h-10 px-4 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm Khách Hàng Mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="vessa-input flex items-center gap-2 px-3 h-10 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên khách, công ty, SĐT..."
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
            { id: 'VIP', label: 'Khách VIP' },
            { id: 'LOYAL', label: 'Thân Thiết' },
            { id: 'NEW', label: 'Khách Mới' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTierFilter(tab.id)}
              className="px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap"
              style={{
                background: tierFilter === tab.id ? 'var(--text)' : 'transparent',
                color: tierFilter === tab.id ? 'var(--bg)' : 'var(--muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Customers List & Detail Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredCustomers.map((cust) => {
            const isSelected = selectedCustomer.id === cust.id;
            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className="p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2"
                style={{
                  background: isSelected ? 'var(--surface)' : 'var(--surface-2)',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--line)',
                  boxShadow: isSelected ? 'var(--shadow)' : 'none'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs" style={{ color: 'var(--primary)' }}>
                    {cust.code}
                  </span>
                  <span className={`vessa-badge ${
                    cust.tier === 'VIP' ? 'vessa-badge-good' :
                    cust.tier === 'LOYAL' ? 'vessa-badge-info' : 'vessa-badge-plain'
                  }`}>
                    {cust.tier}
                  </span>
                </div>

                <div className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>
                  {cust.name}
                </div>
                {cust.company && (
                  <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                    {cust.company}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                  <span className="font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                    {(cust.totalSpent / 1000000).toFixed(1)} tr đ
                  </span>
                  {cust.currentDebt > 0 ? (
                    <span className="text-[11px] font-bold" style={{ color: 'var(--bad)' }}>
                      Nợ: {(cust.currentDebt / 1000000).toFixed(1)} tr đ
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold" style={{ color: 'var(--good)' }}>
                      Sạch nợ
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Customer Detailed Profile (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="vessa-card space-y-5">
            {/* Header info */}
            <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                    {selectedCustomer.name}
                  </h2>
                  <span className="vessa-badge vessa-badge-good">{selectedCustomer.tier}</span>
                </div>
                {selectedCustomer.company && (
                  <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted)' }}>
                    {selectedCustomer.company}
                  </div>
                )}
                <div className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedCustomer.address}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--muted)' }}>Đơn Gần Nhất</div>
                <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>{selectedCustomer.lastOrderDate}</div>
              </div>
            </div>

            {/* Quick Contact & Debt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                <div className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Số Điện Thoại</div>
                <a href={`tel:${selectedCustomer.phone}`} className="text-sm font-bold mt-0.5 block hover:underline" style={{ color: 'var(--primary)' }}>
                  {selectedCustomer.phone}
                </a>
              </div>

              <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                <div className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Tổng Tiền Đã Chi</div>
                <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--text)' }}>
                  {selectedCustomer.totalSpent.toLocaleString()} đ
                </div>
              </div>

              <div className="p-3 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                <div className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Công Nợ Hiện Tại</div>
                <div className="text-sm font-bold mt-0.5" style={{ color: selectedCustomer.currentDebt > 0 ? 'var(--bad)' : 'var(--good)' }}>
                  {selectedCustomer.currentDebt.toLocaleString()} đ
                </div>
              </div>
            </div>

            {/* Customer Orders History */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Lịch Sử Đơn Hàng Của Khách Hàng Này
              </div>

              <div className="space-y-2">
                {customerOrders.length > 0 ? (
                  customerOrders.map((ord) => (
                    <div 
                      key={ord.id}
                      className="p-3 rounded-xl border flex items-center justify-between text-xs"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                    >
                      <div>
                        <div className="font-bold" style={{ color: 'var(--text)' }}>
                          <span style={{ color: 'var(--primary)' }}>{ord.code}</span> — {ord.projectName}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                          Ngày tạo: {ord.createdAt} • Diện tích: {ord.totalM2} m²
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold">{ord.contractValue.toLocaleString()} đ</div>
                        <div className="text-[11px]" style={{ color: ord.debtAmount > 0 ? 'var(--bad)' : 'var(--good)' }}>
                          {ord.debtAmount > 0 ? `Còn nợ: ${ord.debtAmount.toLocaleString()} đ` : 'Đã thanh toán đủ'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-center py-6" style={{ color: 'var(--muted)' }}>
                    Không có đơn hàng nào trong kỳ này.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
