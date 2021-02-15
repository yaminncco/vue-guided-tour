<template>
  <teleport to="body">
    <div
      ref="vgtRef"
      class="vue-guided-tour"
      :class="active && 'vgt--active'"
    >
      <div
        class="vgt__overlay-wrapper"
        :style="overlayWrapperStyle"
      >
        <div
          v-for="(overlay, key) in overlaysRect"
          :key="key"
          :ref="el => { if (el) overlaysRef[key] = el }"
          :class="`vgt__overlay vgt__overlay--${key}`"
          :style="overlaysRectStyle(key)"
          @click="onOverlayClick"
        />
      </div>
      <vgt-popover
        v-if="showPopover && (currentStep.title || currentStep.content || $slots.content)"
        v-model:update-popover="updatePopover"
        :overlays-ref="overlaysRef"
        :arrow="arrow"
        :offset="offset"
        :position="position"
        :placement="placement"
        :auto-adjust="autoAdjust"
        v-bind="{...currentStep.popover}"
      >
        <slot
          v-if="closeBtn"
          name="close"
        >
          <button
            class="vgt__close vgt__btn--secondary"
            aria-label="close"
            @click="onCloseClick"
          >
            ×
          </button>
        </slot>
        <slot
          name="content"
          v-bind="{ stepIndex: currentStepIndex }"
        >
          <div class="vgt__content">
            <h3
              v-if="currentStep.title"
              class="vgt__title"
            >
              {{ currentStep.title }}
            </h3>
            <div v-if="currentStep.content">
              {{ currentStep.content }}
            </div>
          </div>
        </slot>
        <div class="vgt__footer">
          <div
            v-if="pagination"
            class="vgt__pages"
          >
            {{ currentStepIndex+1 }} / {{ steps.length }}
          </div>
          <slot
            name="nav"
            v-bind="{ isFirstStep, isLastStep }"
          >
            <div class="vgt__nav">
              <button
                v-if="!isFirstStep"
                class="vgt__btn vgt__btn--secondary vgt__btn--prev"
                @click="onPrev"
              >
                Prev
              </button>
              <button
                v-if="isLastStep"
                class="vgt__btn vgt__btn--primary"
                @click="onEnd"
              >
                End
              </button>
              <button
                v-else
                class="vgt__btn vgt__btn--primary vgt__btn--next"
                @click="onNext"
              >
                Next
              </button>
            </div>
          </slot>
        </div>
      </vgt-popover>
    </div>
  </teleport>
</template>

<script>
import VueGuidedTourPopover from './vueGuidedTourPopover.vue'
import { ref, computed, onMounted, onUnmounted, onBeforeUpdate, inject, nextTick } from 'vue'
import useOverlayRect from '../useOverlayRect'
import { isInView } from '../utils'

