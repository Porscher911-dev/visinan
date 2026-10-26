import React, { useState, useEffect } from 'react';
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
  Award,
  X,
  CheckCircle2,
  Building,
  UserCheck
} from 'lucide-react';
import { INITIAL_PRINT_CUSTOMERS, INITIAL_PRINT_ORDERS } from '../../data/printingData';
import { CustomerItem } from '../../types';
import { FirebaseService } from '../../services/firebase';

interface Props {
  initialOpenAdd?: boolean;
}

export const VessaCrmView: React.FC<Props> = ({ initialOpenAdd = false }) => {
  const [customers, setCustomers] = useState<CustomerItem[]>(() => {
    try {
      const cached = localStorage.getItem('fb_cache_customers');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PRINT_CUSTOMERS;
  });

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem>(() => {
    try {
      const cached = localStorage.getItem('fb_cache_customers');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {}
    return INITIAL_PRINT_CUSTOMERS[0];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  // Firebase Realtime Sync
  useEffect(() => {
    let isMounted = true;
    FirebaseService.getNode<CustomerItem[]>('customers').then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setCustomers(data);
        if (data[0]) setSelectedCustomer(data[0]);
      } else {
        FirebaseService.syncNode('customers', INITIAL_PRINT_CUSTOMERS);
      }
    });

    const unsubscribe = FirebaseService.subscribeNode<CustomerItem[]>('customers', (data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setCustomers(data);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);


  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialOpenAdd);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Customer Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    tier: 'NEW' as 'VIP' | 'LOYAL' | 'NEW',
    currentDebt: 0
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = () => {
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      tier: 'NEW',
      currentDebt: 0
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên khách hàng hoặc người đại diện';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^[0-9+.\s()-]{8,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Số điện thoại không hợp lệ (8-15 chữ số)';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const codeNum = (customers.length + 1).toString().padStart(3, '0');
    const newCustomer: CustomerItem = {
      id: `cust-${Date.now()}`,
      code: `KH-${codeNum}`,
      name: formData.name.trim(),
      company: formData.company.trim() || undefined,
      phone: formData.phone.trim(),
      email: formData.email.trim() || `lienhe@${formData.company ? formData.company.toLowerCase().replace(/[^a-z0-9]/g, '') : 'khachhang'}.com`,
      address: formData.address.trim() || 'Hồ Chí Minh',
      tier: formData.tier,
      totalOrders: 0,
      totalSpent: 0,
      currentDebt: Number(formData.currentDebt) || 0,
      lastOrderDate: new Date().toISOString().split('T')[0]
    };

    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    setSelectedCustomer(newCustomer);
    setIsAddModalOpen(false);
    showToast(`Đã thêm thành công khách hàng "${newCustomer.name}" (${newCustomer.code})!`);

    // Đồng bộ lên Firebase Realtime Database
    FirebaseService.syncNode('customers', updated);
  };

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
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
          onClick={handleOpenModal}
          className="vessa-btn vessa-btn-primary h-10 px-4 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
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

      {/* Modal: Thêm Khách Hàng Mới */}
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
                  <UserCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Thêm Khách Hàng Mới</h3>
                  <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    Lưu trữ thông tin đối tác & hạn mức công nợ cho đơn in
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                style={{ background: 'var(--surface-2)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Tên Khách Hàng / Đại Diện <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="Nguyễn Văn A"
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: formErrors.name ? 'var(--bad)' : 'var(--line)' }}
                  />
                  {formErrors.name && (
                    <p className="text-[10px] text-rose-500 mt-1 font-semibold">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Doanh Nghiệp / Chuỗi Cửa Hàng
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Công ty CP Truyền Thông..."
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Số Điện Thoại Liên Hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    placeholder="0909 123 456"
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: formErrors.phone ? 'var(--bad)' : 'var(--line)' }}
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-rose-500 mt-1 font-semibold">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Địa Chỉ Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@doanhnghiep.vn"
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                  Địa Chỉ Giao Hàng / Lắp Đặt Bảng Hiệu
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                  className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Phân Hạng Khách Hàng
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  >
                    <option value="NEW">Khách Mới (NEW)</option>
                    <option value="LOYAL">Thân Thiết (LOYAL)</option>
                    <option value="VIP">Khách VIP (Ưu tiên sản xuất)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>
                    Công Nợ Ban Đầu (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500000"
                    value={formData.currentDebt || 0}
                    onChange={(e) => setFormData({ ...formData, currentDebt: Number(e.target.value) })}
                    className="vessa-input w-full h-9 px-3 text-xs font-semibold"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="vessa-btn vessa-btn-ghost h-9 px-4 text-xs font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="vessa-btn vessa-btn-primary h-9 px-5 text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu Khách Hàng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
