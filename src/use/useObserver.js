import { watch, unref, onScopeDispose } from "vue";

export default function useObserver(target, callback, options = {}) {
  let observer;

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  };

  const stopWatch = watch(
    () => unref(target),
    (el) => {
      cleanup();
      if (!el) return;
      observer = new window.ResizeObserver(callback);
      observer.observe(el, options);
    },
    { immediate: true, flush: "post" }
  );

  const stop = () => {
    stopWatch();
    cleanup();
  };

  onScopeDispose(stop);

  return stop;
}
