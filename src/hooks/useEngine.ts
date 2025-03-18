import { useEffect, useRef } from 'react';
import { Subject, throttleTime } from 'rxjs';
import { Engine } from '../../core';

export function useEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine>(new Engine());
  const renderSubject = useRef(new Subject<boolean>());

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) {
      return;
    }

    engineRef.current.init(canvasRef.current);

    const renderSubscription = renderSubject.current
      .pipe(throttleTime(1000 / 60))
      .subscribe((shouldRender) => {
        if (shouldRender) {
          engineRef.current.render();
        }
      });

    return () => {
      renderSubscription.unsubscribe();
    };
  }, []);

  function renderingFunction(shouldRender = true) {
    renderSubject.current.next(shouldRender);
  }

  return { canvasRef, engineRef, render: renderingFunction };
}
