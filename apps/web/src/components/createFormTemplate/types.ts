import { DraggableEventHandler } from "react-draggable";
import { RndResizeCallback } from "react-rnd";

export type TempFieldGroup = {
  id: string;
  value: string;
};
export type TextFieldPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum FieldType {
  TEXT_FIELD = 'TEXT_FIELD',
  CHECKBOX = 'CHECKBOX',
  SIGNATURE = 'SIGNATURE',
}

export type FieldGroupColor = {
  border: string;
  background: string;
  groupName: string;
};
export interface DraggableBoxFactoryProps {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  type: FieldType;
  highlighted: boolean;
  selected: boolean;
}

export type groupId = string;
export type fieldId = string;

export type FieldGroups = Map<groupId, FieldGroupColor>;

// Dictionary from page number to fields on that page.
export type FormFields = Record<number, Map<fieldId, Field>>;

export type SelectedField = {
  pageNumber: number;
  fieldId: string;
};
export type Field = {
  position: TextFieldPosition;
  groupId: string;
  type: FieldType;
};
