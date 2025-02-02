export type TempSignatureField = {
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
  Text,
  Checkbox,
  Signature,
}

export type FieldGroupColor = {
  border: string;
  background: string;
};

export type groupId = string;
export type fieldId = string;

export type FieldGroups = Map<groupId, FieldGroupColor>;

// Dictionary from page number to fields on that page.
export type FormFields = Record<number, Map<fieldId, Field>>;

export type Field = {
  position: TextFieldPosition;
  groupId: string;
  type: FieldType;
};
