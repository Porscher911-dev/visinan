import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveNavTab } from '../../types';
import {
  LayoutDashboard,
  FileText,
  Printer,
  Package,
  Wrench,
  DollarSign,
  Users,
  UserCheck,
  CalendarCheck,
  FolderOpen,
  Megaphone,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const VessaSidebar: React.FC<Props> = ({
  isCollapsed,
  onToggleCollapse,
  isDarkMode,
  onToggleTheme
}) => {
  const { activeTab, setActiveTab, logout, tasks, unreadChatCount } = useApp();

  const menuItems: { id: ActiveNavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'estimates', label: 'Báo Giá & Dự Toán', icon: FileText },
    { id: 'orders', label: 'Đơn Hàng & Hợp Đồng', icon: Printer, badge: 5 },
    { id: 'production', label: 'Xưởng In & Gia Công', icon: Printer },
    { id: 'inventory', label: 'Kho Vật Tư In Ấn', icon: Package },
    { id: 'installation', label: 'Đội Thi Công Bảng Hiệu', icon: Wrench },
    { id: 'finance', label: 'Tài Chính & Thu Chi', icon: DollarSign },
    { id: 'crm', label: 'Khách Hàng CRM', icon: Users },
    { id: 'employees', label: 'Nhân Sự & Phòng Ban', icon: UserCheck },
    { id: 'attendance', label: 'Chấm Công GPS', icon: CalendarCheck },
    { id: 'docs', label: 'Văn Bản & Mẫu Biểu', icon: FolderOpen },
    { id: 'announcements', label: 'Bảng Tin Nội Bộ', icon: Megaphone },
    { id: 'settings', label: 'Cài Đặt Hệ Thống', icon: Settings }
  ];

  return (
    <aside 
      className="vessa-rail transition-all duration-300"
      style={{
        width: isCollapsed ? '76px' : '220px'
      }}
    >
      {/* Theme Switcher Pill (Light / Dark) */}
      <div 
        className="theme-sw flex items-center justify-between p-1 rounded-full border shadow-xs"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--line)'
        }}
      >
        <button
          type="button"
          onClick={() => { if (isDarkMode) onToggleTheme(); }}
          className="flex-1 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: !isDarkMode ? 'var(--text)' : 'transparent',
            color: !isDarkMode ? 'var(--bg)' : 'var(--muted)'
          }}
          title="Giao diện Sáng"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => { if (!isDarkMode) onToggleTheme(); }}
          className="flex-1 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: isDarkMode ? 'var(--text)' : 'transparent',
            color: isDarkMode ? 'var(--bg)' : 'var(--muted)'
          }}
          title="Giao diện Tối"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation Item Track */}
      <nav 
        className="nav p-1.5 rounded-3xl border shadow-xs flex flex-col gap-1"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--line)'
        }}
      >
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className="relative w-full h-11 px-3.5 rounded-2xl flex items-center gap-3 transition-all font-semibold text-xs"
              style={{
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'var(--on-primary)' : 'var(--muted)',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">
                  {item.label}
                </span>
              )}
              {item.badge !== undefined && (
                <span
                  className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums"
                  style={{
                    background: isActive ? 'var(--on-primary)' : 'var(--rose)',
                    color: isActive ? 'var(--primary)' : '#fff',
                    position: isCollapsed ? 'absolute' : 'static',
                    top: isCollapsed ? '4px' : undefined,
                    right: isCollapsed ? '6px' : undefined
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Rail Foot (Help, Logout, Rail Toggle) */}
      <div 
        className="rail__foot p-1.5 rounded-3xl border shadow-xs flex flex-col gap-1"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--line)'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('docs')}
          className="w-full h-10 px-3.5 rounded-2xl flex items-center gap-3 transition-all font-semibold text-xs"
          style={{
            color: 'var(--muted)',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          title={isCollapsed ? 'Trợ giúp & Hướng dẫn' : undefined}
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Trợ Giúp</span>}
        </button>

        <button
          type="button"
          onClick={logout}
          className="w-full h-10 px-3.5 rounded-2xl flex items-center gap-3 transition-all font-semibold text-xs"
          style={{
            color: 'var(--bad)',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          title={isCollapsed ? 'Đăng xuất tài khoản' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Đăng Xuất</span>}
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full h-9 px-3.5 rounded-2xl flex items-center gap-3 transition-all font-semibold text-xs border-t mt-1 pt-1"
          style={{
            borderColor: 'var(--line)',
            color: 'var(--muted)',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          title={isCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Thu Gọn Menu</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
