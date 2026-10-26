import {
  PrintEstimate,
  PrintOrder,
  InstallationSite,
  CustomerItem,
  PrintMaterialCategory,
  MaterialStock
} from '../types';

export const PRINT_MATERIALS_CATALOG = [
  {
    category: 'BAT_HIFLEX' as PrintMaterialCategory,
    name: 'Bạt Hiflex 3.2m Dày 0.36mm (Gân Trắng)',
    unit: 'm²',
    costPerM2: 24000,
    pricePerM2: 55000,
    description: 'Chuyên biển pano ngoài trời, hộp đèn thường, chống thấm tốt.'
  },
  {
    category: 'BAT_KHONG_GAN_UV' as PrintMaterialCategory,
    name: 'Bạt Không Gân Cao Cấp In Mực UV (3M)',
    unit: 'm²',
    costPerM2: 95000,
    pricePerM2: 220000,
    description: 'Hộp đèn cao cấp trung tâm thương mại, màu sắc rực rỡ, độ bền 3-5 năm.'
  },
  {
    category: 'DECAL_PP' as PrintMaterialCategory,
    name: 'Decal PP Trong Nhà Cán Màng Bóng / Mờ',
    unit: 'm²',
    costPerM2: 32000,
    pricePerM2: 75000,
    description: 'Standee, poster sự kiện, dán bồi formex trang trí showroom.'
  },
  {
    category: 'DECAL_SUA' as PrintMaterialCategory,
    name: 'Decal Sữa Ngoài Trời In Mực Dầu Eco',
    unit: 'm²',
    costPerM2: 45000,
    pricePerM2: 110000,
    description: 'Dán xe bus, dán kính, tem nhãn bao bì sản phẩm công nghiệp.'
  },
  {
    category: 'ALU_COMPOSITE' as PrintMaterialCategory,
    name: 'Tấm Nhôm Nhựa Alu Alcorest 3mm x 0.10',
    unit: 'm²',
    costPerM2: 140000,
    pricePerM2: 380000,
    description: 'Ốp mặt tiền bảng hiệu, biển chỉ dẫn công ty, chịu nhiệt tốt.'
  },
  {
    category: 'MICA_ACRYLIC' as PrintMaterialCategory,
    name: 'Tấm Mica Đài Loan Chochen 3mm Trong / Sữa',
    unit: 'm²',
    costPerM2: 210000,
    pricePerM2: 480000,
    description: 'Cắt laser chữ nổi, biển phòng ban, bảng chức danh, menu kệ.'
  },
  {
    category: 'CHU_NOI_LED' as PrintMaterialCategory,
    name: 'Chữ Nổi Inox Vàng Gương Led Sáng Chân',
    unit: 'bộ',
    costPerM2: 1200000,
    pricePerM2: 2900000,
    description: 'Logo tòa nhà, chữ nổi nhận diện thương hiệu sang trọng.'
  },
  {
    category: 'HOP_DEN_HUT_NOI' as PrintMaterialCategory,
    name: 'Hộp Đèn Mica Hút Nổi Tròn / Vuông Đèn Led',
    unit: 'cái',
    costPerM2: 480000,
    pricePerM2: 980000,
    description: 'Biển vẫy quảng cáo nhà hàng, quán cafe, ngân hàng.'
  }
];