export default {
  name: 'VueGuidedTour',
  components: {
    'vgt-popover': VueGuidedTourPopover
  },
  props: {
    steps: {
      type: Array,
      required: true
    },
    stepIndex: {
      type: Number,
      default: -1
    },
    padding: {
      type: Number,
      default: 0
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
    pagination: {
      type: Boolean,
      default: true
    },
    closeBtn: {
      type: Boolean,
      default: true
    },
    allowOverlayClose: {
      type: Boolean,
      default: true
    },
    allowKeyboardEvent: {
      type: Boolean,
      default: true
    },
    allowEscClose: {
      type: Boolean,
      default: true
    },
    allowInteraction: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:stepIndex', 'afterStart', 'afterEnd', 'afterMove'],
  setup(props, { emit }) {
    const vgtRef = ref(null)
    const showPopover = ref(false)
    const updatePopover = ref(false)
    const currentStepIndex = ref(props.stepIndex)
    const currentStepEl = ref(null)
    const prevIndex = ref(null)
    const prevEl = ref(null)
    let timeout = null
    let preventScroll = false
    
    const $vgt = inject('$vgt')
    
    const currentStep = computed(() => {
      return props.steps[currentStepIndex.value]
    })
    const isFirstStep = computed(() => {
      return currentStepIndex.value === 0
    })
    const isLastStep = computed(() => {
      return currentStepIndex.value === props.steps.length-1
    })
  
    const {
      active,
      moving,
      overlaysRef,
      overlaysRect,
      overlaysRectStyle,
      overlayWrapperStyle,
      overlayUpdate,
      overlayFadeIn,
      overlayFadeOut,
      overlayMove
    } = useOverlayRect(props, currentStepIndex, prevIndex, currentStepEl, prevEl)

    const {
      getHighlightEl,
      addHighlight,
      removeHighlight
    } = useHightlight()
  
    onBeforeUpdate(() => {
      overlaysRef.value = []
    })
    onMounted(() => {
      $vgt.start = onStart
      $vgt.next = onNext
      $vgt.prev = onPrev
      $vgt.end = onEnd
      $vgt.move = onMove
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      window.addEventListener('resize', onResize)
      window.addEventListener('scroll', onScroll)
    })
    onUnmounted(() => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    })
    
    const onStart = (index = 0) => {
      if (active.value) return
      handleStepIndexChange(index)
    }

    const onNext = () => {
      if (!active.value || moving.value) return
      const index = currentStepIndex.value + 1
      if (index > props.steps.length-1) return
      handleStepIndexChange(index)
    }

    const onPrev = () => {
      if (!active.value || moving.value) return
      const index = currentStepIndex.value - 1
      if (index < 0) return
      handleStepIndexChange(index)
    }
  
    const onEnd = () => {
      if (!active.value || moving.value) return
      const index = -1
      handleStepIndexChange(index)
    }

    const onMove = (index = 0) => {
      if (index === currentStepIndex.value || !active.value || moving.value) return
      handleStepIndexChange(index)
    }

    const onUpdate = () => {
      if (!active.value || moving.value) return
      overlayUpdate()
      nextTick(() => {
        updatePopover.value = true
      })
    }

    const handleStepIndexChange = (index) => {
      const el = getHighlightEl(index, props.steps)
      if (!el && index !== -1) return
      showPopover.value = false
      removeHighlight()
      
      updateCurrentStep(index, el)
      
      if (index === -1) {
        overlayFadeOut(() => {
          emit('afterEnd')
        })
        return
      }

      if (!isInView(el.getBoundingClientRect())) {
        preventScroll = true
        el.scrollIntoView({
          block: 'center',
        })
      }

      const done = () => {
        preventScroll = false
        addHighlight(el)
        showPopover.value = true
        nextTick(() => {
          const focusableEls = getFocusableElements()
          if (focusableEls.length > 0) {
            const firstFocusableEl = focusableEls[0]
            firstFocusableEl.focus()
          }
        })
        emit(!prevEl.value ? 'afterStart' : 'afterMove')
      }
      !prevEl.value ? overlayFadeIn(done) : overlayMove(done)
    }

    const updateCurrentStep = (index, el) => {
      prevIndex.value = currentStepIndex.value
      currentStepIndex.value = index
      emit('update:stepIndex', currentStepIndex.value)
      
      if (index === -1) {
        prevEl.value = null
        currentStepEl.value = null
      } else {
        prevEl.value = currentStepEl.value
        currentStepEl.value = el
      }
    }

    const onKeyUp = (event) => {
      if (!active.value || !props.allowKeyboardEvent) return
      switch (event.key) {
      case 'Escape':
        if (props.allowEscClose) {
          onEnd()
        }
        break
      case 'ArrowLeft':
        onPrev()
        break
      case 'ArrowRight':
        onNext()
        break
      }
    }

    const onKeyDown = (event) => {
      if (!active.value) return
      const focusableEls = getFocusableElements()
      switch (event.key) {
      case 'Tab':
        if (focusableEls.length === 0)  {
          event.preventDefault()
        } else {
          const firstFocusableEl = focusableEls[0]
          const lastFocusableEl = focusableEls[focusableEls.length - 1]
          if (event.shiftKey) {
            if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus()
              event.preventDefault()
            }
          } else {
            if (document.activeElement === lastFocusableEl) {
              firstFocusableEl.focus()
              event.preventDefault()
            }
          }
        }
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        if (props.allowKeyboardEvent) {
          event.preventDefault()
        }
        break
      }
    }

    const onOverlayClick = () => {
      if (!props.allowOverlayClose) return
      onEnd()
    }

    const onCloseClick = () => {
      onEnd()
    }

    const onResize = () => {
      if (timeout) {
        window.cancelAnimationFrame(timeout)
      }
      timeout = window.requestAnimationFrame(onUpdate)
    }

    const onScroll = () => {
      if (preventScroll) return
      if (timeout) {
        window.cancelAnimationFrame(timeout)
      }
      timeout = window.requestAnimationFrame(onUpdate)
    }

    const getFocusableElements = () => {
      const selector = `button, [href], input, select, textarea, [tabindex]`
      const focusableEls = [...vgtRef.value.querySelectorAll(selector)].filter((el) => {
        if (parseInt(el.getAttribute('tabindex'), 10) < 0) {
          return false
        }
        if (el.disabled) {
          return false
        }
        while (el) {
          if (
            getComputedStyle(el).display === 'none' ||
            getComputedStyle(el).visibility  === 'hidden'
          ) {
            return false
          }
          el = el.parentElement
        }
        return true
      })
      return focusableEls
    }

    return {
      vgtRef,
      showPopover,
      updatePopover,
      currentStepIndex,
      currentStep,
      isFirstStep,
      isLastStep,
      active,
      overlaysRef,
      overlaysRect,
      overlaysRectStyle,
      overlayWrapperStyle,
      onStart,
      onNext,
      onPrev,
      onEnd,
      onMove,
      onKeyUp,
      onOverlayClick,
      onCloseClick,
      onUpdate
    }
  },
}

