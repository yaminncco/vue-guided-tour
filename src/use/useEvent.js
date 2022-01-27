import { watch, unref, onScopeDispose } from "vue";

export default function useEvent(target, type, callback, options) {
  let eventTarget;

  const cleanup = () => {
    if (eventTarget) {
      eventTarget.removeEventListener(type, callback, options);
      eventTarget = undefined;
    }
  };

  const stopWatch = watch(
    () => unref(target),
    (el) => {
      cleanup();
      if (!el) return;
      eventTarget = el;
      el.addEventListener(type, callback, options);
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