export const INITIAL_PRINT_ESTIMATES: PrintEstimate[] = [
  {
    id: 'est-001',
    code: 'BG-2026-088',
    customerName: 'Nguyễn Văn Hùng',
    customerPhone: '0903.123.456',
    customerCompany: 'Tập Đoàn Bất Động Sản An Gia Land',
    projectName: 'Thi Công Hệ Thống Pano Hiflex & Biển Hộp Đèn Sảnh',
    items: [
      {
        id: 'ei-1',
        name: 'Pano Hiflex Đón Khách Mặt Tiền',
        material: 'BAT_HIFLEX',
        widthM: 12.0,
        heightM: 4.5,
        quantity: 1,
        areaM2: 54.0,
        costPerM2: 24000,
        pricePerM2: 55000,
        finishOptions: ['Gấp mép xỏ que', 'Đóng khoen 4 góc'],
        extraCost: 450000,
        totalCost: 54.0 * 24000 + 450000,
        totalAmount: 54.0 * 55000 + 450000 * 1.3
      },
      {
        id: 'ei-2',
        name: 'Hộp Đèn UV Không Gân Phòng Giao Dịch',
        material: 'BAT_KHONG_GAN_UV',
        widthM: 3.0,
        heightM: 1.8,
        quantity: 2,
        areaM2: 10.8,
        costPerM2: 95000,
        pricePerM2: 220000,
        finishOptions: ['Bo viền nhôm định hình nhét ron'],
        extraCost: 650000,
        totalCost: 10.8 * 95000 + 650000,
        totalAmount: 10.8 * 220000 + 650000 * 1.3
      }
    ],
    totalAreaM2: 64.8,
    totalCostVND: 3422000,
    subtotalVND: 6731000,
    discountVND: 200000,
    vatRate: 0.08,
    grandTotalVND: Math.round((6731000 - 200000) * 1.08),
    grossProfitVND: 6731000 - 200000 - 3422000,
    marginPercent: 47.6,
    status: 'ACCEPTED',
    validUntil: '2026-11-15',
    createdAt: '2026-10-22',
    salesperson: 'Trần Văn Minh (Kinh Doanh)'
  },
  {
    id: 'est-002',
    code: 'BG-2026-089',
    customerName: 'Chị Mai Lan',
    customerPhone: '0918.456.789',
    customerCompany: 'Chuỗi Cafe The Highland Breeze (5 Điểm)',
    projectName: 'Gói Thay Bạt Vẫy & Poster Decal PP Khuyến Mãi Q4',
    items: [
      {
        id: 'ei-3',
        name: 'Biển Vẫy Hộp Đèn Tròn Hút Nổi Φ60cm',
        material: 'HOP_DEN_HUT_NOI',
        widthM: 0.6,
        heightM: 0.6,
        quantity: 5,
        areaM2: 1.8,
        costPerM2: 480000,
        pricePerM2: 980000,
        finishOptions: ['Khung nhôm sơn đen tĩnh điện', 'Led Samsung 12V'],
        extraCost: 350000,
        totalCost: 2950000,
        totalAmount: 5200000
      },
      {
        id: 'ei-4',
        name: 'Poster Menu Decal PP Cán Mờ Bồi Formex 5mm',
        material: 'DECAL_PP',
        widthM: 0.8,
        heightM: 1.2,
        quantity: 10,
        areaM2: 9.6,
        costPerM2: 42000,
        pricePerM2: 115000,
        finishOptions: ['Cắt định hình CNC', 'Bồi formex 5mm'],
        extraCost: 400000,
        totalCost: 803200,
        totalAmount: 1624000
      }
    ],
    totalAreaM2: 11.4,
    totalCostVND: 3753200,
    subtotalVND: 6824000,
    discountVND: 0,
    vatRate: 0.08,
    grandTotalVND: Math.round(6824000 * 1.08),
    grossProfitVND: 6824000 - 3753200,
    marginPercent: 45.0,
    status: 'SENT',
    validUntil: '2026-11-20',
    createdAt: '2026-10-24',
    salesperson: 'Lê Hoàng Nam'
  },
  {
    id: 'est-003',
    code: 'BG-2026-090',
    customerName: 'Anh Quốc Bảo',
    customerPhone: '0977.889.911',
    customerCompany: 'Thẩm Mỹ Viện Quốc Tế Seoul Luxury',
    projectName: 'Bộ Chữ Nổi Inox Vàng Gương Sáng Chân Tòa Nhà 7 Tầng',
    items: [
      {
        id: 'ei-5',
        name: 'Bộ Chữ Nổi "SEOUL LUXURY" Uốn Chân 6cm',
        material: 'CHU_NOI_LED',
        widthM: 6.5,
        heightM: 1.5,
        quantity: 1,
        areaM2: 9.75,
        costPerM2: 1200000,
        pricePerM2: 2900000,
        finishOptions: ['Inox 304 vàng gương 1mm', 'Lót mica cháo 10mm', 'Led zíc zắc Hàn Quốc'],
        extraCost: 2800000,
        totalCost: 14500000,
        totalAmount: 31000000
      }
    ],
    totalAreaM2: 9.75,
    totalCostVND: 14500000,
    subtotalVND: 31000000,
    discountVND: 1000000,
    vatRate: 0.1,
    grandTotalVND: Math.round((31000000 - 1000000) * 1.1),
    grossProfitVND: 30000000 - 14500000,
    marginPercent: 51.6,
    status: 'DRAFT',
    validUntil: '2026-11-30',
    createdAt: '2026-10-25',
    salesperson: 'Nguyễn Thị Hải Yến'
  }
];

