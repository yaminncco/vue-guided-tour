<template>
  <div
    ref="popoverRef"
    class="vue-guided-popover"
    :style="popoverStyle"
    v-bind="$attrs"
  >
    <div
      v-if="rect && arrow"
      :class="`vgp__arrow vgp__arrow--${currentPosition}`"
      :style="arrowStyle"
    />
    <div class="vgp__body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  nextTick,
  watch,
  defineComponent,
  toRefs,
  ExtractPropTypes,
  Ref,
  StyleValue,
} from 'vue'
import { vueGuidedPopoverProps } from '../props'
import {
  useObserver,
  useEvent,
  isPositionVertical,
  isOutView,
  getWindowCenterRect,
} from '../use'
import { Rect, Position } from '../types'

export default defineComponent({
  name: 'VueGuidedPopover',
  inheritAttrs: false,
  props: {
    ...vueGuidedPopoverProps,
  },
  setup(props) {
    const popoverRef = ref<HTMLElement | null>(null)
    const { rect, position } = toRefs(props)
    const currentPosition = ref(position.value)
    const x = ref(0)
    const y = ref(0)

    const computedRect = computed(() => {
      const center = getWindowCenterRect()
      return rect.value || center
    })

    const popoverStyle = computed(() => {
      return {
        transform: `translateX(${x.value}px) translateY(${y.value}px)`,
      }
    })

    const { arrowStyle, arrowRect, initArrowPositionCoord } = useArrow(
      props,
      x,
      y,
      popoverRef,
      currentPosition,
      computedRect
    )

    const initPopover = () => {
      if (!popoverRef.value) return
      if (!rect.value) {
        initPositionCoord()
      } else {
        adjustCurrentPosition()
        initPositionCoord()
        nextTick(() => {
          adjustPositionCoord()
          initArrowPositionCoord()
        })
      }
    }

    useObserver(popoverRef, initPopover)

    const initPositionCoord = () => {
      if (!popoverRef.value) return
      const { height: popoverHeight, width: popoverWidth } =
        popoverRef.value.getBoundingClientRect()

      const { innerWidth: w, innerHeight: h } = window

      const position = currentPosition.value
      const placement = props.placement

      const offset = props.offset + arrowRect.value.height

      let tx = w / 2 - popoverWidth / 2
      let ty = h / 2 - popoverHeight / 2

      if (rect.value) {
        switch (position) {
          case 'bottom':
            tx = rect.value.left
            ty = rect.value.height + rect.value.top + offset
            break

          case 'top':
            tx = rect.value.left
            ty = rect.value.top - popoverHeight - offset
            break

          case 'right':
            tx = rect.value.width + rect.value.left + offset
            ty = rect.value.top
            break

          case 'left':
            tx = rect.value.left - popoverWidth - offset
            ty = rect.value.top
            break
        }

        switch (placement) {
          case 'end':
            isPositionVertical(position)
              ? (tx = tx - popoverWidth + rect.value.width)
              : (ty = ty - popoverHeight + rect.value.height)
            break

          case 'center':
            isPositionVertical(position)
              ? (tx = tx - popoverWidth / 2 + rect.value.width / 2)
              : (ty = ty - popoverHeight / 2 + rect.value.height / 2)
            break
        }
      }

      x.value = tx
      y.value = ty
    }

    const adjustCurrentPosition = () => {
      if (!props.autoAdjust) return
      if (checkAvailableSpace(props.position)) {
        currentPosition.value = props.position
      } else {
        if (checkAvailableSpace(currentPosition.value)) return
        const bestPosition = getBestPosition()
        currentPosition.value = bestPosition
      }
    }

    const adjustPositionCoord = () => {
      if (!popoverRef.value || !props.autoAdjust) return
      const { innerWidth: w, innerHeight: h } = window

      const popoverRect = popoverRef.value.getBoundingClientRect()
      const isPopoverOutView = isOutView(popoverRect)

      const rect = computedRect.value

      const outOffset = arrowRect.value.height + arrowRect.value.offset
      const hTop = rect.top + outOffset
      const hBottom = rect.height + rect.top - outOffset
      const hLeft = rect.left + outOffset
      const hRight = rect.width + rect.left - outOffset

      const hIsOutView = isOutView({
        top: hBottom,
        bottom: hTop,
        left: hRight,
        right: hLeft,
      })
      const hIsOutX = hIsOutView.left || hIsOutView.right
      const hIsOutY = hIsOutView.top || hIsOutView.bottom

      if (isPositionVertical(currentPosition.value)) {
        if (isPopoverOutView.left) {
          x.value = !hIsOutX ? 0 : hRight
        } else if (isPopoverOutView.right) {
          x.value = !hIsOutX
            ? w - popoverRect.width
            : -popoverRect.width + hLeft
        }
      } else {
        if (isPopoverOutView.top) {
          y.value = !hIsOutY ? 0 : hBottom
        } else if (isPopoverOutView.bottom) {
          y.value = !hIsOutY
            ? h - popoverRect.height
            : -popoverRect.height + hTop
        }
      }
    }

    const checkAvailableSpace = (position: Position) => {
      if (!popoverRef.value) return
      const size = getSpaceSize()[position]
      const { height: popoverHeight, width: popoverWidth } =
        popoverRef.value.getBoundingClientRect()
      const popoverSize = isPositionVertical(position)
        ? popoverHeight
        : popoverWidth
      const offset = props.offset + arrowRect.value.height
      return size >= popoverSize + offset
    }

    const getSpaceSize = (): Record<Position, number> => {
      const { innerWidth: w, innerHeight: h } = window
      const rect = computedRect.value

      return {
        bottom: h - (rect.height + rect.top),
        top: rect.top,
        right: w - (rect.width + rect.left),
        left: rect.left,
      }
    }

    const getBestPosition = (): Position => {
      const positions = getSpaceSize()
      return (Object.keys(positions) as Array<keyof typeof positions>).sort(
        (a, b) => {
          if (checkAvailableSpace(a)) {
            return -1
          }
          if (checkAvailableSpace(b)) {
            return 1
          }
          return positions[b] - positions[a]
        }
      )[0]
    }

    watch(
      () => rect.value,
      () => {
        nextTick(() => {
          initPopover()
        })
      },
      { deep: true, immediate: true }
    )

    useEvent(window, 'resize', initPopover)

    return {
      rect,
      popoverRef,
      currentPosition,
      popoverStyle,
      arrowStyle,
    }
  },
})

