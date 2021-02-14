<template>
  <div
    ref="popoverRef"
    role="dialog"
    class="vgt__popover"
    :style="popoverStyle"
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { getBoundingClientRect, isPositionVertical, isOutView } from '../utils'

export default {
  name: 'VueGuidedTourPopover',
  inheritAttrs: false,
  props: {
    overlaysRef: {
      type: Array,
      required: true
    },
    updatePopover: {
      type: Boolean,
      default: false
    },
    arrow: {
      type: Boolean,
      default: true
    },
    offset: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      default: 'bottom',
      validator: function (value) {
        return ['top', 'left', 'right', 'bottom'].indexOf(value) !== -1
      }
    },
    placement: {
      type: String,
      default: 'start',
      validator: function (value) {
        return ['start', 'center', 'end'].indexOf(value) !== -1
      }
    },
    autoAdjust: {
      type: Boolean,
      default: true
    },
  },
  emits: ['update:updatePopover'],
  setup(props, { emit }) {
    const popoverRef = ref(null)
    const currentPosition = ref(props.position)

    const x = ref(0)
    const y = ref(0)

    const highlightRect = computed(() => {
      const { top, left, bottom, right, width, height } = props.overlaysRef['center'].getBoundingClientRect()
      return {
        width,
        height,
        top,
        left,
        bottom,
        right
      }
    })

    const popoverStyle = computed(() => {
      return {
        transform: `translateX(${x.value}px) translateY(${y.value}px)`
      }
    })

    const { arrowStyle, arrowRect, initArrowPositionCoord } = useArrow(props, x, y, popoverRef, currentPosition, highlightRect)

    onMounted(() => {
      initPopover()
    })

    watch(() => props.updatePopover, () => {
      if (props.updatePopover) {
        initPopover()
      }
    })

    const initPopover = () => {
      adjustCurrentPosition()
      initPositionCoord()
      nextTick(() => {
        adjustPositionCoord()
        initArrowPositionCoord()
        emit('update:updatePopover', false)
      })
    }

    const initPositionCoord = () => {
      const { height: popoverHeight, width: popoverWidth } = popoverRef.value.getBoundingClientRect()

      const offset = props.offset
      const arrowSize = arrowRect.value.size
      const position = currentPosition.value
      const placement = props.placement

      let tx = 0
      let ty = 0
     
      switch (position) {
        case 'bottom':
          tx = highlightRect.value.left
          ty = highlightRect.value.bottom + offset + arrowSize/2
          break
          
        case 'top':
          tx = highlightRect.value.left
          ty = highlightRect.value.top - popoverHeight - offset - arrowSize/2
          break

        case 'right':
          tx = highlightRect.value.right + offset + arrowSize/2
          ty = highlightRect.value.top
          break

        case 'left':
          tx = highlightRect.value.left - popoverWidth - offset - arrowSize/2
          ty = highlightRect.value.top
          break
      }

      switch (placement) {
        case 'end':
          isPositionVertical(position) ?
          tx = tx - popoverWidth + highlightRect.value.width :
          ty = ty - popoverHeight + highlightRect.value.height
          break
        
        case 'center':
          isPositionVertical(position) ?
          tx = tx - popoverWidth/2 + highlightRect.value.width/2 :
          ty = ty - popoverHeight/2 + highlightRect.value.height/2
          break
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
      if (!props.autoAdjust) return
      const { innerWidth: w, innerHeight: h } = window

      const { height, width, ...popoverRect } = getBoundingClientRect(popoverRef.value)
      const isPopoverOutView = isOutView(popoverRect)
      const arrowSize = arrowRect.value.size
      const arrowOffset = arrowRect.value.offset
      
      const outOffset = arrowSize + arrowOffset*2
      const hTop = highlightRect.value.top + outOffset
      const hBottom = highlightRect.value.bottom - outOffset
      const hLeft = highlightRect.value.left + outOffset
      const hRight = highlightRect.value.right - outOffset

      const hIsOutView = isOutView({top: hBottom, bottom: hTop, left: hRight, right: hLeft})
      const hIsOutX = hIsOutView.left || hIsOutView.right
      const hIsOutY = hIsOutView.top || hIsOutView.bottom
      
      if ( isPositionVertical(currentPosition.value) ) {
        if (isPopoverOutView.left) {
          x.value = !hIsOutX ? 0 : hRight
        } else if (isPopoverOutView.right) {
          x.value = !hIsOutX ? w - width : - width + hLeft
        }
      } else {
        if (isPopoverOutView.top) {
          y.value = !hIsOutY ? 0 : hBottom
        } else if (isPopoverOutView.bottom) {
          y.value = !hIsOutY ? h - height : - height + hTop
        }
      }
    }

    const checkAvailableSpace = (position) => {
      const size = getSpaceSize()[position]
      const { height: popoverHeight, width: popoverWidth } = getBoundingClientRect(popoverRef.value)
      const popoverSize = isPositionVertical(position) ? popoverHeight : popoverWidth
      const offset = props.offset
      const arrowSize = arrowRect.value.size
      
      return size >= popoverSize + arrowSize/2 + offset
    }

    const getSpaceSize = () => {
      const { innerWidth: w, innerHeight: h } = window
      const { top, left, bottom, right } = props.overlaysRef['center'].getBoundingClientRect()
      return {
        bottom: h - bottom,
        top: top,
        right: w - right,
        left: left,
      }
    }

    const getBestPosition = () => {
      const positions = getSpaceSize()
      return Object.keys(positions).sort((a, b) => {
        if (checkAvailableSpace(a)) {
          return -1
        }
        if (checkAvailableSpace(b)) {
          return 1
        }
        return positions[b] - positions[a]
      })[0]
    }

    return {
      popoverRef,
      currentPosition,
      popoverStyle,
      arrowStyle
    }
  }
}

