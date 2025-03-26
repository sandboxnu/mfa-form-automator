import { Box } from '@chakra-ui/react';
import { RedDeleteIcon } from '@web/static/icons';
import { DraggableEventHandler } from 'react-draggable';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { TextFieldPosition } from '../createFormTemplate/types';

export default function TextField({
  color,
  currentPosition,
  selected,
  highlighted,
}: {
  color: string;
  currentPosition: TextFieldPosition;
  selected: boolean;
  highlighted: boolean;
}) {
  return (
    <Rnd
      bounds="parent"
      position={{ x: currentPosition.x, y: currentPosition.y }}
      size={{ height: currentPosition.height, width: currentPosition.width }}
      minWidth={'50px'}
      minHeight={'10px'}
      border={selected ? `1px solid blue` : ''}
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
      <Box display="flex" alignItems="center" justifyContent="center"></Box>
    </Rnd>
  );
}
