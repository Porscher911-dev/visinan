import React, { useState, useEffect } from 'react';
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
  UserPlus,
  Menu,
  Database,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  X
} from 'lucide-react';
import { FirebaseService, FirebaseStatus, FIREBASE_DB_URL } from '../../services/firebase';
import { INITIAL_PRINT_CUSTOMERS, INITIAL_PRINT_ORDERS, INITIAL_PRINT_ESTIMATES, INITIAL_MATERIAL_STOCKS } from '../../data/printingData';

interface Props {
  onOpenFinder: () => void;
  onOpenQuickCreate: (type: 'estimate' | 'order' | 'inventory' | 'customer') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenMobileNav?: () => void;
}

export const VessaTopHeader: React.FC<Props> = ({
  onOpenFinder,
  onOpenQuickCreate,
  isDarkMode,
  onToggleTheme,
  onOpenMobileNav
}) => {
  const { activeTab, setActiveTab, currentUser, openProfileModal, tasks } = useApp();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Firebase Realtime State
  const [fbStatus, setFbStatus] = useState<FirebaseStatus>(FirebaseService.getStatus());
  const [showFbModal, setShowFbModal] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);
  const [isCheckingFb, setIsCheckingFb] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsub = FirebaseService.subscribeStatus((st) => setFbStatus(st));
    FirebaseService.checkHealth();
    return unsub;
  }, []);


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
      {/* Brand Logo & Name + Mobile Hamburger */}
      <div className="flex items-center gap-2">
        {onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-colors cursor-pointer shrink-0"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--line)',
              color: 'var(--text)'
            }}
            title="Mở menu điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="brand cursor-pointer flex items-center gap-2.5 sm:gap-3.5 select-none"
        >
          <span 
            className="brand__mark flex items-center justify-center text-white shrink-0"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--pine) 70%, #fff), var(--primary) 70%)',
              boxShadow: '0 8px 18px -10px var(--primary)'
            }}
          >
            <Printer className="w-5 h-5" />
          </span>
          <div className="leading-tight">
            <span className="font-bold text-base sm:text-lg tracking-tight block" style={{ color: 'var(--text)' }}>
              Devis <span style={{ color: 'var(--primary)' }}>ERP</span>
            </span>
            <small className="text-[10px] sm:text-xs font-semibold hidden sm:block" style={{ color: 'var(--muted)' }}>
              Quản Trị Doanh Nghiệp In Ấn & Bảng Hiệu
            </small>
          </div>
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

        {/* Firebase Realtime Database Status Badge */}
        <button
          type="button"
          onClick={() => setShowFbModal(true)}
          className="h-10 px-3 rounded-full flex items-center gap-2 transition-all cursor-pointer text-xs font-semibold"
          style={{
            background: fbStatus.permissionOk ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${fbStatus.permissionOk ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.4)'}`,
            color: fbStatus.permissionOk ? '#10b981' : '#f59e0b'
          }}
          title="Xem trạng thái kết nối Firebase Database"
        >
          <span 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: fbStatus.permissionOk ? '#10b981' : '#f59e0b'
            }}
          />
          <Database className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">
            {fbStatus.permissionOk ? 'Firebase Live' : 'Firebase: Cần mở Rules'}
          </span>
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

      {/* Firebase Realtime Connection & Rules Modal */}
      {showFbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl rounded-3xl p-6 shadow-2xl border space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'var(--raised)',
              borderColor: 'var(--line)',
              color: 'var(--text)'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
                >
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Cơ Sở Dữ Liệu Firebase Realtime</h3>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Đồng bộ tức thì mọi dữ liệu CRM, Báo Giá, Kho, Đơn Hàng đa thiết bị
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFbModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"
                style={{ background: 'var(--surface-2)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Card */}
            <div 
              className="p-4 rounded-2xl border space-y-2.5 text-xs"
              style={{
                background: fbStatus.permissionOk ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                borderColor: fbStatus.permissionOk ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: 'var(--muted)' }}>Trạng thái WebSocket:</span>
                <span className="font-bold flex items-center gap-1.5" style={{ color: fbStatus.connected ? '#10b981' : '#f43f5e' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: fbStatus.connected ? '#10b981' : '#f43f5e' }} />
                  {fbStatus.connected ? 'Đang kết nối trực tuyến (Connected)' : 'Ngoại tuyến (Offline)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: 'var(--muted)' }}>Quyền đọc & ghi (Rules):</span>
                <span className="font-bold" style={{ color: fbStatus.permissionOk ? '#10b981' : '#f59e0b' }}>
                  {fbStatus.permissionOk ? '✅ Hợp lệ (Cho phép đọc & ghi)' : '⚠️ Cần mở Security Rules'}
                </span>
              </div>
              <div className="pt-2 border-t text-[11px] break-all font-mono" style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}>
                URL: {FIREBASE_DB_URL}
              </div>
            </div>

            {/* Instructions if permission is locked */}
            {!fbStatus.permissionOk && (
              <div className="space-y-3 p-4 rounded-2xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                <div className="flex items-center gap-2 font-bold text-xs" style={{ color: '#f59e0b' }}>
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Hướng dẫn mở quyền đọc/ghi trên Firebase Console:</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
                  Khi mới tạo, Firebase Realtime Database mặc định ở chế độ khóa. Để ứng dụng lưu và đồng bộ dữ liệu giữa các máy tính, điện thoại, vui lòng cấu hình Rules như sau:
                </p>

                <div className="relative">
                  <pre 
                    className="p-3 rounded-xl text-xs font-mono overflow-x-auto select-all"
                    style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--line)' }}
                  >
{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}');
                      setCopiedRules(true);
                      setTimeout(() => setCopiedRules(false), 2500);
                    }}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    style={{
                      background: copiedRules ? '#10b981' : 'var(--primary)',
                      color: '#ffffff'
                    }}
                  >
                    {copiedRules ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRules ? 'Đã copy!' : 'Copy Rules'}</span>
                  </button>
                </div>

                <a
                  href="https://console.firebase.google.com/project/devis-815bc/database/devis-815bc-default-rtdb/rules"
                  target="_blank"
                  rel="noreferrer"
                  className="vessa-btn vessa-btn-ghost w-full flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <span>Mở tab Rules trên Firebase Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {seedSuccess && (
              <div className="p-3 rounded-xl text-xs font-bold flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{seedSuccess}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                disabled={isCheckingFb}
                onClick={async () => {
                  setIsCheckingFb(true);
                  const res = await FirebaseService.checkHealth();
                  setIsCheckingFb(false);
                  if (res.permissionOk) {
                    setSeedSuccess('Kết nối Firebase đọc/ghi thành công 100%!');
                    setTimeout(() => setSeedSuccess(null), 3000);
                  }
                }}
                className="vessa-btn vessa-btn-primary flex-1 flex items-center justify-center gap-2 text-xs font-bold h-10"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingFb ? 'animate-spin' : ''}`} />
                <span>{isCheckingFb ? 'Đang kiểm tra...' : 'Kiểm Tra Lại Kết Nối'}</span>
              </button>

              <button
                type="button"
                disabled={isSeeding}
                onClick={async () => {
                  setIsSeeding(true);
                  try {
                    await Promise.all([
                      FirebaseService.syncNode('customers', INITIAL_PRINT_CUSTOMERS),
                      FirebaseService.syncNode('inventory', INITIAL_MATERIAL_STOCKS),
                      FirebaseService.syncNode('orders', INITIAL_PRINT_ORDERS),
                      FirebaseService.syncNode('estimates', INITIAL_PRINT_ESTIMATES)
                    ]);
                    setSeedSuccess('Đã nạp thành công dữ liệu mẫu lên Firebase!');
                    setTimeout(() => setSeedSuccess(null), 3500);
                  } catch (e: any) {
                    alert('Lỗi nạp dữ liệu: ' + (e?.message || e));
                  }
                  setIsSeeding(false);
                }}
                className="vessa-btn vessa-btn-ghost flex-1 flex items-center justify-center gap-2 text-xs font-bold h-10"
              >
                <Database className="w-3.5 h-3.5 text-amber-500" />
                <span>{isSeeding ? 'Đang nạp...' : 'Nạp Dữ Liệu Lên Firebase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
