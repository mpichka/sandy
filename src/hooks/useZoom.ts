import {
  type MutableRefObject,
  type RefObject,
  useEffect,
  useRef,
} from 'react';
import { Cursor } from '../../core/utils';

type Props<T extends HTMLElement> = {
  ref?: RefObject<T> | MutableRefObject<T | null> | T;
  onZoom: (cursor: Cursor) => void;
};

export function useZoom<T extends HTMLElement>(props: Props<T>) {
  const { ref, onZoom } = props;

  const cursorRef = useRef<Cursor>(new Cursor());
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

    element.addEventListener('wheel', onInputZoom, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [ref]);
}
