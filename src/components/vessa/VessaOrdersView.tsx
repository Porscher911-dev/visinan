import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Eye,
  FileCheck,
  Wrench,
  DollarSign,
  User,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { INITIAL_PRINT_ORDERS } from '../../data/printingData';
import { PrintOrder, OrderProgressStatus } from '../../types';
import { FirebaseService } from '../../services/firebase';

export const VessaOrdersView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [orders, setOrders] = useState<PrintOrder[]>(() => {
    try {
      const cached = localStorage.getItem('fb_cache_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PRINT_ORDERS;
  });
  const [selectedOrder, setSelectedOrder] = useState<PrintOrder | null>(() => {
    try {
      const cached = localStorage.getItem('fb_cache_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {}
    return INITIAL_PRINT_ORDERS[0];
  });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderTab, setOrderTab] = useState<'overview' | 'production' | 'installation' | 'finance'>('overview');

  // Firebase Realtime Sync
  useEffect(() => {
    let isMounted = true;
    FirebaseService.getNode<PrintOrder[]>('orders').then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setOrders(data);
        if (data[0]) setSelectedOrder(data[0]);
      } else {
        FirebaseService.syncNode('orders', INITIAL_PRINT_ORDERS);
      }
    });

    const unsubscribe = FirebaseService.subscribeNode<PrintOrder[]>('orders', (data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);


  const filteredOrders = orders.filter((ord) => {
    const matchStatus = statusFilter === 'ALL' || ord.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      ord.code.toLowerCase().includes(q) ||
      ord.customerName.toLowerCase().includes(q) ||
      ord.projectName.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  const getStatusBadge = (status: OrderProgressStatus) => {
    switch (status) {
      case 'FILE_CHECK':
        return <span className="vessa-badge vessa-badge-warn">Duyệt File</span>;
      case 'PRINTING':
        return <span className="vessa-badge vessa-badge-warn">Đang In</span>;
      case 'POST_PROCESSING':
        return <span className="vessa-badge vessa-badge-info">Gia Công Sau In</span>;
      case 'READY_INSTALL':
        return <span className="vessa-badge vessa-badge-info">Chờ Thi Công</span>;
      case 'COMPLETED':
        return <span className="vessa-badge vessa-badge-good">Đã Nghiệm Thu</span>;
      default:
        return <span className="vessa-badge vessa-badge-plain">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
            Quản Lý Sản Xuất & Hợp Đồng
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Đơn Hàng & Dự Án Quảng Cáo
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Theo dõi tiến độ từ khâu tiếp nhận file in, xếp máy, gia công tại xưởng đến bàn giao công trình.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('estimates')}
          className="vessa-btn vessa-btn-ghost h-10 px-4 text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Tạo Từ Báo Giá Đã Chốt</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="vessa-input flex items-center gap-2 px-3 h-10 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm mã đơn, tên khách..."
            className="bg-transparent border-0 outline-none w-full text-xs font-medium"
            style={{ color: 'var(--text)' }}
          />
        </div>

        {/* Status Pills */}
        <div 
          className="seg flex items-center p-1 rounded-full border overflow-x-auto w-full sm:w-auto"
          style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
        >
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'FILE_CHECK', label: 'Duyệt Maket' },
            { id: 'PRINTING', label: 'Đang In' },
            { id: 'POST_PROCESSING', label: 'Gia Công' },
            { id: 'READY_INSTALL', label: 'Thi Công' },
            { id: 'COMPLETED', label: 'Hoàn Thành' }
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className="px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap"
                style={{
                  background: isSelected ? 'var(--text)' : 'transparent',
                  color: isSelected ? 'var(--bg)' : 'var(--muted)'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Orders Table / List & Detailed Drawer Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders Table (7 Cols) */}
        <div className="lg:col-span-7 vessa-card p-0 overflow-hidden">
          <div className="vessa-table-wrap">
            <table className="vessa-table">
              <thead>
                <tr>
                  <th>Mã Đơn / Dự Án</th>
                  <th>Khách Hàng</th>
                  <th className="text-right">Hợp Đồng (VNĐ)</th>
                  <th className="text-center">Tiến Độ</th>
                  <th className="text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className="cursor-pointer transition-colors"
                      style={{
                        background: isSelected ? 'var(--surface-2)' : 'transparent'
                      }}
                    >
                      <td>
                        <div className="font-bold text-xs" style={{ color: 'var(--primary)' }}>
                          {ord.code}
                        </div>
                        <div className="font-semibold text-xs truncate max-w-[180px]" style={{ color: 'var(--text)' }}>
                          {ord.projectName}
                        </div>
                      </td>
                      <td>
                        <div className="text-xs font-semibold truncate max-w-[140px]" style={{ color: 'var(--text)' }}>
                          {ord.customerName}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                          ĐT: {ord.customerPhone}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="font-bold text-xs tabular-nums" style={{ color: 'var(--text)' }}>
                          {ord.contractValue.toLocaleString()} đ
                        </div>
                        {ord.debtAmount > 0 ? (
                          <div className="text-[10px] font-bold" style={{ color: 'var(--bad)' }}>
                            Nợ: {ord.debtAmount.toLocaleString()} đ
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold" style={{ color: 'var(--good)' }}>
                            Đã thu đủ 100%
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="text-xs font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                          {ord.progress}%
                        </div>
                        <div className="w-16 h-1.5 rounded-full mx-auto mt-1 overflow-hidden" style={{ background: 'var(--well)' }}>
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${ord.progress}%`, 
                              background: ord.progress === 100 ? 'var(--good)' : 'var(--primary)' 
                            }} 
                          />
                        </div>
                      </td>
                      <td className="text-center">
                        {getStatusBadge(ord.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Comprehensive Detail Panel (5 Cols) */}
        <div className="lg:col-span-5">
          {selectedOrder ? (
            <div className="vessa-card space-y-4">
              {/* Order Header */}
              <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                      {selectedOrder.code}
                    </span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="font-bold text-sm mt-0.5" style={{ color: 'var(--text)' }}>
                    {selectedOrder.projectName}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    Khách: {selectedOrder.customerName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--muted)' }}>Hạn Giao Hàng</div>
                  <div className="text-xs font-bold" style={{ color: 'var(--bad)' }}>{selectedOrder.deadline}</div>
                </div>
              </div>

              {/* Subtabs for Order Details */}
              <div 
                className="seg flex items-center p-1 rounded-full border"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
              >
                {[
                  { id: 'overview', label: 'Tổng Quan' },
                  { id: 'production', label: 'Xưởng In' },
                  { id: 'installation', label: 'Thi Công' },
                  { id: 'finance', label: 'Thanh Toán' }
                ].map((t) => {
                  const isCur = orderTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setOrderTab(t.id as any)}
                      className="flex-1 py-1 text-xs font-bold rounded-full transition-all"
                      style={{
                        background: isCur ? 'var(--text)' : 'transparent',
                        color: isCur ? 'var(--bg)' : 'var(--muted)'
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Overview */}
              {orderTab === 'overview' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl border space-y-2" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                    <div className="font-bold flex items-center justify-between">
                      <span style={{ color: 'var(--muted)' }}>Hệ Thống Máy In Phụ Trách:</span>
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>{selectedOrder.machineAssigned}</span>
                    </div>
                    <div className="font-bold flex items-center justify-between">
                      <span style={{ color: 'var(--muted)' }}>Thiết Kế Đã Duyệt File:</span>
                      <span className="font-semibold" style={{ color: selectedOrder.proofApproved ? 'var(--good)' : 'var(--bad)' }}>
                        {selectedOrder.proofApproved ? '✓ Đã duyệt maket' : '✗ Đang chỉnh sửa file'}
                      </span>
                    </div>
                    <div className="font-bold flex items-center justify-between">
                      <span style={{ color: 'var(--muted)' }}>Thợ Vận Hành Máy:</span>
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>{selectedOrder.assignedOperator}</span>
                    </div>
                    <div className="font-bold flex items-center justify-between">
                      <span style={{ color: 'var(--muted)' }}>Tổng Khối Lượng In:</span>
                      <span className="font-bold" style={{ color: 'var(--primary)' }}>{selectedOrder.totalM2} m²</span>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div className="p-3 rounded-xl border" style={{ background: 'var(--well)', borderColor: 'var(--line)' }}>
                      <div className="text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--muted)' }}>Ghi Chú Kỹ Thuật</div>
                      <div style={{ color: 'var(--text)' }}>{selectedOrder.notes}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Production */}
              {orderTab === 'production' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl border space-y-2.5" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                    <div className="font-bold" style={{ color: 'var(--text)' }}>Quy Trình Gia Công Sau In:</div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>In phun kỹ thuật số mực UV 3 lớp</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Cán màng mờ bảo vệ chống tia cực tím</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Gấp mép xỏ que sắt D21 & đóng khoen 4 góc</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('production')}
                    className="vessa-btn vessa-btn-primary w-full text-xs font-bold"
                  >
                    Mở Bảng Điều Hành Xưởng In
                  </button>
                </div>
              )}

              {/* Tab 3: Installation */}
              {orderTab === 'installation' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl border space-y-2" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                    <div className="font-bold" style={{ color: 'var(--text)' }}>Đội Thi Công Bảng Hiệu Hiện Trường</div>
                    <div>Địa điểm: Showroom VinFast Bình Triệu (TP. Thủ Đức)</div>
                    <div>Thời gian dự kiến: 21:00 hôm nay</div>
                    <div>Thợ phụ trách: Đội 1 (3 nhân sự) • Trưởng nhóm: Mr. Tài</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('installation')}
                    className="vessa-btn vessa-btn-ghost w-full text-xs font-bold"
                  >
                    Xem Điều Phối Thi Công Hiện Trường
                  </button>
                </div>
              )}

              {/* Tab 4: Finance */}
              {orderTab === 'finance' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl border space-y-2" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                    <div className="flex justify-between font-bold">
                      <span style={{ color: 'var(--muted)' }}>Tổng Giá Trị Hợp Đồng:</span>
                      <span style={{ color: 'var(--text)' }}>{selectedOrder.contractValue.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between font-bold" style={{ color: 'var(--good)' }}>
                      <span>Đã Tạm Ứng / Thanh Toán:</span>
                      <span>{selectedOrder.paidAmount.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t" style={{ borderColor: 'var(--line)', color: selectedOrder.debtAmount > 0 ? 'var(--bad)' : 'var(--good)' }}>
                      <span>Công Nợ Còn Lại:</span>
                      <span>{selectedOrder.debtAmount.toLocaleString()} đ</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('finance')}
                    className="vessa-btn vessa-btn-primary w-full text-xs font-bold"
                  >
                    Vào Sổ Quỹ Thu Chi & Hóa Đơn
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="vessa-card text-center py-16" style={{ color: 'var(--muted)' }}>
              Chọn đơn hàng để xem chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
