import { RndResizeCallback } from 'react-rnd';
import { DraggableEventHandler } from 'react-draggable';
import {
  DraggableBoxFactoryProps,
  FieldType,
  TextFieldPosition,
} from '../types';
import Checkbox from './CheckBox';
import TextField from './TextField';

export default function DraggableBoxFactory(props: DraggableBoxFactoryProps) {
  switch (props.type) {
    case FieldType.CHECKBOX:
      return <Checkbox {...props}></Checkbox>;
    case FieldType.TEXT_FIELD:
      return <TextField {...props}> </TextField>;
    default:
      return <></>;
  }
}
