<template>
  <div
    ref="popoverRef"
    role="dialog"
    class="vue-guided-popover"
    :style="popoverStyle"
    v-bind="$attrs.attrs"
  >
    <div
      v-if="arrow"
      :class="`vgt__arrow vgt__arrow--${currentPosition}`"
      :style="arrowStyle"
    />
    <slot name="close" />
    <slot />
    <slot name="nav" />
  </div>
</template>

<script>
import { ref, computed, nextTick, watch, toRefs } from "vue";
import { isPositionVertical, isOutView } from "../use/utils";
import { popoverProps } from "../propsValidation";
import useObserver from "../use/useObserver";

export default {
  name: "VueGuidedPopover",
  inheritAttrs: false,
  props: {
    ...popoverProps,
  },
  setup(props) {
    const popoverRef = ref(null);
    const { rect, position } = toRefs(props);
    const currentPosition = ref(position.value);
    const x = ref(0);
    const y = ref(0);

    const popoverStyle = computed(() => {
      return {
        transform: `translateX(${x.value}px) translateY(${y.value}px)`,
      };
    });

    const { arrowStyle, arrowRect, initArrowPositionCoord } = useArrow(
      props,
      x,
      y,
      popoverRef,
      currentPosition,
      rect
    );

    watch(
      () => rect.value,
      () => {
        nextTick(() => {
          initPopover();
        })
      },
      { deep: true, immediate: true }
    );
  
    const initPopover = () => {
      if (!popoverRef.value) return;
      adjustCurrentPosition();
      initPositionCoord();
      nextTick(() => {
        adjustPositionCoord();
        initArrowPositionCoord();
      });
    };

    useObserver(popoverRef, initPopover);

    const initPositionCoord = () => {
      const { height: popoverHeight, width: popoverWidth } =
        popoverRef.value.getBoundingClientRect();

      const offset = props.offset;
      const arrowSize = arrowRect.value.size;
      const position = currentPosition.value;
      const placement = props.placement;

      let tx = 0;
      let ty = 0;

      switch (position) {
        case "bottom":
          tx = rect.value.left;
          ty = (rect.value.height + rect.value.top) + offset + arrowSize / 2;
          break;

        case "top":
          tx = rect.value.left;
          ty = rect.value.top - popoverHeight - offset - arrowSize / 2;
          break;

        case "right":
          tx = (rect.value.width + rect.value.left) + offset + arrowSize / 2;
          ty = rect.value.top;
          break;

        case "left":
          tx = rect.value.left - popoverWidth - offset - arrowSize / 2;
          ty = rect.value.top;
          break;
      }

      switch (placement) {
        case "end":
          isPositionVertical(position)
            ? (tx = tx - popoverWidth + rect.value.width)
            : (ty = ty - popoverHeight + rect.value.height);
          break;

        case "center":
          isPositionVertical(position)
            ? (tx = tx - popoverWidth / 2 + rect.value.width / 2)
            : (ty = ty - popoverHeight / 2 + rect.value.height / 2);
          break;
      }

      x.value = tx;
      y.value = ty;
    };

    const adjustCurrentPosition = () => {
      if (!props.autoAdjust) return;
      if (checkAvailableSpace(props.position)) {
        currentPosition.value = props.position;
      } else {
        if (checkAvailableSpace(currentPosition.value)) return;
        const bestPosition = getBestPosition();
        currentPosition.value = bestPosition;
      }
    };

    const adjustPositionCoord = () => {
      if (!props.autoAdjust) return;
      const { innerWidth: w, innerHeight: h } = window;

      const popoverRect = popoverRef.value.getBoundingClientRect();
      const isPopoverOutView = isOutView(popoverRect);
      const arrowSize = arrowRect.value.size;
      const arrowOffset = arrowRect.value.offset;

      const outOffset = arrowSize + arrowOffset * 2;
      const hTop = rect.value.top + outOffset;
      const hBottom = (rect.value.height + rect.value.top) - outOffset;
      const hLeft = rect.value.left + outOffset;
      const hRight = (rect.value.width + rect.value.left) - outOffset;

      const hIsOutView = isOutView({
        top: hBottom,
        bottom: hTop,
        left: hRight,
        right: hLeft,
      });
      const hIsOutX = hIsOutView.left || hIsOutView.right;
      const hIsOutY = hIsOutView.top || hIsOutView.bottom;

      if (isPositionVertical(currentPosition.value)) {
        if (isPopoverOutView.left) {
          x.value = !hIsOutX ? 0 : hRight;
        } else if (isPopoverOutView.right) {
          x.value = !hIsOutX
            ? w - popoverRect.width
            : -popoverRect.width + hLeft;
        }
      } else {
        if (isPopoverOutView.top) {
          y.value = !hIsOutY ? 0 : hBottom;
        } else if (isPopoverOutView.bottom) {
          y.value = !hIsOutY
            ? h - popoverRect.height
            : -popoverRect.height + hTop;
        }
      }
    };

    const checkAvailableSpace = (position) => {
      const size = getSpaceSize()[position];
      const { height: popoverHeight, width: popoverWidth } =
        popoverRef.value.getBoundingClientRect();
      const popoverSize = isPositionVertical(position)
        ? popoverHeight
        : popoverWidth;
      const offset = props.offset;
      const arrowSize = arrowRect.value.size;

      return size >= popoverSize + arrowSize / 2 + offset;
    };

    const getSpaceSize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      return {
        bottom: h - (rect.value.height + rect.value.top),
        top: rect.value.top,
        right: w - (rect.value.width + rect.value.left),
        left: rect.value.left,
      };
    };

    const getBestPosition = () => {
      const positions = getSpaceSize();
      return Object.keys(positions).sort((a, b) => {
        if (checkAvailableSpace(a)) {
          return -1;
        }
        if (checkAvailableSpace(b)) {
          return 1;
        }
        return positions[b] - positions[a];
      })[0];
    };

    return {
      rect,
      popoverRef,
      currentPosition,
      popoverStyle,
      arrowStyle,
    };
  },
};

