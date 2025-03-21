import { Box, Text } from '@chakra-ui/react';
import { RedDeleteIcon } from '@web/static/icons';
import { DraggableEventHandler } from 'react-draggable';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { TextFieldPosition } from '../types';

export default function SignatureField({
  onStop,
  onResizeStop,
  color,
  onRemove,
  currentPosition,
  disableEdit,
  selected,
  highlighted,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  selected: boolean;
  highlighted: boolean;
}) {
  return (
    <Rnd
      bounds="parent"
      position={{ x: currentPosition.x, y: currentPosition.y }}
      size={{ height: currentPosition.height, width: currentPosition.width }}
      minWidth={'150px'}
      minHeight={'50px'}
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
        justifyContent: 'center',
      }}
      onDragStop={onStop}
      onResizeStop={onResizeStop}
      disableDragging={disableEdit}
    >
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        width="100%"
        height="100%"
        border="1px #808080"
        borderRadius="4px"
      >
        <Text color="#808080" fontSize="14px"></Text>
      </Box>
      {!disableEdit && selected && (
        <Box
          pos="absolute"
          right="-30px"
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