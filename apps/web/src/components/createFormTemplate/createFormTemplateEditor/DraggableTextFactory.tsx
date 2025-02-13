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
  disableDelete,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  initialText: string | null;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  type: FieldType;
  disableDelete: boolean;
}) {
  return type === FieldType.Checkbox ? (
    <Checkbox
      onStop={onStop}
      onResizeStop={onResizeStop}
      color={color}
      onRemove={onRemove}
      currentPosition={currentPosition}
      disableEdit={disableEdit}
      disableDelete={disableDelete}
    ></Checkbox>
  ) : (
    // we'll have to add something else for signature fields but right now lets treat it as
    // a text field
    <TextField
      onStop={onStop}
      onResizeStop={onResizeStop}
      color={color}
      onRemove={onRemove}
      currentPosition={currentPosition}
      disableEdit={disableEdit}
      disableDelete={disableDelete}
    ></TextField>
  );
}
