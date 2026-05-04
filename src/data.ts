import type { AttendanceSummary, CostItem, MaterialRequest, Project } from "./types";

export const projects: Project[] = [
  {
    id: "p-001",
    code: "QT-2601",
    name: "Nha xuong Binh Chanh",
    client: "Cong ty Minh Phat",
    manager: "Anh Quang",
    status: "active",
    progress: 62,
    contractValue: 3200000000,
    estimatedCost: 2580000000,
    actualCost: 1495000000,
    collected: 1450000000,
    payable: 286000000,
    startDate: "2026-03-02",
    targetDate: "2026-08-20"
  },
  {
    id: "p-002",
    code: "QT-2602",
    name: "Cai tao van phong Quan 7",
    client: "Nam An Logistics",
    manager: "Chi Linh",
    status: "handover",
    progress: 91,
    contractValue: 780000000,
    estimatedCost: 612000000,
    actualCost: 558000000,
    collected: 520000000,
    payable: 74000000,
    startDate: "2026-02-18",
    targetDate: "2026-05-15"
  },
  {
    id: "p-003",
    code: "QT-2603",
    name: "Nha pho Thu Duc",
    client: "Gia dinh Hoang Gia",
    manager: "Anh Khoa",
    status: "preparing",
    progress: 14,
    contractValue: 1850000000,
    estimatedCost: 1510000000,
    actualCost: 118000000,
    collected: 260000000,
    payable: 42000000,
    startDate: "2026-04-22",
    targetDate: "2026-10-30"
  }
];

export const costs: CostItem[] = [
  {
    id: "c-001",
    projectCode: "QT-2601",
    category: "Vat tu",
    description: "Thep D16 dot 2",
    amount: 186000000,
    owner: "Nha cung cap Hoa Binh",
    dueDate: "2026-05-08",
    status: "approved"
  },
  {
    id: "c-002",
    projectCode: "QT-2602",
    category: "Nhan cong",
    description: "Luong doi hoan thien thang 04",
    amount: 96000000,
    owner: "Doi anh Tam",
    dueDate: "2026-05-05",
    status: "pending"
  },
  {
    id: "c-003",
    projectCode: "QT-2603",
    category: "Tam ung",
    description: "Tam ung khoi dong cong trinh",
    amount: 45000000,
    owner: "Anh Khoa",
    dueDate: "2026-05-04",
    status: "paid"
  }
];

export const materialRequests: MaterialRequest[] = [
  {
    id: "m-001",
    projectCode: "QT-2601",
    item: "Xi mang PCB40",
    quantity: "320 bao",
    requestedBy: "Chi huy Binh Chanh",
    status: "review"
  },
  {
    id: "m-002",
    projectCode: "QT-2602",
    item: "Son noi that trang",
    quantity: "48 thung",
    requestedBy: "Chi Linh",
    status: "ordered"
  },
  {
    id: "m-003",
    projectCode: "QT-2603",
    item: "Cat xay to",
    quantity: "22 m3",
    requestedBy: "Anh Khoa",
    status: "draft"
  }
];

export const attendance: AttendanceSummary[] = [
  {
    projectCode: "QT-2601",
    workers: 24,
    workDays: 412,
    overtimeHours: 38,
    payrollEstimate: 236000000
  },
  {
    projectCode: "QT-2602",
    workers: 11,
    workDays: 164,
    overtimeHours: 16,
    payrollEstimate: 87000000
  },
  {
    projectCode: "QT-2603",
    workers: 8,
    workDays: 52,
    overtimeHours: 0,
    payrollEstimate: 31500000
  }
];
