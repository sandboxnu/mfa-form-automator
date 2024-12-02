import Draggable, { DraggableEventHandler } from 'react-draggable';

export default function DraggableSignature({
  onEnd,
  onSet,
  onCancel,
  url,
}: {
  onEnd: DraggableEventHandler;
  onSet: () => void;
  onCancel: () => void;
  url: string;
}) {
  const styles = {
    container: {
      Position: 'absolute',
      zIndex: 100000,
      border: `2px solid gray`,
    },
    controls: {
      Position: 'absolute',
      right: 0,
      display: 'inline-block',
      backgroundColor: 'white',
      // borderRadius: 4,
    },
    smallButton: {
      display: 'inline-block',
      cursor: 'pointer',
      padding: 4,
    },
  };
  return (
    <Draggable onStop={onEnd}>
      <div style={styles.container}>
        <div style={styles.controls}>
          <div style={styles.smallButton} onClick={onSet}>
            Set{' '}
          </div>
          <div style={styles.smallButton} onClick={onCancel}>
            Cancel
          </div>
        </div>
      </div>
    </Draggable>
  );
}