export const INITIAL_PRINT_ORDERS: PrintOrder[] = [
  {
    id: 'ord-101',
    code: 'DH-8892',
    customerName: 'Tập Đoàn Bất Động Sản An Gia Land',
    customerPhone: '0903.123.456',
    projectName: 'Pano Hiflex & Hộp Đèn UV Đón Khách Mở Bán',
    category: 'Bạt Pano & Hộp Đèn',
    totalM2: 64.8,
    contractValue: 7053480,
    paidAmount: 5000000,
    debtAmount: 2053480,
    progress: 75,
    status: 'POST_PROCESSING',
    machineAssigned: 'Máy Konica 512i (Khổ 3.2m)',
    assignedDesigner: 'Võ Minh Đạt (Graphic Pro)',
    assignedOperator: 'Nguyễn Văn Thành (Tổ Trưởng In)',
    deadline: '2026-10-27 16:00',
    proofApproved: true,
    notes: 'Khách yêu cầu gấp mép chừa 10cm xỏ que sắt D21, giao trước 17h.',
    createdAt: '2026-10-23'
  },
  {
    id: 'ord-102',
    code: 'DH-8893',
    customerName: 'Hệ Thống Nhà Thuốc FPT Long Châu',
    customerPhone: '0988.334.455',
    projectName: 'Bảng Hiệu Mặt Tiền Alu Chữ Mica Hút Nổi CN Quận 7',
    category: 'Mặt Tiền Alu Mica',
    totalM2: 28.5,
    contractValue: 24500000,
    paidAmount: 15000000,
    debtAmount: 9500000,
    progress: 35,
    status: 'PRINTING',
    machineAssigned: 'Máy CNC Router 1325 + UV Phẳng Mimaki',
    assignedDesigner: 'Phạm Thu Trang',
    assignedOperator: 'Trần Đình Tuấn',
    deadline: '2026-10-29 12:00',
    proofApproved: true,
    notes: 'Chuẩn màu xanh dương thương hiệu Pantone 286C.',
    createdAt: '2026-10-24'
  },
  {
    id: 'ord-103',
    code: 'DH-8894',
    customerName: 'Trường Đại Học FPT Cần Thơ',
    customerPhone: '0292.730.0999',
    projectName: 'Bộ Backdrop Khai Giảng Khóa K20 Bạt Deajeong UV',
    category: 'Backdrop Sự Kiện',
    totalM2: 45.0,
    contractValue: 10800000,
    paidAmount: 10800000,
    debtAmount: 0,
    progress: 100,
    status: 'COMPLETED',
    machineAssigned: 'Máy In UV Cuộn TaiMes 3.2m',
    assignedDesigner: 'Võ Minh Đạt',
    assignedOperator: 'Nguyễn Văn Thành',
    deadline: '2026-10-25 18:00',
    proofApproved: true,
    notes: 'Đã nghiệm thu thanh toán 100%.',
    createdAt: '2026-10-21'
  },
  {
    id: 'ord-104',
    code: 'DH-8895',
    customerName: 'Showroom Ô Tô VinFast Bình Triệu',
    customerPhone: '0938.990.112',
    projectName: 'Dán Decal Lưới Kính & Decal PP Trưng Bày VF8',
    category: 'Decal Kính & PP',
    totalM2: 36.2,
    contractValue: 8680000,
    paidAmount: 4000000,
    debtAmount: 4680000,
    progress: 90,
    status: 'READY_INSTALL',
    machineAssigned: 'Máy In Decal Roland VG2-640',
    assignedDesigner: 'Phạm Thu Trang',
    assignedOperator: 'Lê Văn Khang',
    deadline: '2026-10-26 21:00',
    proofApproved: true,
    notes: 'Thi công đêm sau 21h khi showroom đóng cửa.',
    createdAt: '2026-10-25'
  },
  {
    id: 'ord-105',
    code: 'DH-8896',
    customerName: 'Ngân Hàng TMCP Quân Đội (MB Bank)',
    customerPhone: '0966.122.333',
    projectName: 'Biển Pano Quảng Cáo Cầu Vượt Cộng Hòa',
    category: 'Pano Quảng Cáo',
    totalM2: 120.0,
    contractValue: 48000000,
    paidAmount: 20000000,
    debtAmount: 28000000,
    progress: 15,
    status: 'FILE_CHECK',
    machineAssigned: 'Chờ phân máy',
    assignedDesigner: 'Võ Minh Đạt',
    assignedOperator: 'Chưa phân công',
    deadline: '2026-11-05 10:00',
    proofApproved: false,
    notes: 'Đang đợi khách xác nhận maket bù trừ mép 15cm.',
    createdAt: '2026-10-26'
  }
];

