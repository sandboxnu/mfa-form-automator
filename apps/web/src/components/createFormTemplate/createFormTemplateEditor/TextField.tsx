import { DraggableEventHandler } from 'react-draggable';
import { FaTimes } from 'react-icons/fa';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { TextFieldPosition } from '../types';

export default function TextField({
  onStop,
  onResizeStop,
  color,
  onRemove,
  currentPosition,
  disableEdit,
  onMouseDown,
  deleteActive,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  onMouseDown: (e: MouseEvent) => void;
  deleteActive: boolean;
}) {
  return (
    <Rnd
      bounds="parent"
      position={{ x: currentPosition.x, y: currentPosition.y }}
      size={{ height: currentPosition.height, width: currentPosition.width }}
      minWidth={'50px'}
      minHeight={'10px'}
      style={{
        position: 'absolute',
        zIndex: 1,
        background: `${color}`,
        opacity: '10px',
        border: `solid 1px grey`,
        padding: 4,
      }}
      onDragStop={onStop}
      onResizeStop={onResizeStop}
      disableDragging={disableEdit}
      onMouseDown={onMouseDown}
    >
      <div
        style={{
          position: 'absolute',
          display: 'inline-block',
          borderRadius: 4,
        }}
      >
        {!disableEdit && deleteActive && (
          <div
            style={{
              display: 'inline-block',
              cursor: 'pointer',
              padding: 4,
            }}
            onClick={onRemove}
          >
            <FaTimes color={'#ef6565'} />
          </div>
        )}
      </div>
    </Rnd>
  );
}
