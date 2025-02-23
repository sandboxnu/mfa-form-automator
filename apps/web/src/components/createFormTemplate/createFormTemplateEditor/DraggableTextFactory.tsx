import { Rnd, RndResizeCallback } from 'react-rnd';
import { DraggableEventHandler } from 'react-draggable';
import { FieldType, TextFieldPosition } from '../types';
import { FaTimes } from 'react-icons/fa';
import Checkbox from './CheckBox';
import TextField from './TextField';
import { on } from 'events';

export default function DraggableTextFactory({
  onStop,
  onResizeStop,
  color,
  onRemove,
  currentPosition,
  disableEdit,
  type,
  highlighted = true,
  selected = false,
  onMouseDown,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  initialText: string | null;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  type: FieldType;
  highlighted: boolean;
  selected: boolean;
  onMouseDown: () => void;
}) {
  return type === FieldType.Checkbox ? (
    <Checkbox
      onMouseDown={onMouseDown}
      onStop={onStop}
      onResizeStop={onResizeStop}
      color={color}
      onRemove={onRemove}
      currentPosition={currentPosition}
      disableEdit={disableEdit}
      selected={selected}
      highlighted={highlighted}
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
      selected={selected}
      highlighted={highlighted}
    ></TextField>
  );
}