function useArrow (props, popoverX, popoverY, popoverRef, position, highlightRect) {
  const x = ref(0)
  const y = ref(0)
  
  const arrowRect = computed(() => {
    return {
      size: props.arrow ? 20 : 0,
      offset: props.arrow ? 6 : 0
    }
  })

  const arrowStyle = computed(() => {   
    return {
      borderWidth: `${arrowRect.value.size/2}px`,
      left: isPositionVertical(position.value) ? `0px` : null,
      top: !isPositionVertical(position.value) ? `0px` : null,
      [position.value]: '100%',
      transform: `translateX(${x.value}px) translateY(${y.value}px)`
    }
  })
  
  const initArrowPositionCoord = () => {
    if (!props.arrow) return
    const { height: popoverHeight, width: popoverWidth } = getBoundingClientRect(popoverRef.value)

    const placement = props.placement
    const arrowSize = arrowRect.value.size
    const arrowOffset = arrowRect.value.offset

    let tx = 0
    let ty = 0

    switch (placement) {
      case 'center':
        isPositionVertical(position.value) ?
          tx = highlightRect.value.left - popoverX.value + highlightRect.value.width/2 - arrowSize/2 :
          ty = highlightRect.value.top - popoverY.value + highlightRect.value.height/2 - arrowSize/2
        break
      case 'start':
        isPositionVertical(position.value) ?
          tx = highlightRect.value.left - popoverX.value + arrowOffset :
          ty = highlightRect.value.top - popoverY.value + arrowOffset
        break
      case 'end':
        isPositionVertical(position.value) ?
          tx = highlightRect.value.right - popoverX.value - arrowSize - arrowOffset :
          ty = highlightRect.value.bottom - popoverY.value - arrowSize - arrowOffset
        break
    }

    if (isPositionVertical(position.value)) {
      if (tx >= popoverWidth - arrowSize - arrowOffset) {
        tx = popoverWidth - arrowSize - arrowOffset
      } else if (tx <= arrowOffset) {
        tx = arrowOffset
      }
    } else {
      if (ty >= popoverHeight - arrowSize - arrowOffset) {
        ty = popoverHeight - arrowSize - arrowOffset
      } else if (ty <= arrowOffset) {
        ty = arrowOffset
      }
    }

    x.value = tx
    y.value = ty
  }
 
  return {
    arrowStyle,
    arrowRect,
    initArrowPositionCoord
  }
}
</script>

<style>
.vgt__popover {
  position: fixed;
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
