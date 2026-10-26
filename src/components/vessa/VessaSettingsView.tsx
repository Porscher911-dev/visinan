import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Printer,
  Shield,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Sun,
  Moon,
  Save
} from 'lucide-react';

interface Props {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const VessaSettingsView: React.FC<Props> = ({ isDarkMode, onToggleTheme }) => {
  const [accent, setAccent] = useState<'terracotta' | 'cobalt' | 'ocean' | 'pine' | 'graphite'>('terracotta');
  const [shopName, setShopName] = useState('Xưởng In Ấn & Bảng Hiệu Mrex');
  const [shopAddress, setShopAddress] = useState('Số 188 Quốc Lộ 13, P. Hiệp Bình Chánh, TP. Thủ Đức, TP.HCM');
  const [hotline, setHotline] = useState('0988.888.999');
  const [defaultVat, setDefaultVat] = useState('8');

  const accents = [
    { id: 'terracotta', name: 'Terracotta (Vessa Cam Cháy Chuẩn)', color: '#a8481c' },
    { id: 'cobalt', name: 'Cobalt (Xanh Biển Đậm)', color: '#2747c4' },
    { id: 'ocean', name: 'Ocean (Xanh Đại Dương)', color: '#16627a' },
    { id: 'pine', name: 'Pine (Xanh Thông Rừng)', color: '#17704b' },
    { id: 'graphite', name: 'Graphite (Xám Đen Tối Giản)', color: '#2c2c33' }
  ];

  const handleApplyAccent = (acc: typeof accent, color: string) => {
    setAccent(acc);
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--pine', color);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã lưu cấu hình hệ thống Vessa ERP thành công!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
          Cấu Hình Hệ Thống
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          Cài Đặt Hệ Thống & Ngôn Ngữ Thiết Kế Vessa
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Tùy chỉnh tông màu accent thương hiệu, chế độ Light/Dark, thông tin doanh nghiệp và kiểm thử các UI components.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Theme & Accents Selection */}
        <div className="vessa-card space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Palette className="w-4 h-4 text-orange-600" />
            Tông Màu Accent & Giao Diện
          </h2>

          <div className="space-y-3">
            <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
              Chọn Bảng Màu Chủ Đạo (Vessa Accent System):
            </div>

            <div className="flex flex-wrap gap-3">
              {accents.map((acc) => {
                const isSelected = accent === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleApplyAccent(acc.id as any, acc.color)}
                    className="p-3 rounded-2xl border flex items-center gap-3 transition-all text-xs font-bold"
                    style={{
                      background: isSelected ? 'var(--surface-2)' : 'var(--surface)',
                      borderColor: isSelected ? acc.color : 'var(--line)',
                      boxShadow: isSelected ? 'var(--shadow)' : 'none'
                    }}
                  >
                    <span 
                      className="w-5 h-5 rounded-full flex-shrink-0" 
                      style={{ background: acc.color }} 
                    />
                    <span style={{ color: 'var(--text)' }}>{acc.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
              <div>
                <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>Chế Độ Sáng / Tối (Light & Dark Theme)</div>
                <div className="text-[11px]" style={{ color: 'var(--muted)' }}>Giao diện Vessa hỗ trợ tối ưu độ tương phản cho cả 2 môi trường.</div>
              </div>

              <button
                type="button"
                onClick={onToggleTheme}
                className="vessa-btn vessa-btn-ghost vessa-btn-sm flex items-center gap-2"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                <span>{isDarkMode ? 'Đang bật Dark Mode' : 'Đang bật Light Mode'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Shop & Print Business Info */}
        <div className="vessa-card space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Printer className="w-4 h-4 text-blue-600" />
            Thông Tin Xưởng In Ấn & Xuất Hóa Đơn
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--muted)' }}>Tên Doanh Nghiệp In Ấn</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="vessa-input w-full text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--muted)' }}>Hotline / Zalo Tiếp Nhận File</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="vessa-input w-full text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--muted)' }}>Địa Chỉ Xưởng & Văn Phòng</label>
              <input
                type="text"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className="vessa-input w-full text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: 'var(--muted)' }}>Thuế Suất VAT Mặc Định (%)</label>
              <input
                type="number"
                value={defaultVat}
                onChange={(e) => setDefaultVat(e.target.value)}
                className="vessa-input w-full text-xs"
              />
            </div>
          </div>
        </div>

        {/* Design System Quality Showcase */}
        <div className="vessa-card space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Sliders className="w-4 h-4 text-emerald-600" />
            Thư Viện UI Component Chuẩn Vessa (Quality Gate Preview)
          </h2>

          <div className="space-y-3 text-xs">
            {/* Buttons preview */}
            <div>
              <div className="font-bold mb-1.5" style={{ color: 'var(--muted)' }}>Pill Buttons:</div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="vessa-btn vessa-btn-primary vessa-btn-sm">Primary Button</button>
                <button type="button" className="vessa-btn vessa-btn-ghost vessa-btn-sm">Ghost Button</button>
                <button type="button" className="vessa-btn vessa-btn-soft vessa-btn-sm">Soft Button</button>
              </div>
            </div>

            {/* Badges preview */}
            <div className="pt-2">
              <div className="font-bold mb-1.5" style={{ color: 'var(--muted)' }}>Status Badges:</div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="vessa-badge vessa-badge-good">✓ Đã Nghiệm Thu</span>
                <span className="vessa-badge vessa-badge-warn">⚠ Đang Chờ Duyệt</span>
                <span className="vessa-badge vessa-badge-bad">✕ Cảnh Báo Quá Hạn</span>
                <span className="vessa-badge vessa-badge-info">ℹ Đang Thi Công</span>
                <span className="vessa-badge vessa-badge-plain">Bản Nháp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="vessa-btn vessa-btn-primary px-6 text-xs font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi Cấu Hình</span>
          </button>
        </div>
      </form>
    </div>
  );
};
