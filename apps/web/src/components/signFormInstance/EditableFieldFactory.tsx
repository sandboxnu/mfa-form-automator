import { FieldType, TextFieldPosition } from '../createFormTemplate/types';
import InteractiveCheckbox from './InteractiveCheckbox';
import TextField from './InteractiveTextField';

export default function EditableFieldFactory({
  color,
  currentPosition,
  type,
  highlighted = true,
  pageNum,
  id,
}: {
  color: string;
  currentPosition: TextFieldPosition;
  type: FieldType;
  highlighted: boolean;
  pageNum: number;
  id: string;
}) {
  return type === FieldType.CHECKBOX ? (
    <InteractiveCheckbox
      color={color}
      currentPosition={currentPosition}
      highlighted={highlighted}
      pageNum={pageNum}
      id={id}
    ></InteractiveCheckbox>
  ) : (
    <TextField
      color={color}
      currentPosition={currentPosition}
      highlighted={highlighted}
      pageNum={pageNum}
      id={id}
    ></TextField>
  );
}
