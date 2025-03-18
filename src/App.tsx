import { useEffect } from 'react';
import { Cell } from '../core';
import { ZoomController } from './components/ZoomController';
import { useCursor, useDeviceSettings, useEngine } from './hooks';

function App() {
  const { canvasRef, engineRef, render } = useEngine();
  const deviceSettings = useDeviceSettings();

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
      if (!engineRef.current) {
        return;
      }

      // TODO: this is a mock for the demonstration purposes
      const cell = new Cell(
        engineRef.current.container,
        engineRef.current.container.palette,
      );
      const projectedPoint =
        engineRef.current.container.camera.getProjectedPoint(cursor.current);

      cell
        .setPosition(projectedPoint.x, projectedPoint.y)
        .setSize(20, 20)
        .setColor(1);
      engineRef.current.addNode(cell);

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
