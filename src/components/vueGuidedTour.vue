<template>
  <teleport to="body">
    <div
      ref="vgtRef"
      class="vue-guided-tour"
      :class="active && 'vgt--active'"
    >
      <vgt-overlay
        ref="vgtOverlay"
        :rect="currentStepRect"
        :allow-overlay-close="allowOverlayClose"
        :allow-esc-close="allowEscClose"
        :allow-interaction="allowInteraction"
        v-bind="{ ...currentStep.overlay }"
        @overlay-click="onOverlayClick"
      />
      <vgt-popover
        v-if="
          showPopover && ( 
            currentStep.title ||
            currentStep.content ||
            $slots.content
          )
        "
        :rect="currentStepRect"
        :arrow="arrow"
        :offset="offset"
        :position="position"
        :placement="placement"
        :auto-adjust="autoAdjust"
        v-bind="{ ...currentStep.popover }"
      >
        <slot
          v-if="closeBtn"
          name="close"
        >
          <button
            class="vgt__close-btn"
            aria-label="close"
            @click="onCloseClick"
          >
            ×
          </button>
        </slot>
        <div class="vgt__body">
          <slot
            name="content"
            v-bind="{ stepIndex: currentStepIndex }"
          >
            <h3
              v-if="currentStep.title"
              class="vgt__title"
            >
              {{ currentStep.title }}
            </h3>
            <div
              v-if="currentStep.content"
              class="vgt__content"
            >
              {{ currentStep.content }}
            </div>
          </slot>
        </div>
        <div class="vgt__footer">
          <div
            v-if="pagination"
            class="vgt__pages"
          >
            {{ currentStepIndex + 1 }} / {{ steps.length }}
          </div>
          <slot
            name="nav"
            v-bind="{ isFirstStep, isLastStep }"
          >
            <div class="vgt__nav">
              <button
                v-if="!isFirstStep"
                class="vgt__btn vgt__btn--secondary vgt__prev-btn"
                @click="onPrev"
              >
                Prev
              </button>
              <button
                v-if="isLastStep"
                class="vgt__btn vgt__btn--primary vgt__end-btn"
                @click="onEnd"
              >
                End
              </button>
              <button
                v-else
                class="vgt__btn vgt__btn--primary vgt__next-btn"
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
import VueGuidedOverlay from "./vueGuidedOverlay.vue";
import VueGuidedPopover from "./vueGuidedPopover.vue";
import {
  ref,
  computed,
  onMounted,
  inject,
  nextTick,
  watch,
  toRefs,
} from "vue";
import {
  isInView,
  getBoundingWithPadding,
} from "../use/utils";
import useRect from "../use/useRect";
import useEvent from "../use/useEvent";
import { vgtProps } from "../propsValidation";

