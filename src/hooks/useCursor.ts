import {
  type MutableRefObject,
  type RefObject,
  useEffect,
  useRef,
} from 'react';
import { Cursor } from '../../core/utils';

type Props<T extends HTMLElement> = {
  ref?: RefObject<T> | MutableRefObject<T | null> | T;
  onCursorDown?: (cursor: Cursor) => void;
  onCursorUp?: (cursor: Cursor) => void;
  onCursorMove?: (cursor: Cursor) => void;
  onZoom?: (cursor: Cursor) => void;
};

export function useCursor<T extends HTMLElement>(props: Props<T>) {
  const { ref, onCursorDown, onCursorUp, onCursorMove, onZoom } = props;

  const cursorRef = useRef<Cursor>(new Cursor());

  function onInputDown(e: any) {
    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    cursor.setButton(e);
    cursor.setStart(e);
    cursor.resetPitch();

    if (onCursorDown) {
      onCursorDown(cursor);
    }
  }

  function onInputUp(e: any) {
    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    cursor.setButton(e);
    cursor.setDelta(e);
    cursor.setCurrent(e);
    cursor.resetPitch();

    if (onCursorUp) {
      onCursorUp(cursor);
    }
  }

  function onInputMove(e: any) {
    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.setButton(e);
    cursor.setDelta(e);
    cursor.setCurrent(e);

    if (e.touches && e.touches.length === 2) {
      if (onZoom) {
        onZoom(cursor);
      }

      cursor.previousDiff = cursor.currentDiff;
      return;
    }

    if (onCursorMove) {
      onCursorMove(cursor);
    }
  }

  function onInputZoom(e: any) {
    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.setCurrent(e);
    cursor.setDelta(e);

    if (onZoom) {
      onZoom(cursor);
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let element: T | Window = window;
    if (ref instanceof HTMLElement) {
      element = ref;
    } else if (ref && 'current' in ref && ref.current instanceof HTMLElement) {
      element = ref.current;
    }

    const controller = new AbortController();

    element.addEventListener('mousedown', onInputDown, {
      signal: controller.signal,
    });
    element.addEventListener('touchstart', onInputDown, {
      signal: controller.signal,
    });

    element.addEventListener('mouseup', onInputUp, {
      signal: controller.signal,
    });
    element.addEventListener('touchend', onInputUp, {
      signal: controller.signal,
    });

    element.addEventListener('mousemove', onInputMove, {
      signal: controller.signal,
    });
    element.addEventListener('touchmove', onInputMove, {
      signal: controller.signal,
    });

    element.addEventListener('wheel', onInputZoom, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [ref]);
}
