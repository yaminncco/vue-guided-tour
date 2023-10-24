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
  reactive,
  computed,
  watchEffect,
  defineComponent,
  toRefs,
  ExtractPropTypes,
  Ref,
  StyleValue,
  ComputedRef,
} from 'vue'
import { vueGuidedPopoverProps } from '../props'
import {
  useObserver,
  useEvent,
  isPositionVertical,
  isOutView,
  getWindowCenterRect,
} from '../use'
import { Rect, Position, BoundingRect } from '../types'

export default defineComponent({
  name: 'VueGuidedPopover',
  inheritAttrs: false,
  props: {
    ...vueGuidedPopoverProps,
  },
  setup(props) {
    const popoverRef = ref<HTMLElement | null>(null)
    const { rect, width } = toRefs(props)
    const x = ref(0)
    const y = ref(0)

    const popoverRect: BoundingRect = reactive({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    })
    const isPositionInside = ref(false)

    const computedRect = computed(() => {
      const center = getWindowCenterRect()
      return rect.value || center
    })

    const popoverStyle = computed<StyleValue>(() => {
      return {
        'max-width':
          typeof width.value === 'string' ? width.value : `${width.value}px`,
        transform: `translateX(${popoverRect.left}px) translateY(${popoverRect.top}px)`,
      }
    })

    const currentPosition = computed(() => {
      const current = currentPosition.value as typeof props.position
      if (!rect.value || !props.autoAdjust) {
        return props.position
      }
      if (checkAvailableSpace(props.position)) {
        return props.position
      } else {
        if (checkAvailableSpace(current)) {
          return current
        }
        const bestPosition = getBestPosition()
        if (isPositionInside.value) {
          return props.position
        } else {
          return bestPosition
        }
      }
    })

    const arrowPosition = computed(() => {
      const reverse = getReversePosition(currentPosition.value)
      return isPositionInside.value ? reverse : currentPosition.value
    })

    const { arrowStyle, arrowRect } = useArrow(
      props,
      arrowPosition,
      popoverRect,
      computedRect
    )

    const updatePopover = () => {
      if (!popoverRef.value) return
      if (!rect.value) {
        initPositionCoord()
        updatePopoverRect()
      } else {
        adjustIsPositionInside()
        initPositionCoord()
        adjustPositionCoord()
        updatePopoverRect()
      }
    }

    const updatePopoverRect = () => {
      if (!popoverRef.value) return
      const { width, height } = popoverRef.value.getBoundingClientRect()

      popoverRect.top = y.value
      popoverRect.left = x.value
      popoverRect.right = width + x.value
      popoverRect.bottom = height + y.value
      popoverRect.width = width
      popoverRect.height = height
    }

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
            ty =
              rect.value.height +
              rect.value.top +
              (isPositionInside.value ? -popoverHeight - offset : offset)
            break

          case 'top':
            tx = rect.value.left
            ty =
              rect.value.top -
              popoverHeight -
              (isPositionInside.value ? -popoverHeight - offset : offset)
            break

          case 'right':
            tx =
              rect.value.width +
              rect.value.left +
              (isPositionInside.value ? -popoverWidth - offset : offset)
            ty = rect.value.top
            break

          case 'left':
            tx =
              rect.value.left -
              popoverWidth -
              (isPositionInside.value ? -popoverWidth - offset : offset)
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

    const adjustIsPositionInside = () => {
      let isAvailable = false
      if (!props.autoAdjust) {
        isAvailable = isSpaceAvailable()[props.position]
      } else {
        isAvailable = Object.values(isSpaceAvailable()).some((a) => {
          return a
        })
      }

      if (!isAvailable) {
        isPositionInside.value = true
      } else {
        isPositionInside.value = false
      }
    }

    const adjustPositionCoord = () => {
      if (!props.autoAdjust) return
      const { innerWidth: w, innerHeight: h } = window

      const _popoverRect = {
        top: y.value,
        left: x.value,
        bottom: y.value + popoverRect.height,
        right: x.value + popoverRect.width,
        width: popoverRect.width,
        height: popoverRect.height,
      }
      const isPopoverOutView = isOutView(_popoverRect)

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

      let tx
      let ty
      if (isPositionVertical(currentPosition.value)) {
        if (isPopoverOutView.left) {
          tx = !hIsOutX ? 0 : hRight
        } else if (isPopoverOutView.right) {
          tx = !hIsOutX ? w - _popoverRect.width : -_popoverRect.width + hLeft
        }
      } else {
        if (isPopoverOutView.top) {
          ty = !hIsOutY ? 0 : hBottom
        } else if (isPopoverOutView.bottom) {
          ty = !hIsOutY ? h - _popoverRect.height : -_popoverRect.height + hTop
        }
      }

      if (tx != undefined) {
        x.value = tx
      }
      if (ty != undefined) {
        y.value = ty
      }
    }

    const isSpaceAvailable = () => {
      const spaces = {}
      for (const position of ['top', 'left', 'right', 'bottom'] as Position[]) {
        Object.assign(spaces, { [position]: checkAvailableSpace(position) })
      }
      return spaces as Record<Position, boolean>
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
      const order: Position[] = ['top', 'right', 'left', 'bottom']
      return order.sort((a, b) => {
        if (checkAvailableSpace(a)) {
          return -1
        }
        if (checkAvailableSpace(b)) {
          return 1
        }
        return positions[b] - positions[a]
      })[0]
    }

    const getReversePosition = (position: Position): Position => {
      switch (position) {
        case 'top':
          return 'bottom'
        case 'bottom':
          return 'top'
        case 'left':
          return 'right'
        case 'right':
          return 'left'
      }
    }

    watchEffect(
      () => {
        updatePopover()
      },
      {
        flush: 'post',
      }
    )
    useObserver(popoverRef, updatePopoverRect)
    useEvent(window, 'resize', updatePopover)

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
  position: ComputedRef<Position>,
  popoverRect: BoundingRect,
  rect: Ref<Rect>
) {
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
    const { tx, ty } = getArrowPositionCoord()

    return {
      width: `${arrowRect.value.size}px`,
      height: `${arrowRect.value.size}px`,
      left: isPositionVertical(position.value) ? `0px` : undefined,
      top: !isPositionVertical(position.value) ? `0px` : undefined,
      [position.value]: '100%',
      transform: `translateX(${tx}px) translateY(${ty}px) rotate(45deg)`,
    }
  })

  const getArrowPositionCoord = () => {
    if (!props.arrow) return { tx: 0, ty: 0 }
    const popoverWidth = popoverRect.width
    const popoverHeight = popoverRect.height

    const placement = props.placement

    const radiusOffset = arrowRect.value.offset
    const rotateOffset = (2 * arrowRect.value.height - arrowRect.value.size) / 2
    const offset = rotateOffset + radiusOffset

    const popoverY = popoverRect.top
    const popoverX = popoverRect.left

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
              popoverX +
              rect.value.width / 2 -
              arrowRect.value.size / 2)
          : (ty =
              rect.value.top -
              popoverY +
              rect.value.height / 2 -
              arrowRect.value.size / 2)
        break
      case 'start':
        isPositionVertical(position.value)
          ? (tx = rect.value.left - popoverX + offset)
          : (ty = rect.value.top - popoverY + offset)
        break
      case 'end':
        isPositionVertical(position.value)
          ? (tx =
              rect.value.width +
              rect.value.left -
              popoverX -
              arrowRect.value.size -
              offset)
          : (ty =
              rect.value.height +
              rect.value.top -
              popoverY -
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

    return { tx, ty }
  }

  return {
    arrowStyle,
    arrowRect,
  }
}
</script>

<style>
.vue-guided-popover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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
