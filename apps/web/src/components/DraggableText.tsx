import { Rnd, RndResizeCallback } from 'react-rnd';

import { useState, useEffect, useRef } from 'react';
import { DraggableEventHandler } from 'react-draggable';

export default function DraggableText({
  onStop,
  onResizeStop,
  color,
}: {
  onStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
  initialText: string | null;
  color: string;
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
    <Rnd
      bounds="parent"
      minWidth={80}
      minHeight={20}
      style={{
        position: 'absolute',
        zIndex: 100000,
        background: 'transparent',
        border: `solid 1px ${color}`,
      }}
      onDragStop={onStop}
      onResizeStop={onResizeStop}
    ></Rnd>
  );
}