function useArrow(props, popoverX, popoverY, popoverRef, position, rect) {
  const x = ref(0);
  const y = ref(0);

  const arrowRect = computed(() => {
    return {
      size: props.arrow ? 20 : 0,
      offset: props.arrow ? 6 : 0,
    };
  });

  const arrowStyle = computed(() => {
    return {
      borderWidth: `${arrowRect.value.size / 2}px`,
      left: isPositionVertical(position.value) ? `0px` : null,
      top: !isPositionVertical(position.value) ? `0px` : null,
      [position.value]: "100%",
      transform: `translateX(${x.value}px) translateY(${y.value}px)`,
    };
  });

  const initArrowPositionCoord = () => {
    if (!props.arrow) return;
    const { height: popoverHeight, width: popoverWidth } =
      popoverRef.value.getBoundingClientRect();

    const placement = props.placement;
    const arrowSize = arrowRect.value.size;
    const arrowOffset = arrowRect.value.offset;

    let tx = 0;
    let ty = 0;

    switch (placement) {
      case "center":
        isPositionVertical(position.value)
          ? (tx =
              rect.value.left -
              popoverX.value +
              rect.value.width / 2 -
              arrowSize / 2)
          : (ty =
              rect.value.top -
              popoverY.value +
              rect.value.height / 2 -
              arrowSize / 2);
        break;
      case "start":
        isPositionVertical(position.value)
          ? (tx = rect.value.left - popoverX.value + arrowOffset)
          : (ty = rect.value.top - popoverY.value + arrowOffset);
        break;
      case "end":
        isPositionVertical(position.value)
          ? (tx = (rect.value.width + rect.value.left) - popoverX.value - arrowSize - arrowOffset)
          : (ty = (rect.value.height + rect.value.top) - popoverY.value - arrowSize - arrowOffset);
        break;
    }

    if (isPositionVertical(position.value)) {
      if (tx >= popoverWidth - arrowSize - arrowOffset) {
        tx = popoverWidth - arrowSize - arrowOffset;
      } else if (tx <= arrowOffset) {
        tx = arrowOffset;
      }
    } else {
      if (ty >= popoverHeight - arrowSize - arrowOffset) {
        ty = popoverHeight - arrowSize - arrowOffset;
      } else if (ty <= arrowOffset) {
        ty = arrowOffset;
      }
    }

    x.value = tx;
    y.value = ty;
  };

  return {
    arrowStyle,
    arrowRect,
    initArrowPositionCoord,
  };
}
</script>

<style>
.vue-guided-popover {
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  margin: 0;
  padding: 15px;
  min-width: 250px;
  max-width: 300px;
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}
.vgt__arrow {
  position: absolute;
  width: 0;
  height: 0;
  color: #fff;
  border-style: solid;
}
.vgt__arrow--bottom {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
.vgt__arrow--top {
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
}
.vgt__arrow--left {
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-right-color: transparent;
}
.vgt__arrow--right {
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
}
</style>
