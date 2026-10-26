import React, { useState, useMemo } from 'react';
import { Employee, Department, AttendanceRecord, LeaveRequest } from '../../types';
import {
  CalendarDays,
  Calendar,
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  CalendarOff,
  Search,
  Filter,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  MapPin,
  CheckCircle2,
  FileText,
  ShieldAlert,
  ArrowUpDown,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface DailyAttendanceViewProps {
  employees: Employee[];
  departments: Department[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  currentUser: Employee;
}

type DailyStatusFilter = 'ALL' | 'PRESENT' | 'ON_TIME' | 'LATE' | 'ON_LEAVE' | 'ABSENT';

export const DailyAttendanceView: React.FC<DailyAttendanceViewProps> = ({
  employees,
  departments,
  attendanceRecords,
  leaveRequests,
  currentUser
}) => {
  // Permission Guard: Only CEO (Giám đốc) and MANAGER (Quản lý) are allowed
  const isDirectorOrManager = currentUser.role === 'CEO' || currentUser.role === 'MANAGER';

  // Selected date state (defaults to today YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<DailyStatusFilter>('ALL');

  // Quick Date Navigation
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleToday = () => {
    setSelectedDate(todayStr);
  };

  // Format date display in Vietnamese (e.g., "Thứ Năm, 08/10/2026")
  const formattedDateTitle = useMemo(() => {
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = dayNames[dateObj.getDay()] || 'Ngày';
      const dd = String(day).padStart(2, '0');
      const mm = String(month).padStart(2, '0');
      return `${dayName}, ${dd}/${mm}/${year}`;
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Map every employee to their status on the selected date
  const dailyRoster = useMemo(() => {
    return employees.map(emp => {
      // Find attendance record for this employee on selected date
      const rec = attendanceRecords.find(
        r => r.employeeId === emp.id && r.date === selectedDate
      );

      // Check if employee has an approved leave covering this date
      const leaveReq = leaveRequests.find(
        l =>
          (l.employeeId === emp.id || l.employeeName === emp.name) &&
          l.status === 'APPROVED' &&
          l.startDate <= selectedDate &&
          l.endDate >= selectedDate
      );

      const dept = departments.find(d => d.id === emp.departmentId);

      // Determine Daily Status
      let dailyStatus: 'ON_TIME' | 'LATE' | 'ON_LEAVE' | 'ABSENT' = 'ABSENT';
      let checkInTime = rec?.checkIn || undefined;
      let checkOutTime = rec?.checkOut || undefined;
      let workHours = rec?.workHours || 0;
      let location = rec?.location || (leaveReq ? undefined : 'OFFICE');
      let locationDetails = rec?.locationDetails || undefined;
      let note = rec?.note || undefined;
      let lateMinutes = 0;

      if (rec && rec.checkIn) {
        if (rec.status === 'ON_TIME') {
          dailyStatus = 'ON_TIME';
        } else if (rec.status === 'LATE') {
          dailyStatus = 'LATE';
          // Calculate approximate late minutes against 08:00
          const [h, m] = rec.checkIn.split(':').map(Number);
          if (h > 8 || (h === 8 && m > 0)) {
            lateMinutes = (h - 8) * 60 + m;
          }
        } else {
          dailyStatus = rec.status === 'ABSENT' ? 'ABSENT' : 'ON_TIME';
        }
      } else if (leaveReq) {
        dailyStatus = 'ON_LEAVE';
        note = `Nghỉ phép: ${leaveReq.reason || 'Đã phê duyệt'}`;
      } else {
        dailyStatus = 'ABSENT';
      }

      return {
        employee: emp,
        department: dept,
        record: rec,
        leaveRequest: leaveReq,
        dailyStatus,
        checkInTime,
        checkOutTime,
        workHours,
        location,
        locationDetails,
        note,
        lateMinutes
      };
    });
  }, [employees, attendanceRecords, leaveRequests, selectedDate, departments]);

  // Aggregate stats for KPIs
  const stats = useMemo(() => {
    const total = dailyRoster.length;
    const onTime = dailyRoster.filter(r => r.dailyStatus === 'ON_TIME').length;
    const late = dailyRoster.filter(r => r.dailyStatus === 'LATE').length;
    const onLeave = dailyRoster.filter(r => r.dailyStatus === 'ON_LEAVE').length;
    const absent = dailyRoster.filter(r => r.dailyStatus === 'ABSENT').length;
    const present = onTime + late;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      total,
      present,
      onTime,
      late,
      onLeave,
      absent,
      attendanceRate
    };
  }, [dailyRoster]);

  // Filter roster by search, department, and status
  const filteredRoster = useMemo(() => {
    return dailyRoster.filter(item => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.employee.name.toLowerCase().includes(query);
        const matchCode = item.employee.code.toLowerCase().includes(query);
        const matchTitle = item.employee.roleTitle.toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchTitle) return false;
      }

      // Department filter
      if (selectedDeptId !== 'ALL') {
        if (item.employee.departmentId !== selectedDeptId) return false;
      }

      // Status filter
      if (statusFilter === 'PRESENT') {
        if (item.dailyStatus !== 'ON_TIME' && item.dailyStatus !== 'LATE') return false;
      } else if (statusFilter === 'ON_TIME') {
        if (item.dailyStatus !== 'ON_TIME') return false;
      } else if (statusFilter === 'LATE') {
        if (item.dailyStatus !== 'LATE') return false;
      } else if (statusFilter === 'ON_LEAVE') {
        if (item.dailyStatus !== 'ON_LEAVE') return false;
      } else if (statusFilter === 'ABSENT') {
        if (item.dailyStatus !== 'ABSENT') return false;
      }

      return true;
    });
  }, [dailyRoster, searchQuery, selectedDeptId, statusFilter]);

  // Export Day's Attendance to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'Mã Nhân Viên',
      'Họ Và Tên',
      'Chức Vụ',
      'Phòng Ban',
      'Ngày',
      'Trạng Thái',
      'Giờ Vào (Check-in)',
      'Giờ Ra (Check-out)',
      'Tổng Giờ Làm',
      'Hình Thức',
      'Địa Điểm / GPS',
      'Ghi Chú / Lý Do Phép'
    ];

    const rows = filteredRoster.map(item => {
      const statusText =
        item.dailyStatus === 'ON_TIME'
          ? 'Đúng giờ'
          : item.dailyStatus === 'LATE'
          ? `Đi muộn (${item.lateMinutes}p)`
          : item.dailyStatus === 'ON_LEAVE'
          ? 'Nghỉ phép có đơn'
          : 'Chưa chấm công / Vắng';

      const locationText =
        item.location === 'OFFICE'
          ? 'Văn phòng HQ'
          : item.location === 'REMOTE'
          ? 'Từ xa (WFH)'
          : item.location === 'BUSINESS_TRIP'
          ? 'Công tác'
          : '-';

      return [
        `"${item.employee.code}"`,
        `"${item.employee.name}"`,
        `"${item.employee.roleTitle}"`,
        `"${item.department?.name || '-'}"`,
        `"${selectedDate}"`,
        `"${statusText}"`,
        `"${item.checkInTime || '--:--'}"`,
        `"${item.checkOutTime || '--:--'}"`,
        `"${item.workHours || 0}h"`,
        `"${locationText}"`,
        `"${item.locationDetails || '-'}"`,
        `"${item.note || '-'}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bang_cham_cong_ngay_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // If user is not CEO or Manager, display access denied banner
  if (!isDirectorOrManager) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm">Giới Hạn Quyền Xem Chấm Công</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Chức năng xem bảng điểm danh toàn diện từng ngày chỉ cấp <strong>Tổng Giám Đốc (CEO)</strong> và <strong>Cấp Quản Lý (Manager)</strong> mới có quyền tra cứu. Vui lòng liên hệ quản trị viên nếu bạn cần ủy quyền.
        </p>
      </div>
    );
  }

  const isToday = selectedDate === todayStr;

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-white">
      {/* SECTION 1: HEADER & DATE NAVIGATION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 bg-[#EAF5FF] text-[#0875D9] rounded-xl border border-[#0875D9]/20 shadow-2xs">
              <CalendarDays className="w-5 h-5 text-[#0875D9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Theo Dõi Chấm Công Theo Ngày
                </h2>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  <span>Quyền Ban Lãnh Đạo & Quản Lý</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bảng điểm danh toàn diện quân số theo ngày cho cấp Giám Đốc và Quản Lý
              </p>
            </div>
          </div>
        </div>

        {/* Date Selector & Navigator */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={handlePrevDay}
            title="Ngày trước"
            className="p-2 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-2 bg-white rounded-lg border border-slate-200 shadow-2xs py-1">
            <Calendar className="w-4 h-4 text-[#0875D9] shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => e.target.value && setSelectedDate(e.target.value)}
              className="text-xs font-bold font-mono text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleNextDay}
            title="Ngày sau"
            className="p-2 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToday}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
              isToday
                ? 'bg-[#0875D9] text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Hôm Nay</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: CURRENT DATE BANNER & QUICK STATS CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 font-sans">
              Báo cáo ngày: <span className="text-[#0875D9] underline decoration-2">{formattedDateTitle}</span>
            </span>
            {isToday && (
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                ● Đang diễn ra
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Tỷ lệ có mặt: <strong className="text-emerald-600 font-bold font-mono">{stats.attendanceRate}%</strong> ({stats.present}/{stats.total} nhân sự)
          </div>
        </div>

        {/* 6 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Tổng Quân Số */}
          <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold">Tổng Quân Số</span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">{stats.total}</div>
            <div className="text-[10px] text-slate-400 font-medium">Toàn công ty</div>
          </div>

          {/* 2. Có Mặt / Đã Vào Ca */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[11px] font-semibold">Có Mặt Làm Việc</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-700">{stats.present}</div>
            <div className="text-[10px] text-emerald-600 font-medium">
              Đạt <span className="font-bold">{stats.attendanceRate}%</span> tổng số
            </div>
          </div>

          {/* 3. Đúng Giờ */}
          <div className="p-3 bg-[#EAF5FF]/70 border border-[#0875D9]/25 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[#0875D9]">
              <span className="text-[11px] font-semibold">Đúng Giờ</span>
              <Clock className="w-3.5 h-3.5 text-[#0875D9]" />
            </div>
            <div className="text-xl font-bold font-mono text-[#00144b]">{stats.onTime}</div>
            <div className="text-[10px] text-[#0875D9] font-medium">Trước 08:00 AM</div>
          </div>

          {/* 4. Đi Muộn */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-[11px] font-semibold">Đi Muộn</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-700">{stats.late}</div>
            <div className="text-[10px] text-amber-600 font-medium">Sau 08:00 AM</div>
          </div>

          {/* 5. Nghỉ Phép */}
          <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-purple-700">
              <span className="text-[11px] font-semibold">Nghỉ Phép</span>
              <CalendarOff className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-bold font-mono text-purple-700">{stats.onLeave}</div>
            <div className="text-[10px] text-purple-600 font-medium">Đã duyệt đơn phép</div>
          </div>

          {/* 6. Chưa Vào Ca / Vắng */}
          <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-[11px] font-semibold">Chưa Check-in</span>
              <UserX className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-700">{stats.absent}</div>
            <div className="text-[10px] text-rose-600 font-medium">Chưa có dữ liệu</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: FILTER CONTROLS & EXPORT ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Quick Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#0875D9] text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PRESENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'PRESENT'
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Có mặt ({stats.present})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ON_TIME')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'ON_TIME'
                ? 'bg-sky-600 text-white shadow-2xs font-bold'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            Đúng giờ ({stats.onTime})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('LATE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'LATE'
                ? 'bg-amber-600 text-white shadow-2xs font-bold'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Đi muộn ({stats.late})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ON_LEAVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'ON_LEAVE'
                ? 'bg-purple-600 text-white shadow-2xs font-bold'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Nghỉ phép ({stats.onLeave})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ABSENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'ABSENT'
                ? 'bg-rose-600 text-white shadow-2xs font-bold'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Chưa vào ca ({stats.absent})
          </button>
        </div>

        {/* Search, Department select & CSV Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã NV..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0875D9]"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDeptId}
            onChange={e => setSelectedDeptId(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0875D9] text-slate-700 font-medium cursor-pointer"
          >
            <option value="ALL">Tất cả phòng ban</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={handleExportCSV}
            title="Xuất bảng chấm công ngày ra file CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          {/* Print button */}
          <button
            type="button"
            onClick={() => window.print()}
            title="In bảng chấm công ngày"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">In Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: DETAILED DAILY ATTENDANCE ROSTER TABLE */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Nhân Sự</th>
                <th className="py-3 px-3">Phòng Ban</th>
                <th className="py-3 px-3">Trạng Thái Ngày</th>
                <th className="py-3 px-3 font-mono">Giờ Vào (Check-in)</th>
                <th className="py-3 px-3 font-mono">Giờ Ra (Check-out)</th>
                <th className="py-3 px-3">Thời Lượng</th>
                <th className="py-3 px-3">Hình Thức & GPS</th>
                <th className="py-3 px-4">Ghi Chú / Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    Không tìm thấy nhân sự nào theo tiêu chí lọc ngày {formattedDateTitle}.
                  </td>
                </tr>
              ) : (
                filteredRoster.map(item => {
                  const emp = item.employee;
                  const dept = item.department;

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        item.dailyStatus === 'LATE'
                          ? 'bg-amber-50/20'
                          : item.dailyStatus === 'ON_LEAVE'
                          ? 'bg-purple-50/20'
                          : item.dailyStatus === 'ABSENT'
                          ? 'bg-slate-50/30'
                          : ''
                      }`}
                    >
                      {/* Cột 1: Nhân Sự */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar || currentUser.avatar}
                            alt={emp.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{emp.name}</span>
                              {emp.role === 'CEO' && (
                                <span className="text-[9.5px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                                  CEO
                                </span>
                              )}
                              {emp.role === 'MANAGER' && (
                                <span className="text-[9.5px] bg-blue-50 text-[#0875D9] font-bold px-1.5 py-0.2 rounded border border-blue-200">
                                  Manager
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                              <span>{emp.code}</span>
                              <span>·</span>
                              <span className="truncate text-slate-500">{emp.roleTitle}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Phòng Ban */}
                      <td className="py-3 px-3">
                        <span
                          className="px-2 py-0.5 rounded-md font-semibold text-[10.5px] inline-block border"
                          style={{
                            backgroundColor: dept ? `${dept.color}15` : '#f1f5f9',
                            color: dept ? dept.color : '#475569',
                            borderColor: dept ? `${dept.color}30` : '#e2e8f0'
                          }}
                        >
                          {dept?.name || 'Chưa gán'}
                        </span>
                      </td>

                      {/* Cột 3: Trạng Thái Điểm Danh */}
                      <td className="py-3 px-3">
                        {item.dailyStatus === 'ON_TIME' && (
                          <span className="px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Đúng giờ</span>
                          </span>
                        )}

                        {item.dailyStatus === 'LATE' && (
                          <span className="px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Đi muộn {item.lateMinutes > 0 ? `(${item.lateMinutes}p)` : ''}</span>
                          </span>
                        )}

                        {item.dailyStatus === 'ON_LEAVE' && (
                          <span className="px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            <span>
                              {item.leaveRequest?.type === 'ANNUAL'
                                ? 'Nghỉ phép năm'
                                : item.leaveRequest?.type === 'SICK'
                                ? 'Nghỉ ốm'
                                : 'Nghỉ phép'}
                            </span>
                          </span>
                        )}

                        {item.dailyStatus === 'ABSENT' && (
                          <span className="px-2.5 py-1 rounded-full font-semibold text-[11px] inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Chưa chấm công</span>
                          </span>
                        )}
                      </td>

                      {/* Cột 4: Giờ Vào */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">
                        {item.checkInTime ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.checkInTime}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-normal">--:--:--</span>
                        )}
                      </td>

                      {/* Cột 5: Giờ Ra */}
                      <td className="py-3 px-3 font-mono font-medium text-slate-800 tabular-nums">
                        {item.checkOutTime ? (
                          <span>{item.checkOutTime}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">--:--:--</span>
                        )}
                      </td>

                      {/* Cột 6: Thời Lượng */}
                      <td className="py-3 px-3 font-mono font-bold">
                        {item.workHours > 0 ? (
                          <span className="text-[#0875D9]">{item.workHours}h</span>
                        ) : item.checkInTime ? (
                          <span className="text-slate-400 font-normal">Đang làm</span>
                        ) : (
                          <span className="text-slate-300 font-normal">0h</span>
                        )}
                      </td>

                      {/* Cột 7: Hình Thức & GPS */}
                      <td className="py-3 px-3">
                        {item.checkInTime ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800 text-[11px] flex items-center gap-1">
                              {item.location === 'REMOTE' ? (
                                <span>💻 WFH (Từ xa)</span>
                              ) : item.location === 'BUSINESS_TRIP' ? (
                                <span>💼 Đi công tác</span>
                              ) : (
                                <span>🏢 Văn phòng HQ</span>
                              )}
                            </div>
                            {item.locationDetails && (
                              <div
                                className="text-[10px] text-emerald-700 font-mono truncate max-w-[160px] flex items-center gap-0.5"
                                title={item.locationDetails}
                              >
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{item.locationDetails}</span>
                              </div>
                            )}
                          </div>
                        ) : item.dailyStatus === 'ON_LEAVE' ? (
                          <span className="text-purple-600 font-medium text-[11px]">Có đơn nghỉ phép</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Cột 8: Ghi Chú / Chi Tiết Phép */}
                      <td className="py-3 px-4 text-slate-600 text-[11.5px] max-w-[220px]">
                        {item.dailyStatus === 'ON_LEAVE' ? (
                          <div className="text-purple-700 truncate" title={item.note}>
                            <span className="font-semibold">Lý do: </span>
                            <span>{item.leaveRequest?.reason || item.note || 'Theo quy chế'}</span>
                          </div>
                        ) : item.note ? (
                          <div className="truncate italic text-slate-500" title={item.note}>
                            "{item.note}"
                          </div>
                        ) : item.dailyStatus === 'LATE' ? (
                          <span className="text-amber-600 font-medium">Chưa giải trình muộn</span>
                        ) : item.dailyStatus === 'ABSENT' ? (
                          <span className="text-slate-400">Chưa ghi nhận ca làm</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div>
            Đang hiển thị <strong>{filteredRoster.length}</strong> / <strong>{dailyRoster.length}</strong> nhân sự trong ngày <strong>{formattedDateTitle}</strong>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              ● Đúng giờ: {stats.onTime}
            </span>
            <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
              ● Đi muộn: {stats.late}
            </span>
            <span className="inline-flex items-center gap-1 text-purple-700 font-bold">
              ● Nghỉ phép: {stats.onLeave}
            </span>
            <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
              ● Chưa check-in: {stats.absent}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
