import { FieldType, TextFieldPosition } from '../createFormTemplate/types';
import InteractiveCheckbox from './InteractiveCheckbox';
import InteractiveSignatureField from './InteractiveSignatureField';
import InteractiveTextField from './InteractiveTextField';
import TextField from './InteractiveTextField';

interface EditableFieldFactoryProps {
  data: {
    filled?: boolean;
    text?: string;
  };
  color: string;
  currentPosition: TextFieldPosition;
  type: FieldType;
  highlighted?: boolean;
  pageNum: number;
  id: string;
}

export default function EditableFieldFactory(props: EditableFieldFactoryProps) {
  switch (props.type) {
    case FieldType.CHECKBOX:
      return (
        <InteractiveCheckbox
          {...props}
          highlighted={props.highlighted ?? false}
          data={props.data.filled ?? false}
        />
      );
    case FieldType.TEXT_FIELD:
      return (
        <InteractiveTextField
          {...props}
          highlighted={props.highlighted ?? false}
          data={props.data.text ?? ''}
        />
      );
    case FieldType.SIGNATURE:
      return (
        <InteractiveSignatureField
          {...props}
          highlighted={props.highlighted ?? false}
          data={props.data.filled ?? false}
        />
      );
    default:
      return null;
  }
}
