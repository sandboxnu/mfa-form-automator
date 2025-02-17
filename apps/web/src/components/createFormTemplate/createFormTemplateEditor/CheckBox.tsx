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
  deleteActive,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  deleteActive: boolean;
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
        border: `solid 1px grey`,
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
      onDragStop={onStop}
      onResizeStop={onResizeStop}
      disableDragging={disableEdit}
    >
      {!disableEdit && deleteActive && (
        <Box position="absolute" left="150%" zIndex={2} onClick={onRemove}>
          {RedDeleteIcon}
        </Box>
      )}
    </Rnd>
  );
}
