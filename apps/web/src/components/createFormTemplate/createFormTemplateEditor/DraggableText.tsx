import { Rnd, RndResizeCallback } from 'react-rnd';
import { DraggableEventHandler } from 'react-draggable';
import { FaTimes } from 'react-icons/fa';

export default function DraggableText({
  onStop,
  onResizeStop,
  color,
  onRemove,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  initialText: string | null;
  color: string;
  onRemove: () => void;
}) {
  return (
    <Rnd
      bounds="parent"
      minWidth={80}
      minHeight={30}
      style={{
        position: 'absolute',
        zIndex: 100000,
        background: 'transparent',
        border: `solid 2px ${color}`,
        borderRadius: 4,
        padding: 4,
      }}
      onDragStop={onStop}
      onResizeStop={onResizeStop}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'inline-block',
          borderRadius: 4,
        }}
      >
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
      </div>
    </Rnd>
  );
}
