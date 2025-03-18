import { useEffect } from 'react';
import { Cell } from '../core';
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
      cell
        .setPosition(cursor.currentX, cursor.currentY)
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
    </>
  );
}

export default App;
