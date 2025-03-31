import { RndResizeCallback } from 'react-rnd';
import { DraggableEventHandler } from 'react-draggable';
import { FieldType, TextFieldPosition } from '../types';
import Checkbox from './CheckBox';
import TextField from './TextField';
import SignatureField from './SignatureField';
import Error from '@web/components/Error';

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
}) {
  switch (type) {
    case FieldType.CHECKBOX:
      return (
        <Checkbox
          onStop={onStop}
          onResizeStop={onResizeStop}
          color={color}
          onRemove={onRemove}
          currentPosition={currentPosition}
          disableEdit={disableEdit}
          selected={selected}
          highlighted={highlighted}
        />
      );
    case FieldType.SIGNATURE:
      return (
        <SignatureField
          onStop={onStop}
          onResizeStop={onResizeStop}
          color={color}
          onRemove={onRemove}
          currentPosition={currentPosition}
          disableEdit={disableEdit}
          selected={selected}
          highlighted={highlighted}
        />
      );
    case FieldType.TEXT_FIELD:
      return (
        <TextField
          onStop={onStop}
          onResizeStop={onResizeStop}
          color={color}
          onRemove={onRemove}
          currentPosition={currentPosition}
          disableEdit={disableEdit}
          selected={selected}
          highlighted={highlighted}
        />
      );
    default:
      throw Error;
  }
}
