import { ref, reactive, computed, nextTick } from 'vue';
import { getBoundingClientRect } from './utils'

export default function useOverlayRect (props, currentStepIndex, prevStepIndex, currentStepEl, prevStepEl) {
  const overlayWrapper = reactive({
    width: 0,
    height: 0
  })
  const overlaysRef = ref([])
  const overlayRectDefault = {}
  const keys = ['top', 'left', 'bottom', 'right', 'center']
  keys.forEach(key => {
    overlayRectDefault[key] = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1
    }
  })
  const overlaysRect = reactive(overlayRectDefault)

  const active = ref(false)
  const fadeDuration = 300
  const moving = ref(false)
  const moveDuration = 450
  const moveEase = 'cubic-bezier(.65,.05,.36,1)'

  const overlayWrapperStyle = computed(() => {
    return {
      'width': `${overlayWrapper.width}px`,
      'height': `${overlayWrapper.height}px`,
      'overflow': 'hidden',
      'position': 'absolute',
      'top': '0px',
      'left': '0px',
      'opacity': active.value ? '0.65' : '0',
      'visibility': active.value ? 'visible' : 'hidden',
      'pointer-events': props.allowInteraction && 'none',
      'transition': `${fadeDuration}ms opacity, ${fadeDuration}ms visibility`
    }
  })

  const overlaysRectStyle = computed(() => {
    return (key) => {
      const overlay = overlaysRect[key]
      if (!overlay) return null
      const position = {
        position: 'absolute'
      }
      let transformOrigin = null

      if (key === 'bottom') {
        position.bottom = '0px'
        transformOrigin = 'bottom left'
      } else if (key === 'right') {
        position.right = '0px'
        transformOrigin = 'top right'
      } else {
        position.top = '0px'
        position.left = '0px'
        transformOrigin = 'top left'
      }

      return {       
        'width': `${overlay.width}px`,
        'height': `${overlay.height}px`,
        'transform': `translate3d(${overlay.x}px, ${overlay.y}px, 0) scale3d(${overlay.scaleX}, ${overlay.scaleY}, 1)`,
        ...position,
        transformOrigin
      }
    }
  })

  const getOverlayRect = (el, index) => {
    const w = overlayWrapper.width
    const h = overlayWrapper.height
    
    const size = 200
    const padding = props.steps[index].padding ? props.steps[index].padding : props.padding
    const { top, left, right, bottom, width, height } = getBoundingClientRect(el, padding)

    const topOverlay = {
      width: size,
      height: size,
      x: 0,
      y: top + window.scrollY < 0 ? -size + top + window.scrollY : 0,
      scaleX: w/size,
      scaleY: top + window.scrollY < 0 ? 1 : (top + window.scrollY)/size
    }
    const leftOverlay = {
      width: size,
      height: size,
      x: left + window.scrollX < 0 ? -size + left + window.scrollX : 0,
      y: 0,
      scaleX: left + window.scrollX < 0 ? 1 : (left + window.scrollX)/size,
      scaleY: h/size
    }
    const rightOverlay = {
      width: size,
      height: size,
      x: right + window.scrollX > w ? - (w - (right + window.scrollX)) + size : 0,
      y: 0,
      scaleX: right + window.scrollX > w ? 1 : (w - (right + window.scrollX))/size,
      scaleY: h/size
    }
    const bottomOverlay = {
      width: size,
      height: size,
      x: 0,
      y: bottom + window.scrollY > h ? - (h - (bottom + window.scrollY)) + size : 0,
      scaleX: w/size,
      scaleY: bottom + window.scrollY > h ? 1 : (h - (bottom + window.scrollY))/size
    }
    const centerOverlay = {
      width,
      height,
      x: left + window.scrollX,
      y: top + window.scrollY,
      scaleX: 1,
      scaleY: 1,
    }

    return {
      top: topOverlay,
      left: leftOverlay,
      right: rightOverlay,
      bottom: bottomOverlay,
      center: centerOverlay
    }
  }

  const updateOverlayWrapper = () => {
    const fullHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    )
    const fullWidth = Math.max(
      document.body.scrollWidth, document.documentElement.scrollWidth,
      document.body.offsetWidth, document.documentElement.offsetWidth,
      document.body.clientWidth, document.documentElement.clientWidth
    )
    overlayWrapper.width = fullWidth
    overlayWrapper.height = fullHeight
  }

  const resetOverlayWrapper = () => {
    overlayWrapper.width = 0
    overlayWrapper.height = 0
  }

  const updateOverlaysRect = () => {
    const currentOverlayRect = getOverlayRect(currentStepEl.value, currentStepIndex.value)
    for (const overlayKey in overlaysRect) {
      const overlay = overlaysRect[overlayKey]       
      overlay.width = currentOverlayRect[overlayKey].width
      overlay.height = currentOverlayRect[overlayKey].height
      overlay.x = currentOverlayRect[overlayKey].x
      overlay.y = currentOverlayRect[overlayKey].y
      overlay.scaleX = currentOverlayRect[overlayKey].scaleX
      overlay.scaleY = currentOverlayRect[overlayKey].scaleY
    }
  }

  const invertOverlaysRect = () => {
    const prevOverlayRect = getOverlayRect(prevStepEl.value, prevStepIndex.value)
    const currentOverlayRect = getOverlayRect(currentStepEl.value, currentStepIndex.value)

    for (const overlayKey in overlaysRect) {
      const overlay = overlaysRect[overlayKey]
      if (overlayKey === 'center') {
        overlay.x += (prevOverlayRect[overlayKey].x - currentOverlayRect[overlayKey].x)
        overlay.y += (prevOverlayRect[overlayKey].y - currentOverlayRect[overlayKey].y)
        overlay.scaleX = (prevOverlayRect[overlayKey].width / currentOverlayRect[overlayKey].width)
        overlay.scaleY = (prevOverlayRect[overlayKey].height / currentOverlayRect[overlayKey].height)
      } else {
        overlay.x = prevOverlayRect[overlayKey].x
        overlay.y = prevOverlayRect[overlayKey].y
        overlay.scaleX = prevOverlayRect[overlayKey].scaleX
        overlay.scaleY = prevOverlayRect[overlayKey].scaleY
      }
    }
  }

  const moveOverlaysRect = (callback = undefined) => {
    for (const overlayKey in overlaysRect) {
      overlaysRef.value[overlayKey].style.transition = `${moveDuration}ms transform ${moveEase}`
    }

    updateOverlaysRect()

    setTimeout(() => {
      for (const overlayKey in overlaysRect) {
        overlaysRef.value[overlayKey].style.transition = ``
      }
      moving.value = false
      if (callback) {
        callback()
      }
    }, moveDuration)
  }

  const overlayUpdate = () => {
    if (!active.value || moving.value) return
    resetOverlayWrapper()
    nextTick(() => {
      updateOverlayWrapper()
      updateOverlaysRect()
    })
  }

  const overlayFadeIn = (callback  = undefined) => {
    active.value = true
    overlayUpdate()
    setTimeout(() => {
      if (callback) {
        callback()
      }
    }, fadeDuration)
  }

  const overlayFadeOut = (callback = undefined) => {
    active.value = false
    setTimeout(() => {
      if (callback) {
        callback()
      }
    }, fadeDuration)
  }

  const overlayMove = (callback) => {
    moving.value = true
    resetOverlayWrapper()
    nextTick(() => {
      updateOverlayWrapper()
      updateOverlaysRect()
      invertOverlaysRect()
      setTimeout(() => {
        moveOverlaysRect(callback)
      }, 16)
    })
  }

  return {
    overlaysRef,
    overlaysRect,
    overlaysRectStyle,
    overlayWrapperStyle,
    active,
    moving,
    overlayUpdate,
    overlayFadeIn,
    overlayFadeOut,
    overlayMove,
  }
}