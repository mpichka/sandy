import { useEffect, useRef } from 'react';
import { Cell, CursorButton } from '../core';
import { ZoomController } from './components/ZoomController';
import { useCursor, useDeviceSettings, useEngine } from './hooks';

function App() {
  const { canvasRef, engineRef, render } = useEngine();
  const deviceSettings = useDeviceSettings();

  const moveRef = useRef(false);

  useEffect(() => {
    if (!engineRef.current) {
      return;
    }

    const engine = engineRef.current;
    engine.container.camera.applyDeviceSettings(deviceSettings);
    engine.render();

    // TODO: mocks should be removed after implementing grid and palettes
    engineRef.current.container.palette.setPalette([
      {
        index: 1,
        uid: 1,
        name: 'temp',
        hex: '#ff0000',
        symbol: '1',
      },
    ]);
  }, [deviceSettings, engineRef]);

  useCursor({
    ref: canvasRef,
    onCursorDown(cursor) {
      if (!engineRef.current || !engineRef.current.isInitialized) {
        return;
      }

      const { button, current } = cursor;

      if (button === CursorButton.MIDDLE) {
        moveRef.current = true;
      }

      if (button === CursorButton.PRIMARY || button === CursorButton.TOUCH) {
        // TODO: this is a mock for the demonstration purposes
        const cell = new Cell(
          engineRef.current.container,
          engineRef.current.container.palette,
        );
        const projectedPoint =
          engineRef.current.container.camera.getProjectedPoint(current);

        cell
          .setPosition(projectedPoint.x, projectedPoint.y)
          .setSize(20, 20)
          .setColor(1);
        engineRef.current.addNode(cell);
      }

      render();
    },
    onCursorUp(cursor) {
      const { button } = cursor;

      if (button === CursorButton.MIDDLE) {
        moveRef.current = false;
      }

      render();
    },
    onCursorMove(cursor) {
      if (!engineRef.current || !engineRef.current.isInitialized) {
        return;
      }

      const camera = engineRef.current.container.camera;

      if (moveRef.current) {
        camera.move(cursor.delta);
      }

      render();
    },
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        width={deviceSettings.width}
        height={deviceSettings.height}
      />
      <ZoomController engineRef={engineRef} />
    </>
  );
}

export default App;
