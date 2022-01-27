import { watch, reactive, unref } from "vue";
import useEvent from "./useEvent";
import useObserver from "./useObserver";

export default function useRect(target) {
  const rect = reactive({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
  });

  const update = () => {
    const el = unref(target);
    if (!el) {
      setRect({});
      return;
    }
    setRect(el.getBoundingClientRect());

    function setRect({ top = 0, left = 0, width = 0, height = 0 }) {
      rect.top = top;
      rect.left = left;
      rect.width = width;
      rect.height = height;
      rect.bottom = height + top;
      rect.right = width + left;
    }
  };

  watch(
    () => unref(target),
    () => {
      update();
    },
    { immediate: true, flush: "post" }
  );

  useEvent(window, "scroll", update);
  useObserver(target, update);

  return {
    rect,
  };
}