export const INITIAL_INSTALLATION_SITES: InstallationSite[] = [
  {
    id: 'site-01',
    orderCode: 'DH-8895',
    siteName: 'VinFast Showroom Bình Triệu',
    address: 'Số 188 Quốc Lộ 13, P. Hiệp Bình Chánh, TP. Thủ Đức',
    customerName: 'Mr. Hoàng Long (Quản Lý SR)',
    customerPhone: '0938.990.112',
    teamLeader: 'Nguyễn Tấn Tài (Đội 1)',
    teamSize: 3,
    scheduledTime: '21:00 Hôm Nay',
    status: 'SCHEDULED',
    checklist: [
      { task: 'Mang giàn giáo 3 tầng + thang rút 5m', completed: true },
      { task: 'Kiểm tra dao trổ, nước xịt kính, gạt nỉ chuyên dụng', completed: true },
      { task: 'Đeo đai an toàn toàn thân khi dán mặt ngoài', completed: false },
      { task: 'Ký biên bản nghiệm thu & chụp 4 góc ảnh hiện trường', completed: false }
    ],
    photosUploaded: 0,
    notes: 'Liên hệ bảo vệ cổng số 2 để đưa xe tải vật tư vào tầng hầm.'
  },
  {
    id: 'site-02',
    orderCode: 'DH-8892',
    siteName: 'Khu Đô Thị An Gia Star',
    address: 'Tân Tạo, Bình Tân, TP. Hồ Chí Minh',
    customerName: 'Nguyễn Văn Hùng',
    customerPhone: '0903.123.456',
    teamLeader: 'Trần Văn Mạnh (Đội 2)',
    teamSize: 4,
    scheduledTime: '14:00 Ngày Mai',
    status: 'SCHEDULED',
    checklist: [
      { task: 'Xe cẩu 3.5 tấn đưa khung Pano lên cao 12m', completed: false },
      { task: 'Bắn vít liên kết bạt vào khung sắt hộp mạ kẽm', completed: false },
      { task: 'Đấu nối dây điện nguồn cho 4 bóng đèn pha 50W', completed: false },
      { task: 'Kiểm tra độ căng mặt bạt và chống lốc xoáy', completed: false }
    ],
    photosUploaded: 0,
    notes: 'Thời tiết chiều hay có mưa giông, chuẩn bị bạt che đồ điện.'
  }
];

export const INITIAL_PRINT_CUSTOMERS: CustomerItem[] = [
  {
    id: 'cust-1',
    code: 'KH-001',
    name: 'Tập Đoàn Bất Động Sản An Gia Land',
    company: 'An Gia Investment Corporation',
    phone: '0903.123.456',
    email: 'hung.nv@angiainvest.vn',
    address: 'Toà nhà Golden King, 15 Nguyễn Lương Bằng, Quận 7, TP.HCM',
    tier: 'VIP',
    totalOrders: 18,
    totalSpent: 385000000,
    currentDebt: 2053480,
    lastOrderDate: '2026-10-23'
  },
  {
    id: 'cust-2',
    code: 'KH-002',
    name: 'Hệ Thống Nhà Thuốc FPT Long Châu',
    company: 'Công ty CP Bán Lẻ Kỹ Thuật Số FPT',
    phone: '0988.334.455',
    email: 'procurement@longchau.com.vn',
    address: '379 Hai Bà Trưng, Phường 8, Quận 3, TP.HCM',
    tier: 'VIP',
    totalOrders: 42,
    totalSpent: 920000000,
    currentDebt: 9500000,
    lastOrderDate: '2026-10-24'
  },
  {
    id: 'cust-3',
    code: 'KH-003',
    name: 'Chuỗi Cafe The Highland Breeze',
    company: 'Breeze F&B Co., Ltd',
    phone: '0918.456.789',
    email: 'lan.mai@highlandbreeze.vn',
    address: '28 Thảo Điền, TP. Thủ Đức, TP.HCM',
    tier: 'LOYAL',
    totalOrders: 12,
    totalSpent: 145000000,
    currentDebt: 0,
    lastOrderDate: '2026-10-24'
  },
  {
    id: 'cust-4',
    code: 'KH-004',
    name: 'Thẩm Mỹ Viện Quốc Tế Seoul Luxury',
    company: 'Seoul Luxury Beauty Group',
    phone: '0977.889.911',
    email: 'contact@seoulluxury.vn',
    address: '120 Sư Vạn Hạnh, Quận 10, TP.HCM',
    tier: 'NEW',
    totalOrders: 2,
    totalSpent: 62000000,
    currentDebt: 0,
    lastOrderDate: '2026-10-25'
  }
];

