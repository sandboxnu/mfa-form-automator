import Draggable, { DraggableEventHandler } from 'react-draggable';

import { useState, useEffect, useRef } from 'react';

export default function DraggableText({
  onEnd,
  onSet,
  onCancel,
  initialText,
}: {
  onEnd: DraggableEventHandler;
  onSet: (text: string) => void;
  onCancel: () => void;
  initialText: string | null;
}) {
  const [text, setText] = useState('Text');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
    } else {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [initialText]);

  const styles = {
    container: {
      position: 'absolute',
      zIndex: 100000,
      border: `2px solid`,
    },
    controls: {
      position: 'absolute',
      right: 0,
      display: 'inline-block',
      backgroundColor: 'red',
      borderRadius: 4,
    },
    smallButton: {
      display: 'inline-block',
      cursor: 'pointer',
      padding: 4,
    },
    input: {
      border: 0,
      fontSize: 20,
      padding: 3,
      backgroundColor: 'rgba(0,0,0,0)',
      cursor: 'move',
    },
  };
  return (
    <Draggable onStop={onEnd}>
      <div
        style={{
          position: 'absolute',
          zIndex: 100000,
          border: `2px solid`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 0,
            display: 'inline-block',
            backgroundColor: 'red',
            borderRadius: 4,
          }}
        >
          {/* add text  */}
          <div style={styles.smallButton} onClick={() => onSet(text)}>Confirm</div>
          <div style={styles.smallButton} onClick={onCancel}>Delete </div>
        </div>
        <input
          ref={inputRef}
          style={styles.input}
          value={text}
          placeholder={'Text'}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </Draggable>
  );
}
