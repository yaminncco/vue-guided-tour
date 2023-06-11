<template>
  <div class="vue-guided-overlay" v-bind="$attrs">
    <div class="vgo__wrapper" :style="overlayWrapperStyle">
      <div
        v-for="(_, key) in overlaysTransform"
        :key="key"
        :class="`vgo__overlay vgo__overlay--${key}`"
        :style="overlaysStyle(key)"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  computed,
  nextTick,
  toRefs,
  watch,
  defineComponent,
  StyleValue,
  CSSProperties,
} from 'vue'
import { vueGuidedOverlayProps, position } from '../props'
import { useEvent, rafThrottle } from '../use'
import { Rect } from '../types'

export default defineComponent({
  name: 'VueGuidedOverlay',
  inheritAttrs: false,
  props: {
    ...vueGuidedOverlayProps,
  },
  expose: ['start', 'close', 'highlight', 'isActive', 'isHighlighted'],
  emits: ['overlay-click'],
  setup(props, { emit }) {
    const { rect, allowInteraction, allowOverlayClose, allowEscClose } =
      toRefs(props)
    const active = ref(false)
    const show = ref(false)
    const timeout = ref(false)
    const transition = ref(false)

    const defaultRect: Rect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
    }
    const currentRect: Rect = reactive({ ...defaultRect })
    const prevRect: Rect = reactive({ ...defaultRect })

    const overlayWrapper = reactive({
      width: 0,
      height: 0,
    })

    const defaultOverlayTransform = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    }

    const overlayKeys = [...position, 'center'] as const
    const overlaysTransform = reactive(
      Object.fromEntries(
        overlayKeys.map(
          (key) =>
            [key, { ...defaultOverlayTransform }] as [
              (typeof overlayKeys)[number],
              typeof defaultOverlayTransform
            ]
        )
      ) as Record<(typeof overlayKeys)[number], typeof defaultOverlayTransform>
    )

    const fadeDuration = 300
    const moveDuration = 300
    const moveEase = 'cubic-bezier(.65,.05,.36,1)'

    const isHighlighted = computed(() => {
      return !!(active.value && show.value && !timeout.value)
    })

    const overlayWrapperStyle = computed<StyleValue>(() => {
      const hasHScroll = document.body.scrollWidth > document.body.clientWidth
      return {
        width: `${overlayWrapper.width}px`,
        height: `${overlayWrapper.height}px`,
        'max-width': !hasHScroll ? '100%' : undefined,
        overflow: 'hidden',
        position: 'absolute',
        top: '0px',
        left: '0px',
        opacity: show.value ? '1' : '0',
        visibility: show.value ? 'visible' : 'hidden',
        'pointer-events': allowInteraction.value ? 'none' : undefined,
        transition: `${fadeDuration}ms opacity, ${fadeDuration}ms visibility`,
      }
    })

    const overlaysStyle = computed<
      (key: (typeof overlayKeys)[number]) => StyleValue
    >(() => {
      return (key) => {
        const overlay = overlaysTransform[key]
        const css: CSSProperties = {}
        if (key === 'bottom') {
          css.bottom = '0px'
          css.transformOrigin = 'bottom left'
        } else if (key === 'right') {
          css.right = '0px'
          css.transformOrigin = 'top right'
        } else {
          if (key === 'center') {
            css.transitionTimingFunction = transition.value
              ? moveEase
              : undefined
            css.transitionDuration = transition.value
              ? `${moveDuration}ms`
              : undefined
            css.transitionProperty = transition.value
              ? 'transform, border-width, border-radius'
              : undefined
            css.borderRadius = `calc(var(--vgo-border-radius) / ${overlay.scaleX}) / calc(var(--vgo-border-radius) / ${overlay.scaleY})`
            css.boxShadow = `0 0 0 9999px var(--vgo-background)`
            css.borderStyle = 'solid'
            css.borderColor = 'var(--vgo-border-color)'
            css.borderTopWidth = `calc(var(--vgo-border-width) / ${overlay.scaleY})`
            css.borderBottomWidth = `calc(var(--vgo-border-width) / ${overlay.scaleY})`
            css.borderLeftWidth = `calc(var(--vgo-border-width) / ${overlay.scaleX})`
            css.borderRightWidth = `calc(var(--vgo-border-width) / ${overlay.scaleX})`
          }
          css.top = '0px'
          css.left = '0px'
          css.transformOrigin = 'top left'
        }

        return {
          position: 'absolute',
          width: `${overlay.width}px`,
          height: `${overlay.height}px`,
          transform: `translate3d(${overlay.x}px, ${overlay.y}px, 0) scale3d(${overlay.scaleX}, ${overlay.scaleY}, 1)`,
          transition: transition.value
            ? `${moveDuration}ms transform ${moveEase}`
            : undefined,
          ...css,
        }
      }
    })

    const updateRect = (
      rect: Rect,
      { top = 0, left = 0, width = 0, height = 0 }
    ) => {
      rect.top = top
      rect.left = left
      rect.width = width
      rect.height = height
      rect.bottom = height + top
      rect.right = width + left
    }

    const updateOverlayWrapper = () => {
      const { innerWidth: w, innerHeight: h } = window
      overlayWrapper.width = w
      overlayWrapper.height = h
      nextTick(() => {
        const fullHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        )
        const fullWidth = Math.max(
          document.body.scrollWidth,
          document.documentElement.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.offsetWidth,
          document.body.clientWidth,
          document.documentElement.clientWidth
        )
        overlayWrapper.width = fullWidth
        overlayWrapper.height = fullHeight
      })
    }

    const resetOverlayWrapper = () => {
      overlayWrapper.width = 0
      overlayWrapper.height = 0
    }

    const getOverlaysTransform = ({
      width,
      height,
      top,
      left,
      right,
      bottom,
    }: Rect) => {
      const w = overlayWrapper.width
      const h = overlayWrapper.height
      const size = 200

      const topOverlay = {
        width: size,
        height: size,
        x: 0,
        y: top + window.scrollY < 0 ? -size + top + window.scrollY : 0,
        scaleX: w / size,
        scaleY: top + window.scrollY < 0 ? 1 : (top + window.scrollY) / size,
      }
      const leftOverlay = {
        width: size,
        height: size,
        x: left + window.scrollX < 0 ? -size + left + window.scrollX : 0,
        y: 0,
        scaleX: left + window.scrollX < 0 ? 1 : (left + window.scrollX) / size,
        scaleY: h / size,
      }
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
      }
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
        center: centerOverlay,
      }
    }

    const getOverlayCenterTransform = (rect: Rect) => {
      return getOverlaysTransform(rect).center
    }

    const updateOverlaysTransform = () => {
      const current = getOverlaysTransform(currentRect)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { center, ...overlays } = overlaysTransform
      let overlayKey: keyof typeof overlays
      for (overlayKey in overlays) {
        const overlay = overlaysTransform[overlayKey]
        overlay.width = current[overlayKey].width
        overlay.height = current[overlayKey].height
        overlay.x = current[overlayKey].x
        overlay.y = current[overlayKey].y
        overlay.scaleX = current[overlayKey].scaleX
        overlay.scaleY = current[overlayKey].scaleY
      }
    }

    const updateOverlayCenter = () => {
      const current = getOverlayCenterTransform(currentRect)
      const overlay = overlaysTransform['center']
      overlay.width = current.width
      overlay.height = current.height
      overlay.x = current.x
      overlay.y = current.y
      overlay.scaleX = current.scaleX
      overlay.scaleY = current.scaleY
    }

    const invertOverlayCenter = () => {
      const from = getOverlayCenterTransform(prevRect)
      const to = getOverlayCenterTransform(currentRect)
      const overlay = overlaysTransform['center']
      overlay.x += from.x - to.x
      overlay.y += from.y - to.y
      overlay.scaleX = from.width / to.width
      overlay.scaleY = from.height / to.height
    }

    const resetAllOverlays = () => {
      let overlayKey: keyof typeof overlaysTransform
      for (overlayKey in overlaysTransform) {
        const overlay = overlaysTransform[overlayKey]
        overlay.width = defaultOverlayTransform.width
        overlay.height = defaultOverlayTransform.height
        overlay.x = defaultOverlayTransform.x
        overlay.y = defaultOverlayTransform.y
        overlay.scaleX = defaultOverlayTransform.scaleX
        overlay.scaleY = defaultOverlayTransform.scaleY
      }
    }

    const update = () => {
      if (!isHighlighted.value) return
      updateOverlayWrapper()
      nextTick(() => {
        updateRect(currentRect, rect.value)
        updateOverlaysTransform()
        updateOverlayCenter()
      })
    }

    const start = () => {
      if (active.value) return
      active.value = true
      return new Promise<'start'>((resolve) => {
        handleEvent(rect.value).then(() => {
          resolve('start')
        })
      })
    }

    const close = () => {
      if (!isHighlighted.value) return
      return new Promise<'close'>((resolve) => {
        handleEvent().then(() => {
          active.value = false
          resolve('close')
        })
      })
    }

    const highlight = (newRect: Rect) => {
      if (!isHighlighted.value || !newRect) return
      return new Promise<'highlight'>((resolve) => {
        handleEvent(newRect, true).then(() => {
          resolve('highlight')
        })
      })
    }

    const handleEvent = (newRect?: Rect, move = false) => {
      function fadeIn() {
        return new Promise((resolve) => {
          update()
          timeout.value = true
          setTimeout(() => {
            timeout.value = false
            resolve('')
          }, fadeDuration)
        })
      }

      function fadeOut() {
        return new Promise((resolve) => {
          timeout.value = true
          setTimeout(() => {
            resetOverlayWrapper()
            resetAllOverlays()
            timeout.value = false
            resolve('')
          }, fadeDuration)
        })
      }

      function animate() {
        return new Promise((resolve) => {
          timeout.value = true
          updateOverlayWrapper()
          nextTick(() => {
            updateOverlayCenter()
            invertOverlayCenter()
            setTimeout(() => {
              transition.value = true
              updateOverlaysTransform()
              updateOverlayCenter()
              setTimeout(() => {
                transition.value = false
                timeout.value = false
                resolve('')
              }, moveDuration)
            }, 16)
          })
        })
      }

      return new Promise((resolve) => {
        let promise
        if (!newRect) {
          show.value = false
          promise = fadeOut()
        } else {
          updateRect(prevRect, currentRect)
          updateRect(currentRect, newRect)

          show.value = true
          promise = move ? animate() : fadeIn()
        }
        promise.then(() => {
          resolve('')
        })
      })
    }

    const onUpdate = rafThrottle(update)

    const onClick = () => {
      if (!allowOverlayClose.value) return
      emit('overlay-click')
      close()
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !allowEscClose.value) return
      emit('overlay-click')
      close()
    }

    watch(
      () => rect.value,
      () => {
        onUpdate()
      }
    )
    useEvent(window, 'scroll', onUpdate)
    useEvent(window, 'resize', onUpdate)
    useEvent(window, 'keyup', onKeyUp)

    return {
      isActive: computed(() => active.value),
      overlaysTransform,
      overlaysStyle,
      overlayWrapperStyle,
      isHighlighted,
      onClick,
      start,
      close,
      highlight,
    }
  },
})
</script>

<style>
.vue-guided-overlay {
  --vgo-background: var(--vgt-overlay-background, rgba(0, 0, 0, 0.65));
  --vgo-border-width: var(--vgt-overlay-border-width, none);
  --vgo-border-color: var(--vgt-overlay-border-color, transparent);
  --vgo-border-radius: var(--vgt-overlay-border-radius, none);

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99990 !important;
}
.vgo__overlay {
  box-sizing: border-box;
  pointer-events: auto;
}
.vgo__overlay--center {
  pointer-events: none !important;
  background-color: transparent !important;
}
</style>