export const INITIAL_MATERIAL_STOCKS: MaterialStock[] = [
  {
    id: 'mat-1',
    sku: 'VT-BAT-01',
    name: 'Cuộn Bạt Hiflex 3.2m Dày 0.36mm (Gân Trắng)',
    category: 'BAT_IN',
    unit: 'Cuộn (80m)',
    quantity: 14,
    minStock: 5,
    unitPrice: 1920000,
    location: 'Kho A - Kệ Cuộn 01',
    lastUpdated: '2026-10-24'
  },
  {
    id: 'mat-2',
    sku: 'VT-BAT-02',
    name: 'Cuộn Bạt Không Gân Cao Cấp UV 3M Khổ 3.2m',
    category: 'BAT_IN',
    unit: 'Cuộn (50m)',
    quantity: 2,
    minStock: 5,
    unitPrice: 4750000,
    location: 'Kho A - Kệ Cuộn 02',
    lastUpdated: '2026-10-25'
  },
  {
    id: 'mat-3',
    sku: 'VT-DEC-01',
    name: 'Cuộn Decal PP Cán Màng Bóng Khổ 1.52m',
    category: 'DECAL',
    unit: 'Cuộn (50m)',
    quantity: 8,
    minStock: 4,
    unitPrice: 1600000,
    location: 'Kho A - Kệ Decal 01',
    lastUpdated: '2026-10-22'
  },
  {
    id: 'mat-4',
    sku: 'VT-ALU-01',
    name: 'Tấm Nhôm Nhựa Alu Alcorest 3mm x 0.10 EV2002',
    category: 'TAM_OP',
    unit: 'Tấm (1.22x2.44m)',
    quantity: 35,
    minStock: 10,
    unitPrice: 385000,
    location: 'Kho B - Giá Tấm Đứng',
    lastUpdated: '2026-10-23'
  },
  {
    id: 'mat-5',
    sku: 'VT-MIC-01',
    name: 'Tấm Mica Đài Loan Chochen 3mm Trong Suốt',
    category: 'TAM_OP',
    unit: 'Tấm (1.22x2.44m)',
    quantity: 18,
    minStock: 6,
    unitPrice: 620000,
    location: 'Kho B - Giá Mica Nằm',
    lastUpdated: '2026-10-21'
  },
  {
    id: 'mat-6',
    sku: 'VT-LED-01',
    name: 'Led Module 3 Bóng Samsung Chip 2835 12V Trắng Lạnh',
    category: 'LED_NGUON',
    unit: 'Vỉ (20 bóng)',
    quantity: 120,
    minStock: 50,
    unitPrice: 95000,
    location: 'Kho C - Tủ Linh Kiện 03',
    lastUpdated: '2026-10-25'
  },
  {
    id: 'mat-7',
    sku: 'VT-NGU-01',
    name: 'Nguồn Tổ Ong Chống Nước Ngoài Trời 12V 400W 33A',
    category: 'LED_NGUON',
    unit: 'Cái',
    quantity: 15,
    minStock: 8,
    unitPrice: 280000,
    location: 'Kho C - Tủ Linh Kiện 01',
    lastUpdated: '2026-10-20'
  },
  {
    id: 'mat-8',
    sku: 'VT-MUC-01',
    name: 'Mực In UV Curable TaiMes Chính Hãng (Can 5L)',
    category: 'MUC_IN',
    unit: 'Can (5L)',
    quantity: 3,
    minStock: 6,
    unitPrice: 3200000,
    location: 'Kho Pha Chế Mực In',
    lastUpdated: '2026-10-24'
  }
];

