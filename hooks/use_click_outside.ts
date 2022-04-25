import { RefObject, useEffect, useRef } from "react";

type ListenerEvent = MouseEvent & {
  target: Element;
};

export default function useClickOutside<T extends Element>(
  ref: RefObject<T | undefined>,
  callback: (event: ListenerEvent) => void,
  event = "click",
): void {
  const handlerRef = useRef(callback);

  useEffect(() => {
    handlerRef.current = callback;
  });

  useEffect(() => {
    const listener = (event: ListenerEvent) => {
      if (ref && ref.current) {
        if (event.target.shadowRoot) {
          if (!event.target.shadowRoot.contains(ref.current)) {
            handlerRef.current(event);
          }
        } else {
          if (!ref.current.contains(event.target)) {
            handlerRef.current(event);
          }
        }
      }
    };

    document.addEventListener(event, listener as () => void);

    return () => document.removeEventListener(event, listener as () => void);
  }, []);
}