function useHightlight () {
  const highlightClass = 'vgt__target--highlighted'

  const getHighlightEl = (index, steps) => {
    if (typeof index !== 'number' || index < 0 || index > steps.length-1) return
    const targetValue = steps[index].target
    const el = document.querySelector(`${targetValue}`)
    if (!targetValue) {
      console.warn(`[vue-guided-tour] : Target is required in step ${index}`)
      return undefined
    } else if (!el) {
      console.warn(`[vue-guided-tour] : Target to highlight "${targetValue}" not found`)
      return undefined
    }
    return el
  }

  const addHighlight = (el) => {
    el.classList.add(highlightClass)
  }

  const removeHighlight = () => {
    const allTargets = document.querySelectorAll(`.${highlightClass}`)
    allTargets.forEach(target => {
      target.classList.remove(highlightClass)
    })
  }

  return {
    getHighlightEl,
    addHighlight,
    removeHighlight
  }
}
</script>

<style>
.vue-guided-tour {
  position: absolute;
  top: 0;
  left: 0;
}
.vgt--active {
  z-index: 99999 !important;
}

.vgt__overlay {
  background-color: #000;
  pointer-events: auto;
}
.vgt__overlay--center {
  pointer-events: none !important;
  background-color: transparent !important;
}

/*
.vgt__target--highlighted {
}
*/

.vgt__title {
  font-size: 24px;
}
.vgt__content {
  margin-top: 30px;
  margin-bottom: 20px;
}
.vgt__footer {
  display: flex;
  align-items: center;
}
.vgt__pages {
  font-size: 12px;
  font-weight: 700;
  color: #969faf;
}
.vgt__nav {
  margin-left: auto;
}
.vgt__btn {
  padding: 10px 15px;
  height: auto;
  width: auto;
  border: none;
  border-radius: 4px;
  display: inline-block;
  font-family: sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}
.vgt__btn--primary {
  background: #41b883;
  color: #fff;
}
.vgt__btn--secondary {
  background: none;
  color: #969faf;
}

.vgt__btn--prev {
  margin-right: 7px;
}
/*
.vgt__btn--next {}
*/

.vgt__close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 700;
  height: 36px;
  line-height: 36px;
  width: 36px;
  padding: 0;
}
</style>