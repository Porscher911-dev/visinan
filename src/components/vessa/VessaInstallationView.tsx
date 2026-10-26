import React, { useState } from 'react';
import {
  Wrench,
  Phone,
  MapPin,
  Camera,
  CheckSquare,
  Square,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { INITIAL_INSTALLATION_SITES } from '../../data/printingData';
import { InstallationSite } from '../../types';

export const VessaInstallationView: React.FC = () => {
  const [sites, setSites] = useState<InstallationSite[]>(INITIAL_INSTALLATION_SITES);
  const [activeSite, setActiveSite] = useState<InstallationSite>(INITIAL_INSTALLATION_SITES[0]);

  const handleToggleChecklist = (siteId: string, taskIdx: number) => {
    setSites(sites.map(s => {
      if (s.id !== siteId) return s;
      const updatedChecklist = [...s.checklist];
      updatedChecklist[taskIdx] = {
        ...updatedChecklist[taskIdx],
        completed: !updatedChecklist[taskIdx].completed
      };
      return { ...s, checklist: updatedChecklist };
    }));

    if (activeSite.id === siteId) {
      setActiveSite(prev => {
        const updated = [...prev.checklist];
        updated[taskIdx] = { ...updated[taskIdx], completed: !updated[taskIdx].completed };
        return { ...prev, checklist: updated };
      });
    }
  };

  const handleUploadPhoto = (siteId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      setSites(sites.map(s => s.id === siteId ? { ...s, photosUploaded: s.photosUploaded + 1 } : s));
      if (activeSite.id === siteId) {
        setActiveSite(prev => ({ ...prev, photosUploaded: prev.photosUploaded + 1 }));
      }
      alert('Đã tải ảnh chụp hiện trường thi công thành công!');
    };
    input.click();
  };

  const handleCompleteSite = (siteId: string) => {
    setSites(sites.map(s => s.id === siteId ? { ...s, status: 'ACCEPTED' } : s));
    if (activeSite.id === siteId) {
      setActiveSite(prev => ({ ...prev, status: 'ACCEPTED' }));
    }
    alert('Công trình đã được nghiệm thu và chuyển sang kế toán xuất hóa đơn quyết toán!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
            Hiện Trường & Nghiệm Thu
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Đội Thi Công & Lắp Đặt Bảng Hiệu
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Giao diện tối ưu cho kỹ thuật viên hiện trường: gọi hotline, mở bản đồ chỉ đường, checklist an toàn và tải ảnh biên bản nghiệm thu.
          </p>
        </div>

        <span className="vessa-badge vessa-badge-info text-xs self-start sm:self-auto">
          Tối ưu cảm ứng di động & tablet
        </span>
      </div>

      {/* Main Grid: Sites List & Actionable Job Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sites List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider px-1" style={{ color: 'var(--muted)' }}>
            Công Trình Hôm Nay & Kế Hoạch ({sites.length})
          </div>

          <div className="space-y-2.5">
            {sites.map((site) => {
              const isSelected = activeSite.id === site.id;
              const isDone = site.status === 'ACCEPTED';
              return (
                <div
                  key={site.id}
                  onClick={() => setActiveSite(site)}
                  className="p-4 rounded-2xl border cursor-pointer transition-all space-y-2"
                  style={{
                    background: isSelected ? 'var(--surface)' : 'var(--surface-2)',
                    borderColor: isSelected ? 'var(--primary)' : 'var(--line)',
                    boxShadow: isSelected ? 'var(--shadow)' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs" style={{ color: 'var(--primary)' }}>
                      {site.orderCode}
                    </span>
                    <span className={`vessa-badge ${isDone ? 'vessa-badge-good' : 'vessa-badge-warn'}`}>
                      {isDone ? 'Đã nghiệm thu' : site.scheduledTime}
                    </span>
                  </div>

                  <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                    {site.siteName}
                  </div>
                  <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{site.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                    <span style={{ color: 'var(--text)' }}>
                      Đội thi công: <strong>{site.teamLeader}</strong>
                    </span>
                    <span style={{ color: 'var(--muted)' }}>
                      {site.photosUploaded} ảnh chụp
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Site Action Card (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="vessa-card space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div>
                <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                  HỒ SƠ CÔNG TRÌNH: {activeSite.orderCode}
                </span>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                  {activeSite.siteName}
                </h2>
                <div className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{activeSite.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeSite.customerPhone}`}
                  className="vessa-btn vessa-btn-ghost vessa-btn-sm flex items-center gap-1.5 text-xs font-bold"
                  style={{ color: 'var(--good)' }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Khách ({activeSite.customerPhone})</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(activeSite.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="vessa-btn vessa-btn-ghost vessa-btn-sm flex items-center gap-1.5 text-xs font-bold"
                  style={{ color: 'var(--primary)' }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Chỉ Đường</span>
                </a>
              </div>
            </div>

            {/* Field Notes & Special Instructions */}
            {activeSite.notes && (
              <div className="p-3 rounded-2xl border" style={{ background: 'var(--well)', borderColor: 'var(--line)' }}>
                <div className="text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--muted)' }}>
                  Lưu Ý Đặc Biệt Hiện Trường
                </div>
                <div className="text-xs" style={{ color: 'var(--text)' }}>
                  {activeSite.notes}
                </div>
              </div>
            )}

            {/* Checklist An Toàn & Kỹ Thuật Lắp Đặt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  Checklist An Toàn Lao Động & Kỹ Thuật Bảng Hiệu
                </span>
                <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--primary)' }}>
                  {activeSite.checklist.filter(c => c.completed).length} / {activeSite.checklist.length} Đạt
                </span>
              </div>

              <div className="space-y-2">
                {activeSite.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleChecklist(activeSite.id, idx)}
                    className="p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors"
                    style={{
                      background: item.completed ? 'var(--surface)' : 'var(--surface-2)',
                      borderColor: item.completed ? 'var(--good)' : 'var(--line)'
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                    <span 
                      className={`text-xs font-medium ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}
                      style={{ color: item.completed ? undefined : 'var(--text)' }}
                    >
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos & Acceptance Signing */}
            <div className="p-4 rounded-2xl border space-y-3" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                    Ảnh Nghiệm Thu Hiện Trường
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    Đã tải {activeSite.photosUploaded} ảnh hiện trường lên máy chủ.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUploadPhoto(activeSite.id)}
                  className="vessa-btn vessa-btn-ghost vessa-btn-sm flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-primary" />
                  <span>Chụp / Tải Thêm Ảnh</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCompleteSite(activeSite.id)}
                disabled={activeSite.status === 'ACCEPTED'}
                className="vessa-btn vessa-btn-primary w-full text-xs font-bold py-3 h-auto"
              >
                {activeSite.status === 'ACCEPTED' ? '✓ Đã Ký Nghiệm Thu Thành Công' : 'Xác Nhận Nghiệm Thu & Hoàn Thành Công Trình'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
