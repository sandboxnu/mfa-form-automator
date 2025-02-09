import { PositionEntity } from '@web/client';

export interface CreateFormInstanceModalProps {
  open: boolean;
  onClose: () => void;
}

// value represents the position id
export interface PositionOption {
  value: string;
  label: string;
}

export interface AssignedGroupData {
  fieldGroupId: string;
  order: number;
  positionId?: string;
}
