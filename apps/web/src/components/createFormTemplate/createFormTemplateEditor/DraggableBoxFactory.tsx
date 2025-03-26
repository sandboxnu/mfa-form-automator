import { RndResizeCallback } from 'react-rnd';
import { DraggableEventHandler } from 'react-draggable';
import {
  DraggableBoxFactoryProps,
  FieldType,
  TextFieldPosition,
} from '../types';
import Checkbox from './CheckBox';
import TextField from './TextField';

export default function DraggableTextFactory(props: DraggableBoxFactoryProps) {
  return props.type === FieldType.CHECKBOX ? (
    <Checkbox {...props}></Checkbox>
  ) : (
    // we'll have to add something else for signature fields but right now lets treat it as
    // a text field
    <TextField {...props}> </TextField>
  );
}
