import { DraggableEventHandler } from 'react-draggable';
import { FaTimes } from 'react-icons/fa';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { TextFieldPosition } from '../types';
import { RedDeleteIcon } from '@web/static/icons';
import { Box } from '@chakra-ui/react';

export default function TextField({
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
  console.log(currentPosition.height);
  return (
    <Rnd
      bounds="parent"
      position={{ x: currentPosition.x, y: currentPosition.y }}
      size={{ height: currentPosition.height, width: currentPosition.width }}
      minWidth={'50px'}
      minHeight={'10px'}
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
      <Box display="flex" alignItems="center" justifyContent="center">
        {!disableEdit &&
          deleteActive &&
          (currentPosition.height <= 17 ? (
            <Box
              position="absolute"
              left={currentPosition.width + 5}
              zIndex={2}
              onClick={onRemove}
            >
              {RedDeleteIcon}
            </Box>
          ) : (
            <Box zIndex={2} onClick={onRemove}>
              {RedDeleteIcon}
            </Box>
          ))}
      </Box>
    </Rnd>
  );
}
