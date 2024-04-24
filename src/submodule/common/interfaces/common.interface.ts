export interface IRejectInfo {
  rejectedById: number;
  rejectedBy: string;
  rejectReason: string;
  rejectAt: Date;
}

export interface IApprovalInfo {
  approvalById: number;
  approvalBy: string;
  approvalReason?: string;
  approvalAt: Date;
}

export interface IFullAddress {
  address?: string;
  ward?: { name: string };
  district?: { name: string };
  province?: { name: string };
}
