import { RedDeleteIcon } from '@web/static/icons';
import { DraggableEventHandler } from 'react-draggable';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { TextFieldPosition } from '../types';
import { Box } from '@chakra-ui/react';

export default function Checkbox({
  onStop,
  onResizeStop,
  color,
  onRemove,
  currentPosition,
  disableEdit,
  selected,
  highlighted,
  onMouseDown,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  selected: boolean;
  highlighted: boolean;
  onMouseDown: () => void;
}) {
  return (
    <Rnd
      onMouseDown={onMouseDown}
      lockAspectRatio={true}
      bounds="parent"
      position={{ x: currentPosition.x, y: currentPosition.y }}
      size={{ height: currentPosition.height, width: currentPosition.width }}
      minWidth={'10px'}
      minHeight={'10px'}
      border={selected ? `1px solid blue` : ''}
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
      onDragStop={onStop}
      onResizeStop={onResizeStop}
      disableDragging={disableEdit}
    >
      {!disableEdit && selected && (
        <Box
          pos="absolute"
          left={currentPosition.width + 5}
          zIndex={2}
          onClick={onRemove}
          bg="white"
          padding="1px 2px"
          borderRadius="4px"
          border="1.5px solid"
          borderColor="#E5E5E5"
        >
          {RedDeleteIcon}
        </Box>
      )}
    </Rnd>
  );
}