export default {
  name: "VueGuidedTour",
  components: {
    "vgt-overlay": VueGuidedOverlay,
    "vgt-popover": VueGuidedPopover,
  },
  props: {
    ...vgtProps,
  },
  emits: ["update:stepIndex", "afterStart", "afterEnd", "afterMove"],
  setup(props, { emit }) {
    const {
      stepIndex,
      steps,
      allowKeyboardEvent,
      allowEscClose,
      allowOverlayClose,
    } = toRefs(props);
    const vgtRef = ref(null);
    const vgtOverlay = ref(null);

    const $vgt = inject("$vgt");

    const showPopover = ref(false);

    const currentStepIndex = ref(-1);
    currentStepIndex.value = stepIndex.value;

    const currentStepEl = ref(null);
    const prevEl = ref(null);

    const active = ref(false);
    const moving = ref(false);

    const { getHighlightEl, addHighlight, removeHighlight } = useHightlight();

    const { rect } = useRect(currentStepEl);
    const currentStepRect = computed(() => {
      const padding = currentStep.value.padding || props.padding;
      return getBoundingWithPadding(rect, padding);
    });

    const currentStep = computed(() => {
      if (currentStepIndex.value === -1) return {};
      const stepObj = steps.value[currentStepIndex.value];
      return {
        ...stepObj,
        // popover options
        popover: {
          ...stepObj.popover,
        },
        /*
        // overlay options
        overlay: {
          ...stepObj.overlay
        },
        */
      };
    });
    const isFirstStep = computed(() => {
      return currentStepIndex.value === 0;
    });
    const isLastStep = computed(() => {
      return currentStepIndex.value === steps.value.length - 1;
    });

    onMounted(() => {
      $vgt.start = onStart;
      $vgt.next = onNext;
      $vgt.prev = onPrev;
      $vgt.end = onEnd;
      $vgt.move = onMove;
    });

    watch(active, (value) => {
      if (!value) {
        showPopover.value = false;
        currentStepIndex.value = -1;
        currentStepEl.value = null;
        prevEl.value = null;
      }
    });

    const onStart = (index = 0) => {
      if (active.value) return;
      handleStepIndexChange(index);
    };

    const onNext = () => {
      if (!active.value || moving.value) return;
      const index = currentStepIndex.value + 1;
      if (index > steps.value.length - 1) return;
      handleStepIndexChange(index);
    };

    const onPrev = () => {
      if (!active.value || moving.value) return;
      const index = currentStepIndex.value - 1;
      if (index < 0) return;
      handleStepIndexChange(index);
    };

    const onEnd = () => {
      if (!active.value || moving.value) return;
      const index = -1;
      handleStepIndexChange(index);
    };

    const onMove = (index = 0) => {
      if (index === currentStepIndex.value || !active.value || moving.value)
        return;
      handleStepIndexChange(index);
    };

    const handleStepIndexChange = (index) => {
      const el = getHighlightEl(index, steps.value);
      if (!el && index !== -1) return;

      const startTour = () => {
        active.value = true;
        moving.value = true;
        vgtOverlay.value.overlayStart(done);
      }

      const moveTour = () => {
        active.value = true;
        moving.value = true;
        const padding = currentStep.value.padding || props.padding;
        const newRect = getBoundingWithPadding(
          currentStepEl.value.getBoundingClientRect(),
          padding
        );
        vgtOverlay.value.overlayMoveTo(newRect, done);
      }

      const endTour = () => {
        showPopover.value = false;
        removeHighlight();
        active.value = false;
        vgtOverlay.value.overlayClose(() => {
          emit("afterEnd");
        });
      };

      const done = () => {
        const inView = isInView(el.getBoundingClientRect());
        if (!inView) {
          el.scrollIntoView({ block: "center" });
        }
        showPopover.value = true;
        addHighlight(currentStepEl.value);
        moving.value = false;
        nextTick(() => {
          const focusableEls = getFocusableElements();
          if (focusableEls.length > 0) {
            const firstFocusableEl = focusableEls[0];
            firstFocusableEl.focus();
          }
        });
        emit(!move ? "afterStart" : "afterMove");
      };
      
      showPopover.value = false;
      removeHighlight();
      
      updateCurrentStep(index, el);
      const move = !!prevEl.value;
      
      if (index === -1) {
        endTour();
        return;
      }
      move ? moveTour() : startTour();
    };

    const updateCurrentStep = (index, el) => {
      currentStepIndex.value = index;
      emit("update:stepIndex", currentStepIndex.value);

      if (index === -1) {
        prevEl.value = null;
        currentStepEl.value = null;
      } else {
        prevEl.value = currentStepEl.value;
        currentStepEl.value = el;
      }
    };

    const onKeyUp = (event) => {
      if (!active.value || !allowKeyboardEvent.value) return;
      switch (event.key) {
        case "Escape":
          if (allowEscClose.value) {
            onEnd();
          }
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
      }
    };

    const onKeyDown = (event) => {
      if (!active.value) return;
      const focusableEls = getFocusableElements();
      switch (event.key) {
        case "Tab":
          if (focusableEls.length === 0) {
            event.preventDefault();
          } else {
            const firstFocusableEl = focusableEls[0];
            const lastFocusableEl = focusableEls[focusableEls.length - 1];
            if (event.shiftKey) {
              if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                event.preventDefault();
              }
            } else {
              if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                event.preventDefault();
              }
            }
          }
          break;
        case "ArrowLeft":
        case "ArrowRight":
          if (allowKeyboardEvent.value) {
            event.preventDefault();
          }
          break;
      }
    };

    const onOverlayClick = () => {
      if (!allowOverlayClose.value) return;
      onEnd();
    };

    const onCloseClick = () => {
      onEnd();
    };

    const getFocusableElements = () => {
      const selector = `button, [href], input, select, textarea, [tabindex]`;
      const focusableEls = [...vgtRef.value.querySelectorAll(selector)].filter(
        (el) => {
          if (parseInt(el.getAttribute("tabindex"), 10) < 0) {
            return false;
          }
          if (el.disabled) {
            return false;
          }
          while (el) {
            if (
              getComputedStyle(el).display === "none" ||
              getComputedStyle(el).visibility === "hidden"
            ) {
              return false;
            }
            el = el.parentElement;
          }
          return true;
        }
      );
      return focusableEls;
    };

    useEvent(window, "keyup", onKeyUp);
    useEvent(window, "keydown", onKeyDown);

    return {
      vgtRef,
      vgtOverlay,
      active,
      showPopover,
      currentStepIndex,
      currentStepRect,
      currentStep,
      isFirstStep,
      isLastStep,
      onStart,
      onNext,
      onPrev,
      onEnd,
      onMove,
      onKeyUp,
      onOverlayClick,
      onCloseClick,
    };
  },
};

