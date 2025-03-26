import { FieldType, TextFieldPosition } from '../createFormTemplate/types';
import InteractiveCheckbox from './InteractiveCheckbox';
import TextField from './InteractiveTextField';

export default function EditableFieldFactory({
  color,
  currentPosition,
  type,
  highlighted = true,
}: {
  color: string;
  currentPosition: TextFieldPosition;
  type: FieldType;
  highlighted: boolean;
}) {
  return type === FieldType.CHECKBOX ? (
    <InteractiveCheckbox
      color={color}
      currentPosition={currentPosition}
      highlighted={highlighted}
    ></InteractiveCheckbox>
  ) : (
    <TextField
      color={color}
      currentPosition={currentPosition}
      highlighted={highlighted}
    ></TextField>
  );
}
