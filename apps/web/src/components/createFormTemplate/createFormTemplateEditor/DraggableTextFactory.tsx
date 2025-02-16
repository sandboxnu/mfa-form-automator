import { Rnd, RndResizeCallback } from 'react-rnd';
import { DraggableEventHandler } from 'react-draggable';
import { FieldType, TextFieldPosition } from '../types';
import { FaTimes } from 'react-icons/fa';
import Checkbox from './CheckBox';
import TextField from './TextField';

export default function DraggableTextFactory({
  onStop,
  onResizeStop,
  color,
  onRemove,
  currentPosition,
  disableEdit,
  type,
  onMouseDown,
  deleteActive = false,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  initialText: string | null;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  type: FieldType;
  onMouseDown: (e: MouseEvent) => void;
  deleteActive: boolean;
}) {
  return type === FieldType.Checkbox ? (
    <Checkbox
      onStop={onStop}
      onResizeStop={onResizeStop}
      color={color}
      onRemove={onRemove}
      currentPosition={currentPosition}
      disableEdit={disableEdit}
      onMouseDown={onMouseDown}
      deleteActive={deleteActive}
    ></Checkbox>
  ) : (
    // we'll have to add something else for signature fields but right now lets treat it as
    // a text field
    <TextField
      onMouseDown={onMouseDown}
      onStop={onStop}
      onResizeStop={onResizeStop}
      color={color}
      onRemove={onRemove}
      currentPosition={currentPosition}
      disableEdit={disableEdit}
      deleteActive={deleteActive}
    ></TextField>
  );
}
