import { Rnd, RndResizeCallback } from 'react-rnd';
import { DraggableEventHandler } from 'react-draggable';
import { FieldType, TextFieldPosition } from '../types';
import { FaTimes } from 'react-icons/fa';

export default function Checkbox({
  onStop,
  onResizeStop,
  color,
  onRemove,
  currentPosition,
  disableEdit,
  disableDelete,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  disableDelete: boolean;
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
        position: 'absolute',
        zIndex: 100000,
        background: `${color}`,
        opacity: '10px',
        border: `solid 1px grey`,
        padding: 4,
      }}
      onDragStop={onStop}
      onResizeStop={onResizeStop}
      disableDragging={disableEdit}
    >
      <div
        style={{
          position: 'absolute',
          display: 'inline-block',
          borderRadius: 4,
        }}
      >
        {!disableEdit && disableDelete && (
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
