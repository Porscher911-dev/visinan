import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveNavTab } from '../../types';
import {
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  Printer,
  FileText,
  Package,
  Wrench,
  CheckCircle2,
  DollarSign,
  UserPlus
} from 'lucide-react';

interface Props {
  onOpenFinder: () => void;
  onOpenQuickCreate: (type: 'estimate' | 'order' | 'inventory' | 'customer') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const VessaTopHeader: React.FC<Props> = ({
  onOpenFinder,
  onOpenQuickCreate,
  isDarkMode,
  onToggleTheme
}) => {
  const { activeTab, setActiveTab, currentUser, openProfileModal, tasks } = useApp();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Tab definitions corresponding to Vessa's top pill track
  const navTabs: { id: ActiveNavTab; label: string; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'estimates', label: 'Báo Giá' },
    { id: 'orders', label: 'Đơn Hàng', count: 5 },
    { id: 'production', label: 'Xưởng In' },
    { id: 'inventory', label: 'Kho Vật Tư' },
    { id: 'installation', label: 'Thi Công' },
    { id: 'finance', label: 'Tài Chính' },
    { id: 'crm', label: 'Khách Hàng' }
  ];

  const urgentTasksCount = tasks.filter(t => t.priority === 'URGENT' && t.status !== 'COMPLETED').length;

  return (
    <header className="vessa-top">
      {/* Brand Logo & Name */}
      <div 
        onClick={() => setActiveTab('dashboard')} 
        className="brand cursor-pointer flex items-center gap-3.5 select-none"
      >
        <span 
          className="brand__mark flex items-center justify-center text-white"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--pine) 70%, #fff), var(--primary) 70%)',
            boxShadow: '0 8px 18px -10px var(--primary)'
          }}
        >
          <Printer className="w-6 h-6" />
        </span>
        <div className="leading-tight">
          <span className="font-bold text-lg tracking-tight block" style={{ color: 'var(--text)' }}>
            Vessa <span style={{ color: 'var(--primary)' }}>ERP</span>
          </span>
          <small className="text-xs font-semibold block" style={{ color: 'var(--muted)' }}>
            In Ấn & Bảng Hiệu Mrex
          </small>
        </div>
      </div>

      {/* Center Nav Pill Tabs */}
      <nav className="tabs hidden lg:flex justify-center flex-1 min-w-0">
        <div 
          className="tabs__track flex items-center p-1"
          style={{
            background: 'var(--surface-2)',
            borderRadius: '999px',
            boxShadow: 'inset 0 0 0 1px var(--line)'
          }}
        >
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="tab px-4 py-1.5 text-[13.5px] font-semibold transition-all relative flex items-center gap-1.5 whitespace-nowrap shrink-0"
                style={{
                  borderRadius: '999px',
                  background: isActive ? 'var(--text)' : 'transparent',
                  color: isActive ? 'var(--bg)' : 'var(--muted)'
                }}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums"
                    style={{
                      background: isActive ? 'var(--primary)' : 'var(--well)',
                      color: isActive ? '#fff' : 'var(--text)'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Right Tools Bar */}
      <div className="top__tools flex items-center gap-2.5">
        {/* Finder button ⌘K */}
        <button
          type="button"
          onClick={onOpenFinder}
          className="finder-btn h-10 px-3.5 rounded-full flex items-center gap-2.5 transition-all"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            color: 'var(--muted)'
          }}
          title="Tìm kiếm đơn hàng, báo giá, khách hàng (Ctrl + K)"
        >
          <Search className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Tìm kiếm...</span>
          <kbd 
            className="text-[11px] font-mono px-1.5 py-0.5 rounded border"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--line-2)',
              color: 'var(--muted)'
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Theme Switcher Quick Icon */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            color: 'var(--text)'
          }}
          title={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full flex items-center justify-center relative transition-colors"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              color: 'var(--text)'
            }}
            title="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            {urgentTasksCount > 0 && (
              <span 
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--rose)' }}
              />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-80 p-3 rounded-2xl shadow-xl z-50 border animate-in fade-in"
              style={{
                background: 'var(--raised)',
                borderColor: 'var(--line)'
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: 'var(--line)' }}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  Thông báo hoạt động
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--well)' }}>
                  Mới
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                  <div className="font-bold" style={{ color: 'var(--text)' }}>
                    Báo giá BG-2026-088 đã được duyệt
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    An Gia Land đã đồng ý phương án pano Hiflex 54m².
                  </div>
                </div>
                <div className="p-2 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                  <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--warn)' }}>
                    <span>Vật tư sắp chạm ngưỡng tối thiểu</span>
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    Bạt không gân UV 3.2m chỉ còn 2 cuộn trong kho tổng.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create New Quick Action Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="vessa-btn vessa-btn-primary h-10 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Tạo mới</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Quick Create Dropdown Menu */}
          {showCreateMenu && (
            <div 
              className="absolute right-0 mt-2 w-56 p-2 rounded-2xl shadow-2xl z-50 border animate-in fade-in"
              style={{
                background: 'var(--raised)',
                borderColor: 'var(--line)',
                boxShadow: 'var(--shadow-pop)'
              }}
            >
              <button
                type="button"
                onClick={() => { setShowCreateMenu(false); onOpenQuickCreate('estimate'); }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors"
                style={{ color: 'var(--text)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <div>
                  <div>Tạo Báo Giá In Ấn</div>
                  <div className="text-[10px] font-normal" style={{ color: 'var(--muted)' }}>Nhập kích thước m² & vật liệu</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setShowCreateMenu(false); onOpenQuickCreate('order'); }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors"
                style={{ color: 'var(--text)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Printer className="w-4 h-4 text-blue-500" />
                <div>
                  <div>Lập Đơn Hàng Mới</div>
                  <div className="text-[10px] font-normal" style={{ color: 'var(--muted)' }}>Giao việc thiết kế & xưởng in</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setShowCreateMenu(false); onOpenQuickCreate('inventory'); }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors"
                style={{ color: 'var(--text)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Package className="w-4 h-4 text-emerald-500" />
                <div>
                  <div>Phiếu Nhập Vật Tư Kho</div>
                  <div className="text-[10px] font-normal" style={{ color: 'var(--muted)' }}>Nhập cuộn bạt, decal, mica, led</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setShowCreateMenu(false); onOpenQuickCreate('customer'); }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors"
                style={{ color: 'var(--text)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--well)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <UserPlus className="w-4 h-4 text-purple-500" />
                <div>
                  <div>Thêm Khách Hàng Mới</div>
                  <div className="text-[10px] font-normal" style={{ color: 'var(--muted)' }}>Hồ sơ đối tác & công nợ</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <button
          type="button"
          onClick={openProfileModal}
          className="me h-10 px-2 rounded-full flex items-center gap-2 transition-all cursor-pointer"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--line)'
          }}
          title="Thông tin tài khoản cá nhân"
        >
          <img
            src={currentUser.avatar || '/placeholder-avatar.png'}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover"
          />
          <div className="text-left hidden xl:block pr-1">
            <span className="text-xs font-bold block leading-tight" style={{ color: 'var(--text)' }}>
              {currentUser.name}
            </span>
            <span className="text-[10px] font-medium block leading-tight" style={{ color: 'var(--muted)' }}>
              {currentUser.roleTitle || currentUser.role}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />
        </button>
      </div>
    </header>
  );
};