function useArrow(
  props: ExtractPropTypes<typeof vueGuidedPopoverProps>,
  popoverX: Ref<number>,
  popoverY: Ref<number>,
  popoverRef: Ref<HTMLElement | null>,
  position: Ref<Position>,
  rect: Ref<Rect>
) {
  const x = ref(0)
  const y = ref(0)

  const size = 14
  const height = (Math.sqrt(2) * size) / 2
  const offset = 6 // border-radius

  const arrowRect = computed(() => {
    return {
      size: props.arrow ? size : 0,
      height: props.arrow ? height : 0,
      offset: props.arrow ? offset : 0,
    }
  })

  const arrowStyle = computed<StyleValue>(() => {
    return {
      width: `${arrowRect.value.size}px`,
      height: `${arrowRect.value.size}px`,
      left: isPositionVertical(position.value) ? `0px` : undefined,
      top: !isPositionVertical(position.value) ? `0px` : undefined,
      [position.value]: '100%',
      transform: `translateX(${x.value}px) translateY(${y.value}px) rotate(45deg)`,
    }
  })

  const initArrowPositionCoord = () => {
    if (!popoverRef.value || !props.arrow) return
    const { height: popoverHeight, width: popoverWidth } =
      popoverRef.value.getBoundingClientRect()
    const placement = props.placement

    const radiusOffset = arrowRect.value.offset
    const rotateOffset = (2 * arrowRect.value.height - arrowRect.value.size) / 2
    const offset = rotateOffset + radiusOffset

    let tx = 0
    let ty = 0

    if (isPositionVertical(position.value)) {
      ty =
        position.value === 'bottom'
          ? arrowRect.value.size / 2
          : -(arrowRect.value.size / 2)
    } else {
      tx =
        position.value === 'right'
          ? arrowRect.value.size / 2
          : -(arrowRect.value.size / 2)
    }
    switch (placement) {
      case 'center':
        isPositionVertical(position.value)
          ? (tx =
              rect.value.left -
              popoverX.value +
              rect.value.width / 2 -
              arrowRect.value.size / 2)
          : (ty =
              rect.value.top -
              popoverY.value +
              rect.value.height / 2 -
              arrowRect.value.size / 2)
        break
      case 'start':
        isPositionVertical(position.value)
          ? (tx = rect.value.left - popoverX.value + offset)
          : (ty = rect.value.top - popoverY.value + offset)
        break
      case 'end':
        isPositionVertical(position.value)
          ? (tx =
              rect.value.width +
              rect.value.left -
              popoverX.value -
              arrowRect.value.size -
              offset)
          : (ty =
              rect.value.height +
              rect.value.top -
              popoverY.value -
              arrowRect.value.size -
              offset)
        break
    }

    const tMin = offset
    const tMax = (length: number) =>
      length - arrowRect.value.height * 2 + offset
    const txMax = tMax(popoverWidth)
    const tyMax = tMax(popoverHeight)
    if (isPositionVertical(position.value)) {
      if (tx > txMax) {
        tx = txMax
      } else if (tx < tMin) {
        tx = tMin
      }
    } else {
      if (ty > tyMax) {
        ty = tyMax
      } else if (ty < tMin) {
        ty = tMin
      }
    }

    x.value = tx
    y.value = ty
  }

  return {
    arrowStyle,
    arrowRect,
    initArrowPositionCoord,
  }
}
</script>

<style>
.vue-guided-popover {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 250px;
  max-width: 300px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 99999 !important;
}

.vue-guided-popover,
.vgp__body,
.vgp__arrow {
  background: #fff;
}

.vue-guided-popover,
.vgp__body {
  border-radius: 6px;
}

.vgp__body {
  position: relative;
  padding: 15px;
}

.vgp__arrow {
  position: absolute;
  box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.2);
}
</style>
