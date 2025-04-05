import { FieldType, TextFieldPosition } from '../createFormTemplate/types';
import InteractiveCheckbox from './InteractiveCheckbox';
import TextField from './InteractiveTextField';

export default function EditableFieldFactory({
  data,
  color,
  currentPosition,
  type,
  highlighted = true,
  pageNum,
  id,
}: {
  data: {
    filled?: boolean;
    text?: string;
  };
  color: string;
  currentPosition: TextFieldPosition;
  type: FieldType;
  highlighted: boolean;
  pageNum: number;
  id: string;
}) {
  return type === FieldType.CHECKBOX ? (
    <InteractiveCheckbox
      data={data.filled ?? false}
      color={color}
      currentPosition={currentPosition}
      highlighted={highlighted}
      pageNum={pageNum}
      id={id}
    ></InteractiveCheckbox>
  ) : (
    <TextField
      data={data.text ?? ''}
      color={color}
      currentPosition={currentPosition}
      highlighted={highlighted}
      pageNum={pageNum}
      id={id}
    ></TextField>
  );
}
