import { DependencyList, useEffect } from "react";

export default function useIntersection({ instance, target }: {
  instance: () => IntersectionObserver;
  target: () =>
    | Element
    | undefined
    | null
    | Iterable<Element>;
}, deps?: DependencyList): void {
  useEffect(() => {
    const _target = target();
    if (!_target) return;
    const _intersectionObserver = instance();

    const __target = _target instanceof Element ? [_target] : _target;
    Array.from(__target).forEach((el) => {
      _intersectionObserver.observe(el);
    });

    return () => {
      _intersectionObserver.disconnect();
    };
  }, deps);
}