function useHightlight() {
  const highlightClass = "vgt__target--highlighted";

  const getHighlightEl = (index, steps) => {
    if (typeof index !== "number" || index < 0 || index > steps.length - 1)
      return;
    const targetValue = steps[index].target;
    const el = document.querySelector(`${targetValue}`);
    if (!targetValue) {
      console.warn(`[vue-guided-tour] : Target is required in step ${index}`);
      return undefined;
    } else if (!el) {
      console.warn(
        `[vue-guided-tour] : Target to highlight "${targetValue}" not found`
      );
      return undefined;
    }
    return el;
  };

  const addHighlight = (el) => {
    el.classList.add(highlightClass);
  };

  const removeHighlight = () => {
    const allTargets = document.querySelectorAll(`.${highlightClass}`);
    allTargets.forEach((target) => {
      target.classList.remove(highlightClass);
    });
  };

  return {
    getHighlightEl,
    addHighlight,
    removeHighlight,
  };
}
</script>

<style>
.vue-guided-tour {
  position: absolute;
  top: 0;
  left: 0;
}
.vue-guided-tour.vgt--active {
  z-index: 99999 !important;
}

/*
.vgt__target--highlighted {
}
*/

.vgt__body {
  line-height: 1.5;
  margin-top: 30px;
  margin-bottom: 20px;
}
.vgt__title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 10px;
}
.vgt__content {
  font-size: 1rem;
  margin: 0;
}

.vgt__footer {
  display: flex;
  align-items: center;
}
.vgt__pages {
  font-size: 0.76rem;
  font-weight: 500;
  color: #969faf;
}
.vgt__nav {
  margin-left: auto;
}
.vgt__btn {
  display: inline-block;
  padding: 5px 16px;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 4px;
  box-sizing: border-box;
  border: none;
  transition: background-color 0.1s ease, color 0.1s ease;
}
.vgt__btn--primary {
  background-color: #3eaf7c;
  color: #fff;
}
.vgt__btn--primary:hover {
  background-color: #4abf8a;
}

.vgt__btn--secondary {
  background-color: transparent;
  color: #969faf;
}
.vgt__btn--secondary:hover {
  color: #5b6474;
}

.vgt__prev-btn {
  margin-right: 7px;
}
/*
.vgt__next-btn {}
.vgt__end-btn {}
*/

.vgt__close-btn {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  height: 36px;
  line-height: 36px;
  width: 36px;
  padding: 0;
  margin: 0;
  color: #969faf;
  transition: color 0.1s ease;
}
.vgt__close-btn:hover {
  color: #5b6474;
}
</style>