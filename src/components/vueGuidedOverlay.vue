<template>
  <teleport to="body">
    <div
      class="vue-guided-overlay"
      :class="active && 'vgt--active'"
    >
      <div
        class="vgt__overlay-wrapper"
        :style="overlayWrapperStyle"
      >
        <div
          v-for="(overlay, key) in overlaysRect"
          :key="key"
          :ref="
            (el) => {
              if (el) overlaysRef[key] = el;
            }
          "
          :class="`vgt__overlay vgt__overlay--${key}`"
          :style="overlaysRectStyle(key)"
          @click="onOverlayClick"
        />
      </div>
    </div>
  </teleport>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  nextTick,
  onBeforeUpdate,
  toRefs,
  watch,
} from "vue";
import { overlayProps } from "../propsValidation";
import useEvent from "../use/useEvent";

export default {
  name: "VueGuidedOverlay",
  props: {
    ...overlayProps,
  },
  emits: ["overlay-click", "update:rect"],
  setup(props, { emit }) {
    const {
      rect,
      allowInteraction,
      allowOverlayClose,
      allowEscClose,
      preventScroll,
    } = toRefs(props);
    const active = ref(false);
    const moving = ref(false);

    const rectDefault = { top: 0, left: 0, width: 0, height: 0 };
    const currentRect = reactive({ ...rectDefault });
    const prevRect = reactive({ ...rectDefault });

    const overlayWrapper = reactive({
      width: 0,
      height: 0,
    });
    const overlaysRef = ref([]);
    const overlayRectDefault = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const overlaysRect = reactive(
      Object.fromEntries(
        ["top", "left", "bottom", "right", "center"].map((key) => [
          key,
          { ...overlayRectDefault },
        ])
      )
    );

    const fadeDuration = 300;
    const moveDuration = 450;
    const moveEase = "cubic-bezier(.65,.05,.36,1)";

    const overlayWrapperStyle = computed(() => {
      return {
        width: `${overlayWrapper.width}px`,
        height: `${overlayWrapper.height}px`,
        overflow: "hidden",
        position: "absolute",
        top: "0px",
        left: "0px",
        opacity: active.value ? "0.65" : "0",
        visibility: active.value ? "visible" : "hidden",
        "pointer-events": allowInteraction.value && "none",
        transition: `${fadeDuration}ms opacity, ${fadeDuration}ms visibility`,
      };
    });

    const overlaysRectStyle = computed(() => {
      return (key) => {
        const overlay = overlaysRect[key];
        if (!overlay) return null;
        const position = {
          position: "absolute",
        };
        let transformOrigin = null;

        if (key === "bottom") {
          position.bottom = "0px";
          transformOrigin = "bottom left";
        } else if (key === "right") {
          position.right = "0px";
          transformOrigin = "top right";
        } else {
          position.top = "0px";
          position.left = "0px";
          transformOrigin = "top left";
        }

        return {
          width: `${overlay.width}px`,
          height: `${overlay.height}px`,
          transform: `translate3d(${overlay.x}px, ${overlay.y}px, 0) scale3d(${overlay.scaleX}, ${overlay.scaleY}, 1)`,
          ...position,
          transformOrigin,
        };
      };
    });

    const updateRect = (rect, { top = 0, left = 0, width = 0, height = 0 }) => {
      rect.top = top;
      rect.left = left;
      rect.width = width;
      rect.height = height;
      rect.bottom = height + top;
      rect.right = width + left;
    };

    const getOverlayRect = ({ top, left, right, bottom, width, height }) => {
      const w = overlayWrapper.width;
      const h = overlayWrapper.height;
      const size = 200;

      const topOverlay = {
        width: size,
        height: size,
        x: 0,
        y: top + window.scrollY < 0 ? -size + top + window.scrollY : 0,
        scaleX: w / size,
        scaleY: top + window.scrollY < 0 ? 1 : (top + window.scrollY) / size,
      };
      const leftOverlay = {
        width: size,
        height: size,
        x: left + window.scrollX < 0 ? -size + left + window.scrollX : 0,
        y: 0,
        scaleX: left + window.scrollX < 0 ? 1 : (left + window.scrollX) / size,
        scaleY: h / size,
      };
      const rightOverlay = {
        width: size,
        height: size,
        x:
          right + window.scrollX > w
            ? -(w - (right + window.scrollX)) + size
            : 0,
        y: 0,
        scaleX:
          right + window.scrollX > w
            ? 1
            : (w - (right + window.scrollX)) / size,
        scaleY: h / size,
      };
      const bottomOverlay = {
        width: size,
        height: size,
        x: 0,
        y:
          bottom + window.scrollY > h
            ? -(h - (bottom + window.scrollY)) + size
            : 0,
        scaleX: w / size,
        scaleY:
          bottom + window.scrollY > h
            ? 1
            : (h - (bottom + window.scrollY)) / size,
      };
      const centerOverlay = {
        width,
        height,
        x: left + window.scrollX,
        y: top + window.scrollY,
        scaleX: 1,
        scaleY: 1,
      };

      return {
        top: topOverlay,
        left: leftOverlay,
        right: rightOverlay,
        bottom: bottomOverlay,
        center: centerOverlay,
      };
    };

    const updateOverlayWrapper = () => {
      const fullHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const fullWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.body.clientWidth,
        document.documentElement.clientWidth
      );
      overlayWrapper.width = fullWidth;
      overlayWrapper.height = fullHeight;
    };

    const resetOverlayWrapper = () => {
      overlayWrapper.width = 0;
      overlayWrapper.height = 0;
    };

    const updateOverlaysRect = () => {
      const currentOverlayRect = getOverlayRect(currentRect);
      for (const overlayKey in overlaysRect) {
        const overlay = overlaysRect[overlayKey];
        overlay.width = currentOverlayRect[overlayKey].width;
        overlay.height = currentOverlayRect[overlayKey].height;
        overlay.x = currentOverlayRect[overlayKey].x;
        overlay.y = currentOverlayRect[overlayKey].y;
        overlay.scaleX = currentOverlayRect[overlayKey].scaleX;
        overlay.scaleY = currentOverlayRect[overlayKey].scaleY;
      }
    };

    const invertOverlaysRect = () => {
      const prevOverlayRect = getOverlayRect(prevRect);
      const currentOverlayRect = getOverlayRect(currentRect);

      for (const overlayKey in overlaysRect) {
        const overlay = overlaysRect[overlayKey];
        if (overlayKey === "center") {
          overlay.x +=
            prevOverlayRect[overlayKey].x - currentOverlayRect[overlayKey].x;
          overlay.y +=
            prevOverlayRect[overlayKey].y - currentOverlayRect[overlayKey].y;
          overlay.scaleX =
            prevOverlayRect[overlayKey].width /
            currentOverlayRect[overlayKey].width;
          overlay.scaleY =
            prevOverlayRect[overlayKey].height /
            currentOverlayRect[overlayKey].height;
        } else {
          overlay.x = prevOverlayRect[overlayKey].x;
          overlay.y = prevOverlayRect[overlayKey].y;
          overlay.scaleX = prevOverlayRect[overlayKey].scaleX;
          overlay.scaleY = prevOverlayRect[overlayKey].scaleY;
        }
      }
    };

    const moveOverlaysRect = (callback = undefined) => {
      for (const overlayKey in overlaysRect) {
        overlaysRef.value[
          overlayKey
        ].style.transition = `${moveDuration}ms transform ${moveEase}`;
      }

      updateOverlaysRect();
      setTimeout(() => {
        updateRect(currentRect, rect.value);
        updateOverlaysRect();
        for (const overlayKey in overlaysRect) {
          overlaysRef.value[overlayKey].style.transition = ``;
        }
        moving.value = false;
        if (callback) {
          callback();
        }
      }, moveDuration);
    };

    const overlayUpdate = () => {
      if (!active.value || moving.value) return;
      resetOverlayWrapper();
      nextTick(() => {
        updateOverlayWrapper();
        updateRect(currentRect, rect.value);
        updateOverlaysRect();
      });
    };

    const overlayFadeIn = (callback = undefined) => {
      overlayUpdate();
      moving.value = true;
      setTimeout(() => {
        moving.value = false;
        if (callback) {
          callback();
        }
      }, fadeDuration);
    };

    const overlayFadeOut = (callback = undefined) => {
      setTimeout(() => {
        resetOverlayWrapper();
        if (callback) {
          callback();
        }
      }, fadeDuration);
    };

    const overlayMove = (callback) => {
      moving.value = true;
      resetOverlayWrapper();
      nextTick(() => {
        updateOverlayWrapper();
        updateRect(
          prevRect,
          overlaysRef.value["center"].getBoundingClientRect()
        );
        updateOverlaysRect();
        invertOverlaysRect();
        setTimeout(() => {
          moveOverlaysRect(callback);
        }, 16);
      });
    };

    const overlayStart = (callback) => {
      if (active.value) return;
      handleTargetUpdate(rect.value, callback);
    };

    const overlayClose = (callback) => {
      if (!active.value || moving.value) return;
      handleTargetUpdate(undefined, callback);
    };

    const overlayMoveTo = (newRect, callback) => {
      if (!active.value || moving.value || !newRect) return;
      emit("update:rect", newRect);
      handleTargetUpdate(newRect, callback, true);
    };

    const handleTargetUpdate = (newRect, callback, move = false) => {
      if (!newRect) {
        active.value = false;
        overlayFadeOut(callback);
        return;
      }

      updateRect(prevRect, currentRect);
      updateRect(currentRect, newRect);

      active.value = true;
      move ? overlayMove(callback) : overlayFadeIn(callback);
    };

    const onUpdate = () => {
      if (!active.value || moving.value) return;
      if (preventScroll.value) return;
      overlayUpdate();
    };

    onBeforeUpdate(() => {
      overlaysRef.value = [];
    });

    const onOverlayClick = () => {
      if (!allowOverlayClose.value) return;
      emit("overlay-click");
      overlayClose();
    };

    const onKeyUp = (event) => {
      if (event.key !== "Escape" || !allowEscClose.value) return;
      emit("overlay-click");
      overlayClose();
    };

    watch(
      () => rect.value,
      () => {
        nextTick(() => {
          onUpdate();
        })
      },
      {
        deep: true,
      }
    );
    useEvent(window, "scroll", onUpdate);
    useEvent(window, "resize", onUpdate);
    useEvent(window, "keyup", onKeyUp);

    return {
      active,
      overlaysRef,
      overlaysRect,
      overlaysRectStyle,
      overlayWrapperStyle,
      onOverlayClick,
      overlayStart,
      overlayClose,
      overlayMoveTo,
    };
  },
};
</script>

<style>
.vue-guided-overlay {
  position: absolute;
  top: 0;
  left: 0;
}
.vue-guided-overlay.vgt--active {
  z-index: 99990 !important;
}

.vgt__overlay {
  background-color: #000;
  pointer-events: auto;
}
.vgt__overlay--center {
  pointer-events: none !important;
  background-color: transparent !important;
}
</style>
