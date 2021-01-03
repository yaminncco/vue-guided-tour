import { ref, reactive, computed } from 'vue';
import { getBoundingClientRect } from './utils'

export default function useOverlayRect (props, currentStepIndex, prevStepIndex, currentStepEl, prevStepEl) {
  const overlayRefs = ref([])
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
  const overlayRect = reactive(overlayRectDefault)
 
  const active = ref(false)
  const fadeDuration = 300
  
  const moving = ref(null)
  const moveDuration = 450
  const moveEase = 'cubic-bezier(.65,.05,.36,1)'
 
  const overlayClass = computed(() => {
    return active.value ? 'vgt__overlay--visible' : 'vgt__overlay--hidden'
  })
  
  const overlayStyle = computed(() => {
    return {
      'transition': `${fadeDuration}ms opacity, ${fadeDuration}ms visibility`
    }
  })

  const overlayRectClass = computed(() => {
    return (key) => [
      `vgt__overlay vgt__overlay--${key}`
    ]
  })

  const overlayRectStyle = computed(() => {
    return (key) => {
      const overlay = overlayRect[key]
      if (!overlay) return null
      const { innerWidth: w, innerHeight: h } = window

      const position = {
        position: 'absolute'
      }
      let transformOrigin = null

      if (key === 'bottom') {
        position.bottom = `${-h}px`
        transformOrigin = 'bottom left'
      } else if (key === 'right') {
        position.right = `${-w}px`
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
    const { innerWidth: w, innerHeight: h } = window
    
    const size = 200
    const padding = props.steps[index].padding ? props.steps[index].padding : props.padding
    const { top, left, right, bottom, width, height } = getBoundingClientRect(el, padding)

    const topOverlay = {
      width: size,
      height: size,
      x: 0,
      y: top < 0 ? -size + top : 0,
      scaleX: w/size,
      scaleY: top < 0 ? 1 : top/size
    }
    const leftOverlay = {
      width: size,
      height: size,
      x: left < 0 ? -size + left : 0,
      y: 0,
      scaleX: left < 0 ? 1 : left/size,
      scaleY: h/size
    }
    const rightOverlay = {
      width: size,
      height: size,
      x: right > w ? - (w - right) + size : 0,
      y: 0,
      scaleX: right > w ? 1 : (w - right)/size,
      scaleY: h/size
    }
    const bottomOverlay = {
      width: size,
      height: size,
      x: 0,
      y: bottom > h ? - (h - bottom) + size : 0,
      scaleX: w/size,
      scaleY: bottom > h ? 1 : (h - bottom)/size
    }
    const centerOverlay = {
      width,
      height,
      x: left,
      y: top,
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

  const updateOverlayRect = () => {
    if (!active.value || moving.value) return
    const currentOverlayRect = getOverlayRect(currentStepEl.value, currentStepIndex.value)
    for (const overlayKey in overlayRect) {
      const overlay = overlayRect[overlayKey]       
      overlay.width = currentOverlayRect[overlayKey].width
      overlay.height = currentOverlayRect[overlayKey].height
      overlay.x = currentOverlayRect[overlayKey].x
      overlay.y = currentOverlayRect[overlayKey].y
      overlay.scaleX = currentOverlayRect[overlayKey].scaleX
      overlay.scaleY = currentOverlayRect[overlayKey].scaleY
    }
  }

  const invertOverlayRect = () => {
    const prev = prevStepEl.value
    const prevOverlayRect = getOverlayRect(prev, prevStepIndex.value)
    const currentOverlayRect = getOverlayRect(currentStepEl.value, currentStepIndex.value)

    for (const overlayKey in overlayRect) {
      const overlay = overlayRect[overlayKey]
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

  const moveOverlayRect = (callback = undefined) => {
    for (const overlayKey in overlayRect) {
      overlayRefs.value[overlayKey].style.transition = `${moveDuration}ms transform ${moveEase}`
    }

    updateOverlayRect()

    moving.value =  setTimeout(() => {
      for (const overlayKey in overlayRect) {
        overlayRefs.value[overlayKey].style.transition = ``
      }
      moving.value = null
      if (callback) {
        callback()
      }
    }, moveDuration)
  }

  const overlayFadeIn = (callback  = undefined) => {
    active.value = true
    updateOverlayRect()
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
    updateOverlayRect()
    invertOverlayRect()
    requestAnimationFrame(() => {
      moveOverlayRect(callback)
    })
  }

  return {
    active,
    moving,
    overlayClass,
    overlayStyle,
    overlayRefs,
    overlayRect,
    overlayRectClass,
    overlayRectStyle,
    updateOverlayRect,
    overlayFadeIn,
    overlayFadeOut,
    overlayMove,
  }
}