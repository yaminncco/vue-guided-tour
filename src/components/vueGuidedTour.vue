<template>
  <div
    ref="vgtRef"
    class="vue-guided-tour"
    :class="active && 'vgt--active'"
  >
    <div
      :class="overlayClass"
      :style="overlayStyle"
    >
      <div
        v-for="(overlay, key) in overlayRect" 
        :key="key"
        :ref="el => { if (el) overlayRefs[key] = el }"
        :class="overlayRectClass(key)"
        :style="overlayRectStyle(key)"
        @click="onOverlayClick(key)"
      />
    </div>
    <vgt-popover
      v-if="active && showPopover && currentStep.popover"
      :overlay-rect="overlayRect"
      :arrow="arrow"
      :offset="offset"
      :position="position"
      :placement="placement"
      :auto-adjust="autoAdjust"
      v-bind="{...currentStep.popover}"
    >
      <slot
        name="close"
        v-bind="{ onClose: onCloseClick }"
      >
        <button
          class="vgt__close vgt__btn--secondary"
          @click="onCloseClick"
        >
          ×
        </button>
      </slot>
      <div class="vgt__content">
        <h3 class="vgt__title">
          {{ currentStep.popover.title }}
        </h3>
        <div>
          {{ currentStep.popover.content }}
        </div>
      </div>
      <div class="vgt__footer">
        <div
          v-if="pagination"
          class="vgt__pages" 
        >
          {{ currentStepIndex+1 }} / {{ steps.length }}
        </div>
        <slot
          name="nav"
          v-bind="{ isFirstStep, isLastStep, onPrev, onNext, onFinish }"
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
              @click="onFinish"
            >
              Finish
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
</template>

<script>
import VueGuidedTourPopover from './vueGuidedTourPopover.vue'
import { ref, computed, onMounted, onUnmounted, onBeforeUpdate } from 'vue'
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
      default: () => []
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
    }
  },
  emits: ['update:stepIndex', 'afterStart', 'afterFinish', 'afterMove', 'afterClose'],
  setup(props, { emit }) {
    const vgtRef = ref(null)
    const showPopover = ref(false)
    const currentStepIndex = ref(props.stepIndex)
    const currentStepEl = ref(null)
    const prevIndex = ref(null)
    const prevEl = ref(null)
    let timeout = null
    let preventScroll = false
    
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
      overlayClass,
      overlayStyle,
      overlayRefs,
      overlayRect,
      overlayRectClass,
      overlayRectStyle,
      updateOverlayRect,
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
      overlayRefs.value = []
    })
    onMounted(() => {
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
      if (index === currentStepIndex.value || active.value || moving.value) return
      const el = getHighlightEl(index, props.steps)
      if (el) {
        handleStepIndexChange(index, el, 'start')
      }
    }

    const onNext = () => {
      if (!active.value || moving.value) return
      const index = currentStepIndex.value + 1
      const el = getHighlightEl(index, props.steps)
      if (el) {
        handleStepIndexChange(index, el)
      }
    }

    const onPrev = () => {
      if (!active.value || moving.value) return
      const index = currentStepIndex.value - 1
      const el = getHighlightEl(index, props.steps)
      if (el) {
        handleStepIndexChange(index, el)
      }
    }
  
    const onFinish = () => {
      if (!active.value || moving.value) return
      const index = -1
      handleStepIndexChange(index, undefined, 'finish')
    }

    const onMove = (index = 0) => {
      if (index === currentStepIndex.value || !active.value || moving.value) return
      const el = getHighlightEl(index, props.steps)
      if (el) {
        handleStepIndexChange(index, el)
      }
    }

    const onClose = () => {
      if (!active.value || moving.value) return
      const index = -1
      handleStepIndexChange(index)
    }

    const handleStepIndexChange = (index, el, event) => {     
      showPopover.value = false
      removeHighlight()
      
      updateCurrentStep(index, el)
      
      if (index === -1) {
        overlayFadeOut(() => {
          emit(event === 'finish' ? 'afterFinish' : 'afterClose')
        })
        return
      }

      if (!isInView(el.getBoundingClientRect())) {
        preventScroll = true
        el.scrollIntoView({
          block: 'center',
        })
      }

      requestAnimationFrame(() => {
        preventScroll = false
        const done = () => {
          addHighlight(el)
          showPopover.value = true
          emit(event === 'start' ? 'afterStart' : 'afterMove')
        }
        event === 'start' ? overlayFadeIn(done) : overlayMove(done)
      })
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
      case ('Escape'):
        if (props.allowEscClose) {
          onClose()
        }
        break
      case ('ArrowLeft'):
        onPrev()
        break
      case ('ArrowRight'):
        onNext()
        break
      }
    }

    const onKeyDown = (event) => {
      if (!active.value || !props.allowKeyboardEvent) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
      event.preventDefault()
    }

    const onOverlayClick = (key) => {
      if (!props.allowOverlayClose || !active.value || key === 'center') return
      onClose()
    }

    const onCloseClick = () => {
      onClose()
    }

    const onResize = () => {
      if (timeout) {
        window.cancelAnimationFrame(timeout)
      }
      timeout = window.requestAnimationFrame(updateOverlayRect)
    }

    const onScroll = () => {
      if (preventScroll) return
      if (timeout) {
        window.cancelAnimationFrame(timeout)
      }
      timeout = window.requestAnimationFrame(updateOverlayRect)
    }

    return {
      vgtRef,
      showPopover,
      currentStepIndex,
      currentStep,
      isFirstStep,
      isLastStep,
      active,
      overlayClass,
      overlayStyle,
      overlayRefs,
      overlayRect,
      overlayRectClass,
      overlayRectStyle,
      onStart,
      onNext,
      onPrev,
      onFinish,
      onMove,
      onKeyUp,
      onOverlayClick,
      onCloseClick
    }
  },
}

function useHightlight () {
  const highlightClass = 'vgt__target--highlighted'
  const relativeClass = 'vgt__target--relative'

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
    const position = window.getComputedStyle(el).position
    if (position === 'static') {
      el.classList.add(relativeClass)
    }
  }

  const removeHighlight = () => {
    const allTargets = document.querySelectorAll(`.${highlightClass}`)
    allTargets.forEach(target => {
      target.classList.remove(highlightClass)
      target.classList.remove(relativeClass)
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
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99990 !important;
}
/*
.vgt--active {}
*/

.vgt__overlay {
  background: #000;
}
.vgt__overlay--hidden {
  opacity: 0;
  visibility: hidden;
}
.vgt__overlay--visible {
  opacity: 0.65;
  visibility: visible;
}
.vgt__overlay--center {
  background-color: transparent !important;
}

.vgt__target--highlighted {
  z-index: 99995 !important;
}
.vgt__target--relative {
  position: relative !important;
}

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