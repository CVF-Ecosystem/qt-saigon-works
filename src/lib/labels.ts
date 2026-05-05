import type { BadgeTone } from "../components/ui/StatusBadge";

export type ProjectStatus =
  | "preparing"
  | "active"
  | "paused"
  | "handover"
  | "warranty"
  | "closed";

export type CostStatus = "draft" | "review" | "approved" | "rejected" | "paid";

export type MaterialRequestStatus =
  | "draft"
  | "review"
  | "approved"
  | "rejected"
  | "ordered"
  | "delivered";

export type PurchaseOrderStatus =
  | "draft"
  | "review"
  | "approved"
  | "ordered"
  | "delivered"
  | "paid";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  preparing: "Chuẩn bị",
  active: "Đang thi công",
  paused: "Tạm dừng",
  handover: "Nghiệm thu",
  warranty: "Bảo hành",
  closed: "Đóng",
};

export const PROJECT_STATUS_TONES: Record<ProjectStatus, BadgeTone> = {
  preparing: "info",
  active: "success",
  paused: "warning",
  handover: "info",
  warranty: "neutral",
  closed: "neutral",
};

export const COST_STATUS_LABELS: Record<CostStatus, string> = {
  draft: "Nháp",
  review: "Đang duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  paid: "Đã TT",
};

export const COST_STATUS_TONES: Record<CostStatus, BadgeTone> = {
  draft: "neutral",
  review: "warning",
  approved: "info",
  rejected: "danger",
  paid: "success",
};

export const MATERIAL_REQUEST_STATUS_LABELS: Record<
  MaterialRequestStatus,
  string
> = {
  draft: "Nháp",
  review: "Đang duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  ordered: "Đã đặt",
  delivered: "Đã nhận",
};

export const MATERIAL_REQUEST_STATUS_TONES: Record<
  MaterialRequestStatus,
  BadgeTone
> = {
  draft: "neutral",
  review: "warning",
  approved: "info",
  rejected: "danger",
  ordered: "info",
  delivered: "success",
};

export const PO_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  draft: "Nháp",
  review: "Đang duyệt",
  approved: "Đã duyệt",
  ordered: "Đã đặt",
  delivered: "Đã nhận",
  paid: "Đã TT",
};

export const PO_STATUS_TONES: Record<PurchaseOrderStatus, BadgeTone> = {
  draft: "neutral",
  review: "warning",
  approved: "info",
  ordered: "info",
  delivered: "success",
  paid: "success",
};

export function projectStatusLabel(status: string): string {
  return PROJECT_STATUS_LABELS[status as ProjectStatus] ?? status;
}

export function projectStatusTone(status: string): BadgeTone {
  return PROJECT_STATUS_TONES[status as ProjectStatus] ?? "neutral";
}

export function costStatusLabel(status: string): string {
  return COST_STATUS_LABELS[status as CostStatus] ?? status;
}

export function costStatusTone(status: string): BadgeTone {
  return COST_STATUS_TONES[status as CostStatus] ?? "neutral";
}

export type DocumentType =
  | "contract"
  | "invoice"
  | "handover"
  | "photo"
  | "payment_dossier"
  | "other";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  contract: "Hợp đồng",
  invoice: "Hóa đơn",
  handover: "Nghiệm thu",
  photo: "Ảnh công trình",
  payment_dossier: "Hồ sơ thanh toán",
  other: "Khác",
};

export const DOCUMENT_TYPE_TONES: Record<DocumentType, BadgeTone> = {
  contract: "info",
  invoice: "warning",
  handover: "success",
  photo: "neutral",
  payment_dossier: "info",
  other: "neutral",
};

export function documentTypeLabel(type: string): string {
  return DOCUMENT_TYPE_LABELS[type as DocumentType] ?? type;
}

export function documentTypeTone(type: string): BadgeTone {
  return DOCUMENT_TYPE_TONES[type as DocumentType] ?? "neutral";
}
