import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveNavTab } from '../../types';
import {
  LayoutDashboard,
  FileText,
  Printer,
  Package,
  Wrench,
  Users,
  DollarSign,
  CalendarCheck,
  CheckSquare,
  FileSpreadsheet,
  Megaphone,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
  X,
  Menu,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const VessaMobileNav: React.FC<Props> = ({
  isOpen,
  onOpen,
  onClose,
  isDarkMode,
  onToggleTheme
}) => {
  const { activeTab, setActiveTab, currentUser, logout, openProfileModal } = useApp();

  const handleSelectTab = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    onClose();
  };

  const navCategories = [
    {
      title: 'Vận Hành In & Bảng Hiệu',
      items: [
        { id: 'dashboard' as ActiveNavTab, label: 'Tổng Quan Điều Hành', icon: LayoutDashboard },
        { id: 'estimates' as ActiveNavTab, label: 'Báo Giá & Dự Toán', icon: FileText },
        { id: 'orders' as ActiveNavTab, label: 'Đơn Hàng & Hợp Đồng', icon: Printer, count: 5 },
        { id: 'production' as ActiveNavTab, label: 'Xưởng In & Gia Công', icon: Wrench },
        { id: 'inventory' as ActiveNavTab, label: 'Kho Vật Tư In Ấn', icon: Package },
        { id: 'installation' as ActiveNavTab, label: 'Đội Thi Công Bảng Hiệu', icon: Award },
        { id: 'crm' as ActiveNavTab, label: 'Hồ Sơ Khách Hàng (CRM)', icon: Users }
      ]
    },
    {
      title: 'Tài Chính & Kế Toán',
      items: [
        { id: 'finance' as ActiveNavTab, label: 'Thu Chi & Dòng Tiền', icon: DollarSign },
        { id: 'reports' as ActiveNavTab, label: 'Báo Cáo Doanh Thu', icon: TrendingUp },
        { id: 'payroll' as ActiveNavTab, label: 'Bảng Lương & Chi Phí', icon: DollarSign }
      ]
    },
    {
      title: 'Nhân Sự & Nội Bộ',
      items: [
        { id: 'employees' as ActiveNavTab, label: 'Nhân Sự & Phòng Ban', icon: Users },
        { id: 'attendance' as ActiveNavTab, label: 'Chấm Công GPS', icon: CalendarCheck },
        { id: 'tasks' as ActiveNavTab, label: 'Nhiệm Vụ & Phân Việc', icon: CheckSquare },
        { id: 'docs' as ActiveNavTab, label: 'Văn Bản & Mẫu Biểu', icon: FileSpreadsheet },
        { id: 'announcements' as ActiveNavTab, label: 'Bảng Tin Nội Bộ', icon: Megaphone },
        { id: 'chat' as ActiveNavTab, label: 'Chat Nhóm Công Ty', icon: MessageSquare }
      ]
    },
    {
      title: 'Hệ Thống',
      items: [
        { id: 'settings' as ActiveNavTab, label: 'Cài Đặt Hệ Thống', icon: Settings }
      ]
    }
  ];

  const primaryShortcuts: { id: ActiveNavTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'estimates', label: 'Báo Giá', icon: FileText },
    { id: 'orders', label: 'Đơn Hàng', icon: Printer, count: 5 },
    { id: 'production', label: 'Xưởng In', icon: Wrench }
  ];

  return (
    <>
      {/* 1. Floating Bottom Bar (visible on screens < lg) */}
      <nav 
        className="lg:hidden fixed bottom-3 left-3 right-3 z-40 transition-transform"
        aria-label="Thanh điều hướng nhanh di động"
      >
        <div 
          className="flex items-center justify-around py-2 px-1 rounded-2xl border shadow-xl backdrop-blur-xl"
          style={{
            background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
            borderColor: 'var(--line)',
            boxShadow: 'var(--shadow-pop)'
          }}
        >
          {primaryShortcuts.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all relative cursor-pointer"
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--muted)',
                  background: isActive ? 'var(--well)' : 'transparent'
                }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                  {item.count !== undefined && (
                    <span 
                      className="absolute -top-1 -right-2 text-[10px] font-bold px-1 rounded-full text-white"
                      style={{ background: 'var(--primary)' }}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-1 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More / Menu Drawer Toggle Button */}
          <button
            type="button"
            onClick={onOpen}
            className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer"
            style={{
              color: isOpen ? 'var(--primary)' : 'var(--muted)',
              background: isOpen ? 'var(--well)' : 'transparent'
            }}
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-bold mt-1 tracking-tight">
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* 2. Full Mobile Navigation Drawer (slide-in) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onClose}
          />

          {/* Drawer Sheet */}
          <div 
            className="relative w-[85%] max-w-xs h-full flex flex-col shadow-2xl border-r z-10 animate-in slide-in-from-left duration-250"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--line)',
              color: 'var(--text)'
            }}
          >
            {/* Drawer Top Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
              <div 
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => { openProfileModal(); onClose(); }}
              >
                <img 
                  src={currentUser.avatar || '/placeholder-avatar.png'} 
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border"
                  style={{ borderColor: 'var(--primary)' }}
                />
                <div className="leading-tight">
                  <div className="text-xs font-bold line-clamp-1" style={{ color: 'var(--text)' }}>
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-medium" style={{ color: 'var(--muted)' }}>
                    {currentUser.role === 'CEO' ? 'Tổng Giám Đốc (CEO)' : currentUser.role}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                style={{ background: 'var(--surface-2)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Categories Scrollable List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {navCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1" style={{ color: 'var(--faint)' }}>
                    {cat.title}
                  </div>
                  <div className="space-y-0.5">
                    {cat.items.map((item) => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectTab(item.id)}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors"
                          style={{
                            background: isActive ? 'var(--well)' : 'transparent',
                            color: isActive ? 'var(--primary)' : 'var(--text)',
                            fontWeight: isActive ? 700 : 500
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? 'var(--primary)' : 'var(--muted)' }} />
                            <span>{item.label}</span>
                          </div>
                          {item.count !== undefined ? (
                            <span 
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                              style={{ background: 'var(--primary)' }}
                            >
                              {item.count}
                            </span>
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}>
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                  Giao diện {isDarkMode ? 'Tối' : 'Sáng'}
                </span>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors cursor-pointer"
                  style={{
                    background: 'var(--raised)',
                    borderColor: 'var(--line)',
                    color: 'var(--text)'
                  }}
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => { logout(); onClose(); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
