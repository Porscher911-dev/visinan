import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveNavTab } from '../../types';
import { INITIAL_PRINT_ORDERS, INITIAL_PRINT_ESTIMATES, INITIAL_PRINT_CUSTOMERS, PRINT_MATERIALS_CATALOG } from '../../data/printingData';
import { Search, X, Printer, FileText, Package, Users, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VessaCommandFinder: React.FC<Props> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter orders
  const filteredOrders = INITIAL_PRINT_ORDERS.filter(o =>
    !q || o.code.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.projectName.toLowerCase().includes(q)
  );

  // Filter estimates
  const filteredEstimates = INITIAL_PRINT_ESTIMATES.filter(e =>
    !q || e.code.toLowerCase().includes(q) || e.customerName.toLowerCase().includes(q) || (e.customerCompany && e.customerCompany.toLowerCase().includes(q))
  );

  // Filter customers
  const filteredCustomers = INITIAL_PRINT_CUSTOMERS.filter(c =>
    !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.company && c.company.toLowerCase().includes(q))
  );

  // Filter materials
  const filteredMaterials = PRINT_MATERIALS_CATALOG.filter(m =>
    !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
  );

  const handleSelect = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div 
      className="vessa-finder-overlay animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="vessa-finder-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search bar input */}
        <div 
          className="finder__bar flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: 'var(--line)' }}
        >
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo Mã đơn (DH-8892), Khách hàng, Báo giá, Vật tư..."
            className="w-full text-base bg-transparent border-0 outline-none font-semibold"
            style={{ color: 'var(--text)' }}
          />
          <kbd 
            onClick={onClose}
            className="cursor-pointer text-xs font-mono px-2 py-1 rounded border hover:bg-slate-100 dark:hover:bg-slate-800"
            style={{
              borderColor: 'var(--line-2)',
              color: 'var(--muted)',
              background: 'var(--surface-2)'
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[55vh] overflow-y-auto p-3 space-y-4">
          {/* Orders Section */}
          {filteredOrders.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Đơn Hàng & Dự Án Đang Chạy
              </div>
              <div className="space-y-1 mt-1">
                {filteredOrders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => handleSelect('orders')}
                    className="p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                    style={{ background: 'var(--surface-2)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-600">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                          <span style={{ color: 'var(--primary)' }}>{ord.code}</span> — {ord.projectName}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                          {ord.customerName} • {ord.totalM2}m² • Tiến độ: {ord.progress}%
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estimates Section */}
          {filteredEstimates.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Báo Giá & Dự Toán
              </div>
              <div className="space-y-1 mt-1">
                {filteredEstimates.slice(0, 3).map((est) => (
                  <div
                    key={est.id}
                    onClick={() => handleSelect('estimates')}
                    className="p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                    style={{ background: 'var(--surface-2)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                          <span style={{ color: 'var(--ochre)' }}>{est.code}</span> — {est.customerCompany || est.customerName}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                          Tổng: {est.grandTotalVND.toLocaleString()} đ • Biên lợi nhuận: {est.marginPercent}%
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers Section */}
          {filteredCustomers.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Khách Hàng (CRM)
              </div>
              <div className="space-y-1 mt-1">
                {filteredCustomers.slice(0, 2).map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => handleSelect('crm')}
                    className="p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                    style={{ background: 'var(--surface-2)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                          {cust.name} ({cust.company || 'Cá nhân'})
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                          ĐT: {cust.phone} • Đã chi: {cust.totalSpent.toLocaleString()} đ
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials Section */}
          {filteredMaterials.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Vật Tư & Đơn Giá Chuẩn
              </div>
              <div className="space-y-1 mt-1">
                {filteredMaterials.slice(0, 3).map((mat, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect('inventory')}
                    className="p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                    style={{ background: 'var(--surface-2)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/40 text-purple-600">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                          {mat.name}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                          Giá bán: {mat.pricePerM2.toLocaleString()} đ/{mat.unit} • Vốn: {mat.costPerM2.toLocaleString()} đ
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredOrders.length === 0 && filteredEstimates.length === 0 && filteredCustomers.length === 0 && filteredMaterials.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--muted)' }}>
              Không tìm thấy dữ liệu phù hợp với từ khóa "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
