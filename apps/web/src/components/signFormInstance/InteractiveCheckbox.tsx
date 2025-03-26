import { Rnd } from 'react-rnd';
import { TextFieldPosition } from '../createFormTemplate/types';
import { Checkbox } from '@chakra-ui/react';

export default function InteractiveCheckbox({
  color,
  currentPosition,
  highlighted,
}: {
  color: string;
  currentPosition: TextFieldPosition;
  highlighted: boolean;
}) {
  return (
    <Rnd
      lockAspectRatio={true}
      bounds="parent"
      position={{ x: currentPosition.x, y: currentPosition.y }}
      size={{ height: currentPosition.height, width: currentPosition.width }}
      minWidth={'10px'}
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
      <Checkbox.Control />
    </Rnd>
  );
}
