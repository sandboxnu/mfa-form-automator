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
