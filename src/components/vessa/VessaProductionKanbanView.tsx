import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  User,
  Plus,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { INITIAL_PRINT_ORDERS } from '../../data/printingData';
import { PrintOrder, OrderProgressStatus } from '../../types';

export const VessaProductionKanbanView: React.FC = () => {
  const [orders, setOrders] = useState<PrintOrder[]>(INITIAL_PRINT_ORDERS);
  const [activeOrderModal, setActiveOrderModal] = useState<PrintOrder | null>(null);

  // Kanban Columns configuration
  const columns: { id: OrderProgressStatus; title: string; count: number; color: string }[] = [
    { id: 'FILE_CHECK', title: '1. Tiếp Nhận & Duyệt File In', count: orders.filter(o => o.status === 'FILE_CHECK').length, color: 'var(--ochre)' },
    { id: 'PRINTING', title: '2. Đang Chạy Máy In', count: orders.filter(o => o.status === 'PRINTING').length, color: 'var(--sky)' },
    { id: 'POST_PROCESSING', title: '3. Gia Công Sau In & KCS', count: orders.filter(o => o.status === 'POST_PROCESSING').length, color: 'var(--teal)' },
    { id: 'READY_INSTALL', title: '4. Sẵn Sàng Thi Công / Giao', count: orders.filter(o => o.status === 'READY_INSTALL').length, color: 'var(--primary)' },
    { id: 'COMPLETED', title: '5. Hoàn Thành & Nghiệm Thu', count: orders.filter(o => o.status === 'COMPLETED').length, color: 'var(--good)' }
  ];

  // Move order across stages
  const handleMoveOrder = (orderId: string, nextStatus: OrderProgressStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus, progress: nextStatus === 'COMPLETED' ? 100 : Math.min(o.progress + 25, 95) } : o));
    if (activeOrderModal && activeOrderModal.id === orderId) {
      setActiveOrderModal(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
            Điều Hành Xưởng Sản Xuất
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Bảng Kanban Lệnh In & Gia Công Sau In
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Quản trị luồng công việc từ duyệt maket, phân máy in, gia công xỏ que/uốn nổi, kiểm tra KCS đến nghiệm thu.
          </p>
        </div>

        {/* Machine Status Pill */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5" style={{ color: 'var(--good)' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--good)' }} /> 4 Máy Đang Chạy
          </span>
          <span className="flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--muted)' }} /> 1 Máy Chờ Lệnh
          </span>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const colOrders = orders.filter(o => o.status === col.id);
          return (
            <div 
              key={col.id} 
              className="p-3 rounded-2xl border flex flex-col gap-3 min-h-[480px]"
              style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
                <span className="font-bold text-xs truncate" style={{ color: 'var(--text)' }}>
                  {col.title}
                </span>
                <span 
                  className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center tabular-nums"
                  style={{ background: 'var(--well)', color: 'var(--text)' }}
                >
                  {col.count}
                </span>
              </div>

              {/* Order Cards List */}
              <div className="space-y-3">
                {colOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setActiveOrderModal(ord)}
                    className="p-3.5 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5 space-y-2.5"
                    style={{
                      background: 'var(--surface-2)',
                      borderColor: 'var(--line)',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs" style={{ color: 'var(--primary)' }}>
                        {ord.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.proofApproved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {ord.proofApproved ? 'KCS Đạt' : 'Chờ Duyệt'}
                      </span>
                    </div>

                    <div className="font-bold text-xs leading-snug" style={{ color: 'var(--text)' }}>
                      {ord.projectName}
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                      Khách: {ord.customerName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                      <span style={{ color: 'var(--primary)' }}>
                        {ord.totalM2} m²
                      </span>
                      <span className="flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                        <Clock className="w-3 h-3" />
                        {ord.deadline.split(' ')[0]}
                      </span>
                    </div>

                    {/* Fast advance button */}
                    {col.id !== 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextMap: Record<OrderProgressStatus, OrderProgressStatus> = {
                            'FILE_CHECK': 'PRINTING',
                            'PRINTING': 'POST_PROCESSING',
                            'POST_PROCESSING': 'READY_INSTALL',
                            'READY_INSTALL': 'COMPLETED',
                            'COMPLETED': 'COMPLETED'
                          };
                          handleMoveOrder(ord.id, nextMap[ord.status]);
                        }}
                        className="vessa-btn vessa-btn-ghost vessa-btn-xs w-full text-[11px] flex items-center justify-center gap-1 mt-1"
                      >
                        <span>Chuyển Sang Bước Tiếp</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {colOrders.length === 0 && (
                  <div className="text-center py-10 text-xs" style={{ color: 'var(--muted)' }}>
                    Không có đơn ở khâu này
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Job Ticket Modal */}
      {activeOrderModal && (
        <div className="vessa-finder-overlay" onClick={() => setActiveOrderModal(null)}>
          <div 
            className="vessa-finder-card max-w-xl w-full p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div>
                <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                  LỆNH SẢN XUẤT XƯỞNG IN: {activeOrderModal.code}
                </span>
                <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text)' }}>
                  {activeOrderModal.projectName}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveOrderModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                <div>Khách hàng: <strong>{activeOrderModal.customerName}</strong></div>
                <div>Điện thoại: <strong>{activeOrderModal.customerPhone}</strong></div>
                <div>Máy in phụ trách: <strong>{activeOrderModal.machineAssigned}</strong></div>
                <div>Thợ in: <strong>{activeOrderModal.assignedOperator}</strong></div>
                <div>Tổng diện tích: <strong style={{ color: 'var(--primary)' }}>{activeOrderModal.totalM2} m²</strong></div>
                <div>Hạn giao: <strong style={{ color: 'var(--bad)' }}>{activeOrderModal.deadline}</strong></div>
              </div>

              {activeOrderModal.notes && (
                <div className="p-3 rounded-xl border" style={{ background: 'var(--well)', borderColor: 'var(--line)' }}>
                  <span className="font-bold block mb-1">Ghi Chú Kỹ Thuật:</span>
                  <div>{activeOrderModal.notes}</div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setActiveOrderModal(null)}
                  className="vessa-btn vessa-btn-ghost vessa-btn-sm"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleMoveOrder(activeOrderModal.id, 'COMPLETED');
                    setActiveOrderModal(null);
                  }}
                  className="vessa-btn vessa-btn-primary vessa-btn-sm"
                >
                  Xác Nhận KCS & Nghiệm Thu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
