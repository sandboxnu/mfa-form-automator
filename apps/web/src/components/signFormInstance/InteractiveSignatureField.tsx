import { Checkbox } from '@chakra-ui/react';
import { Rnd } from 'react-rnd';
import { TextFieldPosition } from '../createFormTemplate/types';
import { useSignFormInstance } from '@web/hooks/useSignFormInstance';

export default function InteractiveSignatureField({
  data,
  color,
  currentPosition,
  highlighted,
  pageNum,
  id,
}: {
  data: boolean;
  color: string;
  currentPosition: TextFieldPosition;
  highlighted: boolean;
  pageNum: number;
  id: string;
}) {
  const { updateField } = useSignFormInstance();
  return (
    <Rnd
      bounds="parent"
      position={{ x: currentPosition.x, y: currentPosition.y }}
      size={{ height: currentPosition.height, width: currentPosition.width }}
      minWidth={'50px'}
      minHeight={'10px'}
      enableResizing={{
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: false,
        top: false,
        topLeft: false,
        topRight: false,
      }}
      disableDragging={true}
      style={{
        zIndex: 10,
        background: `${color}`,
        opacity: '10px',
        borderRadius: '2px',
        border: `${highlighted ? 'solid 2px #1367EA' : ''}`,
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Checkbox.Root
        defaultChecked={data}
        onCheckedChange={(val) => updateField(pageNum, id, val.checked)}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>
    </Rnd>
  );
}
