import { Rnd, RndResizeCallback } from 'react-rnd';
import { DraggableEventHandler } from 'react-draggable';
import { FieldType, TextFieldPosition } from './FormEditor';
import { FaTimes } from 'react-icons/fa';

export default function DraggableText({
  onStop,
  onResizeStop,
  color,
  onRemove,
  currentPosition,
  disableEdit,
  type,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  initialText: string | null;
  color: string;
  onRemove: () => void;
  currentPosition: TextFieldPosition;
  disableEdit: boolean;
  type: FieldType;
}) {
  return (
    <Rnd
      lockAspectRatio={type == FieldType.Checkbox ? true : false}
      bounds="parent"
      position={{ x: currentPosition.x, y: currentPosition.y }}
      size={{ height: currentPosition.height, width: currentPosition.width }}
      minWidth={type == FieldType.Checkbox ? '30px' : '50px'}
      enableResizing={
        type == FieldType.Checkbox
          ? { left: false, right: false, top: false, bottom: false }
          : {}
      }
      minHeight={type == FieldType.Checkbox ? '30px' : '40px'}
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
        {!disableEdit && (
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
