<template>
  <div class="vue-guided-overlay" v-bind="$attrs">
    <div class="vgo__wrapper" :style="overlayWrapperStyle">
      <div style="opacity: var(--vgo-opacity)">
        <div
          v-for="key in overlayKeys"
          :key="key"
          :class="`vgo__overlay vgo__overlay--${key}`"
          :style="overlaysStyle(key)"
          @click="onClick"
        />
      </div>
      <div :class="`vgo__hightlight`" :style="overlaysStyle('center')" />
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
import { useEvent, rafThrottle, getWindowCenterRect } from '../use'
import { Rect } from '../types'

export default defineComponent({
  name: 'VueGuidedOverlay',
  inheritAttrs: false,
  props: {
    ...vueGuidedOverlayProps,
  },
  expose: ['highlight', 'isTimeout'],
  emits: ['overlay-click'],
  setup(props, { emit }) {
    const { rect, allowInteraction } = toRefs(props)
    const timeout = ref(false)
    const transition = ref(false)

    const defaultRect = getWindowCenterRect()
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

    const moveDuration = 300
    const moveEase = 'cubic-bezier(.65,.05,.36,1)'

    const scaleSize = 200

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
        'pointer-events': allowInteraction.value ? 'none' : undefined,
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
            css.borderStyle = 'solid'
            css.borderColor = 'var(--vgo-border-color)'
            css.borderTopWidth = `calc(var(--vgo-border-width) / ${
              overlay.scaleY || 1
            })`
            css.borderBottomWidth = `calc(var(--vgo-border-width) / ${
              overlay.scaleY || 1
            })`
            css.borderLeftWidth = `calc(var(--vgo-border-width) / ${
              overlay.scaleX || 1
            })`
            css.borderRightWidth = `calc(var(--vgo-border-width) / ${
              overlay.scaleX || 1
            })`
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
        scaleX: width ? 1 : 0,
        scaleY: height ? 1 : 0,
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
      overlay.width = current.width || scaleSize
      overlay.height = current.height || scaleSize
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
      overlay.scaleX = to.width ? from.width / to.width : from.width / scaleSize
      overlay.scaleY = to.height
        ? from.height / to.height
        : from.height / scaleSize
    }

    const update = () => {
      if (timeout.value) return
      const center = getWindowCenterRect()
      updateOverlayWrapper()
      nextTick(() => {
        updateRect(currentRect, rect.value || center)
        updateOverlaysTransform()
        updateOverlayCenter()
      })
    }

    const highlight = (newRect: Rect) => {
      if (timeout.value || !newRect) return
      function animate() {
        return new Promise((resolve) => {
          timeout.value = true
          nextTick(() => {
            updateOverlayCenter()
            invertOverlayCenter()
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                transition.value = true
                updateOverlaysTransform()
                updateOverlayCenter()
                setTimeout(() => {
                  transition.value = false
                  timeout.value = false
                  resolve('')
                }, moveDuration)
              })
            })
          })
        })
      }

      return new Promise<'highlight'>((resolve) => {
        updateOverlayWrapper()
        nextTick(() => {
          updateOverlaysTransform()
          updateRect(prevRect, currentRect)
          updateRect(currentRect, newRect)
        })
        animate().then(() => {
          resolve('highlight')
        })
      })
    }

    const onUpdate = rafThrottle(update)

    const onClick = () => {
      emit('overlay-click')
    }

    watch(
      rect,
      () => {
        onUpdate()
      },
      {
        immediate: true,
      }
    )
    useEvent(window, 'scroll', onUpdate)
    useEvent(window, 'resize', onUpdate)

    return {
      overlayKeys: computed(() => overlayKeys.filter((key) => key != 'center')),
      overlaysStyle,
      overlayWrapperStyle,
      overlaysTransform,
      isTimeout: computed(() => timeout.value),
      onClick,
      highlight,
    }
  },
})
</script>

<style>
.vue-guided-overlay {
  --vgo-background: var(--vgt-overlay-background, #000);
  --vgo-opacity: var(--vgt-overlay-opacity, 0.65);
  --vgo-border-width: var(--vgt-overlay-border-width, 0px);
  --vgo-border-color: var(--vgt-overlay-border-color, #ccc);

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99990 !important;
}
.vgo__overlay {
  box-sizing: border-box;
  pointer-events: auto;
  background-color: var(--vgo-background);
}
.vgo__hightlight {
  box-sizing: border-box;
}
</style>
