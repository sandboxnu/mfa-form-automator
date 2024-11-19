import {Rnd, RndResizeCallback} from "react-rnd"

import { useState, useEffect, useRef } from 'react';
import { DraggableEventHandler } from "react-draggable";

export default function DraggableText({
  onEndDrag,
  onEndResize, 
  onSet,
  onCancel,
}: {
  onEndDrag: DraggableEventHandler;
  onEndResize: RndResizeCallback;
  onSet: () => void;
  onCancel: () => void;
  initialText: string | null;
}) {

  

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
    <Rnd onStop={onEndDrag} onResizeStop={onEndResize}>
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
          <div style={styles.smallButton} onClick={onSet}>Confirm</div>
          <div style={styles.smallButton} onClick={onCancel}>Delete </div>
        </div>
        
      </div>
    </Rnd>
  );
}
