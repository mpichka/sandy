import { useState, type RefObject } from 'react';
import { Engine } from '../../core';
import { useZoom } from '../hooks/useZoom';

type Props = {
  engineRef: RefObject<Engine>;
};

export function ZoomController(props: Props) {
  const { engineRef } = props;

  const [zoom, setZoom] = useState(100);

  useZoom({
    onZoom(cursor) {
      if (!engineRef.current || !engineRef.current.isInitialized) {
        return;
      }

      const { deltaY, current, pitchDelta } = cursor;

      const engine = engineRef.current;
      const camera = engine.container.camera;

      const minZoom = camera.MIN_ZOOM * 100;
      const maxZoom = camera.MAX_ZOOM * 100;

      let value: number;

      if (pitchDelta) {
        value = Math.round(
          Math.max(-minZoom, Math.min(pitchDelta / 2, minZoom)),
        );
      } else {
        if (deltaY === 0) return;
        value = deltaY > 0 ? -minZoom : minZoom;
      }

      let scale = zoom + value;
      if (scale >= minZoom && scale <= maxZoom) {
        camera.setZoom(value, current);
        engine.render();
      }
      if (scale < minZoom) scale = minZoom;
      if (scale > maxZoom) scale = maxZoom;

      setZoom(Math.floor(camera.zoom * 100));
    },
  });

  function changeZoom(value: number) {
    if (!engineRef.current || !engineRef.current.isInitialized) {
      return;
    }

    const engine = engineRef.current;
    const camera = engine.container.camera;

    let newValue = zoom + value;
    const minZoom = 10;
    const maxZoom = 200;

    if (newValue < minZoom) newValue = minZoom;
    if (newValue > maxZoom) newValue = maxZoom;
    const remainder = newValue % 10;
    if (remainder) newValue -= remainder;

    setZoom(newValue);

    camera.setZoom(newValue);
    engine.render();
  }

  function resetZoom() {
    if (!engineRef.current || !engineRef.current.isInitialized) {
      return;
    }

    const engine = engineRef.current;
    const camera = engine.container.camera;

    setZoom(100);

    camera.setZoom(100);
    engine.render();
  }

  return (
    <div
      className='paper'
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
      }}
    >
      <button onClick={() => changeZoom(-10)}>-</button>
      <button onClick={() => resetZoom()}>{zoom}%</button>
      <button onClick={() => changeZoom(10)}>+</button>
    </div>
  );
}
