# HỆ THỐNG THIẾT KẾ UX/UI — THAM CHIẾU VESSA
## Dành Cho Hệ Thống Quản Trị ERP / CRM Doanh Nghiệp In Ấn & Bảng Hiệu Quảng Cáo

> **Nguồn tham chiếu thực tế:** [Vessa — Stock and Supply Management Dashboard](https://demo.codeandchill.store/vessa)  
> **Khảo sát trực tiếp:** Trình duyệt thực tế & Reverse Engineering CSS Tokens (`index-a8hNzcRE.css`, `index-D2IUSZMA.js`)  
> **Định vị sản phẩm:** SaaS B2B Quản trị sản xuất, dự án, đơn hàng, kho vận & tài chính cho xưởng in ấn và thi công quảng cáo.

---

## 1. CẤU TRÚC TỔNG THỂ (OVERALL APP ARCHITECTURE)

Hệ thống tuân thủ cấu trúc App Shell đặc trưng của Vessa:
- **Nền ứng dụng (Body Background):**
  - Hiệu ứng ánh sáng tinh tế cố định (`background-attachment: fixed`): 2 quầng sáng radial mờ nhạt `radial-gradient(70vmax 50vmax at 0% -10%, var(--glow-a), transparent 70%)` và `radial-gradient(60vmax 45vmax at 100% 0%, var(--glow-b), transparent 70%)` trên nền `--bg`.
  - Không sử dụng hiệu ứng 3D nặng, tranh cổ hay nền hoạt họa làm rối mắt.
- **Bố cục lưới Grid chính:**
  - `display: grid; grid-template-columns: var(--rail-w) minmax(0, 1fr); gap: 16px var(--gap); padding: 14px var(--gutter) 40px;`
  - `--rail-w`: `76px` khi thu gọn (collapsed), `220px` khi mở rộng (expanded qua class `.side-open`).
  - `--gutter`: `clamp(12px, 1.6vw, 24px)`.
  - Sticky Top Header trải rộng toàn bộ chiều ngang (`grid-column: 1 / -1`).
  - Sticky Sidebar Rail nằm bên trái bên dưới Header.
  - Vùng Main Content co giãn tự do, hỗ trợ cuộn dọc mượt mà.

---

## 2. HỆ THỐNG MÀU SẮC & DESIGN TOKENS (COLOR SYSTEM)

Màu sắc được trích xuất chính xác từ CSS gốc của Vessa:

### 2.1. Light Mode Tokens (`:root` hoặc `data-theme="light"`)
| Token Name | Giá trị Hex / Hàm | Mục đích sử dụng |
| :--- | :--- | :--- |
| `--bg` | `#eef0ec` | Nền canvas toàn hệ thống, tông xám ấm tự nhiên |
| `--surface` | `#fcfdfc` | Nền card, stat box, container nội dung |
| `--surface-2` | `#f3f5f2` | Nền hover table row, nút thứ cấp, pill bar |
| `--raised` | `#ffffff` | Nền modal, drawer, command finder popover |
| `--well` | `#14241c0e` | Nền rãnh trượt, track tiến độ, avatar placeholder |
| `--line` | `#14241c16` | Đường viền mảnh chia tách card, table border |
| `--line-2` | `#14241c2b` | Đường viền tương phản cao hơn cho input, switch |
| `--hair` | `#14241c33` | Nét gạch biểu đồ đo lường |
| `--text` | `#18201b` | Màu chữ chính, độ tương phản cao, êm mắt |
| `--muted` | `#56615a` | Màu chữ phụ, nhãn stat, mô tả trường |
| `--faint` | `#6c7770` | Màu chữ phụ bậc 3, placeholder |
| `--primary` | `#a8481c` | Màu thương hiệu chủ đạo (Terracotta / Burnt Sienna ấm áp) |
| `--on-primary`| `#fff7f2` | Màu chữ trên nền primary |
| `--pine` | `#b9531f` | Màu cam cháy bổ trợ |
| `--ochre` | `#c88a12` | Màu vàng hổ phách (Cảnh báo, công việc chờ) |
| `--teal` | `#1d8a7b` | Màu xanh ngọc (Chỉ số vận hành, KCS) |
| `--sky` | `#3a72c8` | Màu xanh da trời (Đơn hàng, hợp đồng) |
| `--rose` | `#cf4a5c` | Màu đỏ hoa hồng (Badge thông báo, deadline sát) |
| `--sage` | `#6d9a2c` | Màu xanh xô thơm (Kho thành phẩm, đạt chuẩn) |
| `--good` | `#23804d` | Màu trạng thái thành công, có lãi, đã thu tiền |
| `--warn` | `#93600a` | Màu cảnh báo quá hạn, công nợ |
| `--bad` | `#bf3a2d` | Màu lỗi, hủy đơn, vượt định mức |
| `--info` | `#2f63b8` | Màu thông tin kỹ thuật, thông báo chung |

### 2.2. Dark Mode Tokens (`:root[data-theme="dark"]`)
| Token Name | Giá trị Hex / Hàm | Mục đích sử dụng |
| :--- | :--- | :--- |
| `--bg` | `#0f1412` | Nền tối sâu thẳm, dịu mắt |
| `--surface` | `#171d1a` | Nền card tối |
| `--surface-2` | `#1c231f` | Nền phụ, hover tối |
| `--raised` | `#242c28` | Nền nổi popover, dialog |
| `--line` | `#ffffff14` | Viền trắng mờ 8% |
| `--line-2` | `#ffffff29` | Viền trắng mờ 16% |
| `--text` | `#ecf2ee` | Chữ trắng ngà mềm mại |
| `--muted` | `#a8b4ad` | Chữ phụ sáng dịu |
| `--primary` | `#ffa77a` | Cam đào sáng nổi bật trên nền đen |
| `--on-primary`| `#2b0f03` | Chữ đen sẫm trên nền primary cam |
| `--good` | `#6fd38e` | Xanh lá dạ quang dễ đọc |
| `--bad` | `#f58c7f` | Đỏ san hô cảnh báo nổi bật |

---

## 3. TYPOGRAPHY (HỆ THỐNG CHỮ)

- **Font Family:** `"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;`
  - Font hình học hiện đại, các nét bo tròn nhẹ nhàng, thanh thoát, hỗ trợ đầy đủ tiếng Việt với dấu chuẩn.
- **Tabular Nums:** Bắt buộc áp dụng `font-variant-numeric: tabular-nums` cho tất cả:
  - Giá trị tiền tệ (VNĐ), kích thước (m²), khối lượng (kg), tiến độ (%), mã chứng từ (SKU/PO/DH).
- **Phân cấp cỡ chữ (Font Scales):**
  - `--fs-2xs`: `11px` (Badge siêu nhỏ, timestamp phụ)
  - `--fs-xs`: `12px` (Table header UPPERCASE, tag, nhãn nhỏ)
  - `--fs-sm`: `12.5px` (Helper text, chip nhãn, tooltip)
  - `--fs-md`: `13.5px` (Nội dung table body, item menu, ghi chú)
  - `--fs-base`: `14px` (Kích thước văn bản cơ bản)
  - `--fs-lg`: `15px` (Card sub-title, tiêu đề nhóm nhỏ)
  - `--fs-xl`: `17px` (Card heading, form group title)
  - `--fs-2xl`: `20px` (Modal title, drawer header)
  - `--fs-3xl`: `22px` (KPI Value số liệu lớn)
  - `--fs-4xl`: `26px` (Page title trên tablet / sub-heading lớn)
  - `--fs-display`: `34px` / `clamp(28px, 2.6vw, 38px)` (Hero KPI value, Tổng doanh thu)

---

## 4. SHADOW & BORDER RADIUS (HIỆU ỨNG NỔI & BO GÓC)

- **Bo góc (Border Radius):**
  - `--r-card`: `22px` (Card bảng điều khiển, container module)
  - `--r-tile`: `14px` (Icon tile, ô chỉ số phụ)
  - Pill shape: `999px` (Nút bấm `.btn`, tab navigation `.tab`, search input, badge)
  - Input field: `14px` (Form fields, textareas)
  - Modal / Drawer: `26px`
- **Đổ bóng (Box Shadow):**
  - `--shadow`: `0 1px 2px #14241c0a, 0 14px 34px -22px #14241c47` (Đổ bóng cực kỳ mềm mại, sang trọng, chiều sâu tự nhiên)
  - `--shadow-pop`: `0 26px 60px -20px #14241c57, 0 2px 6px #14241c14` (Dành cho Dropdown, Modal, Search Finder, Floating Drawer)
  - Hoàn toàn loại bỏ drop shadow thô hoặc viền 3D dày cộp.

---

## 5. APP SHELL ARCHITECTURE

### 5.1. Top Header (`.top`)
- **Vị trí:** `position: sticky; top: 10px; z-index: 40; height: 80px; border-radius: 26px;`
- **Hiệu ứng:** Glass backdrop blur `backdrop-filter: saturate(1.4) blur(14px); background: color-mix(in srgb, var(--surface) 92%, transparent);`
- **Thành phần:**
  1. **Brand Mark:** Logo tròn bán kính `54px`, nền gradient `radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--pine) 70%, #fff), var(--primary) 70%)`. Bên cạnh là tên công ty & thương hiệu in ấn bảng hiệu (Vd: `MREX PRINT & SIGNAGE`).
  2. **Navigation Tabs Track (`.tabs__track`):** Dải tabs hình viên thuốc nằm giữa header với nền `--raised`, bo viền `999px`, có indicator di chuyển khi chuyển đổi giữa các nhóm chức năng chính (Dashboard, Bán Hàng & Báo Giá, Đơn Hàng & Dự Án, Xưởng Sản Xuất, Kho Vật Tư, Thi Công Hiện Trường, Báo Cáo Tài Chính).
  3. **Công cụ thao tác nhanh (`.top__tools`):**
     - Global Search Finder (`⌘K` / `Ctrl+K`): Nút pill mở Command Palette tra cứu nhanh mã đơn, tên khách, số điện thoại, mã quy cách vật tư.
     - Notification Bell: Chuông thông báo có chấm đỏ (`.dot-badge`).
     - Quick Create Button: Nút primary bo tròn có icon `+ Tạo Báo Giá / Đơn Mới`.
     - User Profile Pill: Nút viên thuốc bo viền hiển thị Avatar tròn + Tên người dùng + Vai trò (Giám Đốc / Trưởng Xưởng / Kế Toán) + Chevron.

### 5.2. Sidebar Rail (`.rail`)
- **Vị trí:** `position: sticky; top: calc(var(--top-h) + 26px); z-index: 30;`
- **Cơ chế co giãn:**
  - Trạng thái mặc định: Chiều rộng `76px`, chỉ hiển thị icon căn giữa, tooltip nổi khi hover.
  - Trạng thái mở rộng (`.side-open`): Chiều rộng `220px`, icon + nhãn tiếng Việt rõ ràng, căn lề trái.
  - Nút chuyển đổi (Rail Toggle) ở góc dưới cùng của Sidebar để bật/tắt giữa 2 chế độ.
- **Thành phần trên Sidebar:**
  1. **Theme Switcher Pill (`.theme-sw`):** Khối viên thuốc trên cùng cho phép chuyển đổi tức thì giữa Light Mode (icon Sun) và Dark Mode (icon Moon).
  2. **Nhóm menu nghiệp vụ:**
     - 📊 Tổng Quan (Dashboard)
     - 💼 Báo Giá & Tính Giá Thành (Estimates)
     - 📑 Đơn Hàng & Hợp Đồng (Orders)
     - 🖨️ Lệnh Sản Xuất In & Bảng Hiệu (Production & Kanban)
     - 📦 Kho Vật Tư In Ấn (Inventory & Material)
     - 🚚 Giao Hàng & Thi Công (Field Installation)
     - 💰 Thu Chi & Công Nợ (Finance)
     - 👥 Khách Hàng (CRM)
     - ⚙️ Cài Đặt Hệ Thống (Settings)
  3. **Phần chân Sidebar (`.rail__foot`):** Trợ giúp (Help), Đăng xuất (Sign out), Nút thu gọn / mở rộng Sidebar.

---

## 6. NỘI DUNG VÀ THIẾT KẾ CÁC MODULE NGHIỆP VỤ IN ẤN & BẢNG HIỆU

### 6.1. Dashboard Giám Đốc (Executive Overview)
- **Hàng 1: 5 Thẻ Chỉ Số KPI Trọng Điểm (`.head__stats`):**
  1. *Doanh Thu Ghi Nhận Tháng:* Giá trị số lớn (VNĐ), % tăng trưởng so với tháng trước (`.delta--good`).
  2. *Thực Thu Tiền Mặt / Chuyển Khoản:* Dòng tiền thực tế đã về tài khoản.
  3. *Lợi Nhuận Gộp (Margin %):* Doanh thu trừ chi phí vật tư in ấn & nhân công xưởng.
  4. *Công Nợ Phải Thu Khách Hàng:* Số tiền khách hàng bảng hiệu / in ấn còn nợ.
  5. *Giá Trị Đơn Hàng Đang Gia Công:* Tổng giá trị các dự án đang chạy tại xưởng và công trình.
- **Hàng 2: Biểu Đồ Doanh Thu & Cơ Cấu Sản Phẩm:**
  - *Biểu đồ đường (Line Chart SVG):* Diễn biến doanh thu & chi phí vật tư theo ngày trong tháng với điểm neo hover hiển thị Tooltip chuẩn xác.
  - *Biểu đồ Donut / Gauge:* Phân bổ doanh thu theo nhóm sản phẩm cốt lõi (Bảng hiệu Led chữ nổi, Bạt Hiflex / Bạt không gân UV, Hộp đèn hút nổi, Decal & PP dán bồi Formex, Khung sắt Pano quảng cáo).
- **Hàng 3: Điều Hành Sản Xuất & Tiến Độ Xưởng:**
  - Thống kê thời gian thực: Số máy in đang chạy, Đơn chờ duyệt file thiết kế, Đơn gấp cần giao trong ngày, Công trình đang lắp đặt tại hiện trường.
- **Hàng 4: Cảnh Báo Điều Hành & Hoạt Động Gần Nhất:**
  - Cảnh báo vật tư sắp hết (VD: Decal sữa chống xước, Mực in UV trắng, Khung nhôm định hình).
  - Cảnh báo công nợ vượt hạn mức tín dụng.
  - Nhật ký xuất file in và nghiệm thu bảng hiệu mới nhất.

### 6.2. Module Báo Giá & Tính Đơn Giá In Nhanh
- Nhập nhanh quy cách kỹ thuật:
  - Loại sản phẩm: Bạt UV 3M, Bạt Deajeong không gân, Decal PP trong nhà/ngoài trời, Chữ nổi Inox vàng gương lót mica cháo hắt led sáng chân...
  - Kích thước: Rộng (m) x Cao (m) x Số lượng $\rightarrow$ Tự động tính Diện tích $m^2$.
  - Đơn giá vật tư + Gia công phụ trợ (Uốn chân alu, cán màng bóng/mờ, đóng khoen, xỏ cây).
  - Tự động hiển thị song song: **Giá Vốn Sản Xuất** & **Giá Báo Khách** để nhân viên kinh doanh đảm bảo biên lợi nhuận tối thiểu.

### 6.3. Module Điều Hành Sản Xuất (Kanban & Job Tickets)
- Luồng công việc trực quan 5 cột:
  1. `[TIẾP NHẬN & DUYỆT FILE]` (Kiểm tra hệ màu CMYK, độ phân giải DPI, chừa biên gấp mép)
  2. `[XẾP LỆNH & ĐANG IN]` (Máy in UV phẳng, Máy cuộn Konica 512i, Máy in Decal Mimaki)
  3. `[GIA CÔNG SAU IN]` (Cắt CNC mica, Uốn viền chữ, Đấu đèn Led, Hàn khung sắt hộp)
  4. `[KCS & ĐÓNG GÓI]` (Kiểm tra chất lượng màu in, độ sáng led, độ kết dính keo)
  5. `[SẴN SÀNG THI CÔNG / GIAO]` (Bàn giao cho đội xe và kỹ thuật hiện trường)
- Thẻ công việc thể hiện rõ: Mã đơn, tên khách, kích thước $m^2$, hạn giao hàng (Deadline gấp sẽ có nhãn `.badge--bad`).

### 6.4. Module Quản Lý Kho Vật Tư (Material Inventory)
- Danh mục vật tư chuyên ngành: Cuộn bạt, Cuộn decal, Mực in theo lít, Tấm Alu 3mm Alcorest, Tấm Mica Đài Loan Chochen, Đèn Led module 3 bóng Hàn Quốc, Nguồn chống nước 12V...
- Thẻ cảnh báo tồn kho tối thiểu (`minStock`), lịch sử xuất kho trực tiếp theo Lệnh sản xuất.

### 6.5. Module Lắp Đặt & Thi Công Hiện Trường (Mobile-Optimized)
- Tối ưu thao tác vuốt chạm trên điện thoại cho thợ thi công bảng hiệu:
  - Bản đồ địa chỉ công trình, nút gọi nhanh cho khách hàng, danh sách kiểm tra an toàn giàn giáo, nút chụp ảnh nghiệm thu tải lên hệ thống để thủ quỹ giải ngân tiền quyết toán.

---

## 7. QUY CHUẨN MICRO-INTERACTIONS & MOTION

- Tốc độ transition: `--ease: cubic-bezier(.2, .8, .2, 1);` với thời lượng `150ms - 300ms`.
- Không sử dụng các thư viện chuyển động nặng gây giật lag khi render bảng hàng trăm dòng.
- Hover button: Tăng độ sáng nhẹ trong light mode (`filter: brightness(1.12)`), co giãn êm ái.
- Tab chuyển đổi: Dải indicator bo tròn trượt mượt mà theo vị trí tab hiện tại.
- Hỗ trợ đầy đủ `@media (prefers-reduced-motion: reduce)`.
