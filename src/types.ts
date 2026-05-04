export type ProjectStatus =
  | "preparing"
  | "active"
  | "paused"
  | "handover"
  | "warranty"
  | "closed";

export type Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  manager: string;
  status: ProjectStatus;
  progress: number;
  contractValue: number;
  estimatedCost: number;
  actualCost: number;
  collected: number;
  payable: number;
  startDate: string;
  targetDate: string;
};

export type CostItem = {
  id: string;
  projectCode: string;
  category: string;
  description: string;
  amount: number;
  owner: string;
  dueDate: string;
  status: "pending" | "approved" | "paid";
};

export type MaterialRequest = {
  id: string;
  projectCode: string;
  item: string;
  quantity: string;
  requestedBy: string;
  status: "draft" | "review" | "ordered" | "delivered";
};

export type AttendanceSummary = {
  projectCode: string;
  workers: number;
  workDays: number;
  overtimeHours: number;
  payrollEstimate: number;
};
