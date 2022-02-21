<template>
  <teleport to="body">
    <div
      ref="vgtRef"
      class="vue-guided-tour"
      v-bind="$attrs"
    >
      <vgt-overlay
        v-if="useOverlay"
        ref="vgtOverlay"
        :rect="currentStepRect"
        :allow-overlay-close="allowOverlayClose"
        :allow-esc-close="allowEscClose"
        :allow-interaction="allowInteraction"
        v-bind="{ ...currentStep.overlay }"
        @overlay-click="onOverlayClick"
      />
      <template
        v-if="
          showPopover &&
            (currentStep.title || currentStep.content || $slots.content)
        "
      >
        <transition
          name="popover-appear"
          appear
        >
          <vgt-popover
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
                aria-label="close Tour"
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
                  :id="currentStep.popover['aria-labelledby']"
                  class="vgt__title"
                >
                  {{ currentStep.title }}
                </h3>
                <div
                  v-if="currentStep.content"
                  :id="currentStep.popover['aria-describedby']"
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
                    @click="prev"
                  >
                    Prev
                  </button>
                  <button
                    v-if="isLastStep"
                    class="vgt__btn vgt__btn--primary vgt__end-btn"
                    @click="end"
                  >
                    End
                  </button>
                  <button
                    v-else
                    class="vgt__btn vgt__btn--primary vgt__next-btn"
                    @click="next"
                  >
                    Next
                  </button>
                </div>
              </slot>
            </div>
          </vgt-popover>
        </transition>
      </template>
    </div>
  </teleport>
</template>

<script>
import VueGuidedOverlay from "./vueGuidedOverlay.vue";
import VueGuidedPopover from "./vueGuidedPopover.vue";
import { ref, computed, onMounted, inject, nextTick, toRefs } from "vue";
import { isInView, getBoundingWithPadding } from "../use/utils";
import useRect from "../use/useRect";
import useEvent from "../use/useEvent";
import useFocusTrap from "../use/useFocusTrap";
import { vgtProps } from "../propsValidation";

export default {
  name: "VueGuidedTour",
  components: {
    "vgt-overlay": VueGuidedOverlay,
    "vgt-popover": VueGuidedPopover,
  },
  inheritAttrs: false,
  props: {
    ...vgtProps,
  },
  emits: ["update:stepIndex", "afterStart", "afterEnd", "afterMove"],
  setup(props, { emit }) {
    const { stepIndex, steps, allowKeyboardEvent, useOverlay } = toRefs(props);
    const vgtRef = ref(null);
    const vgtOverlay = ref(null);

    const $vgt = inject("$vgt", {});
    const uid = Math.random().toString(36).substring(2);

    const showPopover = ref(false);

    const currentStepIndex = ref(-1);
    currentStepIndex.value = stepIndex.value;

    const currentStepEl = ref(null);
    const prevEl = ref(null);

    const active = ref(false);
    const moving = ref(false);

    const { enableTrap } = useFocusTrap(vgtRef);
    let lastFocused;

    const { getHighlightEl, addHighlight, removeHighlight } = useHightlight();

    const { rect } = useRect(currentStepEl);
    const currentStepRect = computed(() => {
      const padding = currentStep.value.padding || props.padding;
      return getBoundingWithPadding(rect, padding);
    });

    const currentStep = computed(() => {
      if (currentStepIndex.value < 0) return {};
      const stepObj = steps.value[currentStepIndex.value];
      if (!stepObj) return {};
      return {
        ...stepObj,
        // popover options
        popover: {
          ...stepObj.popover,
          role: "dialog",
          id: stepObj.popover?.id || `popover-${uid}`,
          "aria-labelledby": stepObj.title
            ? `${stepObj.popover?.id || uid}-title`
            : null,
          "aria-describedby": stepObj.content
            ? `${stepObj.popover?.id || uid}-desc`
            : null,
        },
        // overlay options
        overlay: {
          ...stepObj.overlay,
        },
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
      if (index < -1 || index > steps.value.length - 1) return;
      if (index === currentStepIndex.value) return;

      const el = getHighlightEl(index, steps.value);
      if (!el && index !== -1) return;

      showPopover.value = false;
      removeHighlight();

      updateCurrentStep(index, el);

      if (index === -1) {
        handleEndTour();
        return;
      }
      handleMoveTour();
    };

    const handleMoveTour = () => {
      const el = currentStepEl.value;
      const move = !!prevEl.value;

      active.value = true;
      moving.value = true;

      if (useOverlay.value) {
        const startTour = () => {
          lastFocused = document.activeElement;
          vgtOverlay.value.overlayStart(done);
        };

        const moveTour = () => {
          const padding = currentStep.value.padding || props.padding;
          const newRect = getBoundingWithPadding(
            currentStepEl.value.getBoundingClientRect(),
            padding
          );
          vgtOverlay.value.overlayMoveTo(newRect, done);
        };

        move ? moveTour() : startTour();
      } else {
        nextTick(() => {
          done();
        });
      }

      function done() {
        const inView = isInView(el.getBoundingClientRect());
        if (!inView) {
          el.scrollIntoView({ block: "center" });
        }
        showPopover.value = true;
        addHighlight(currentStepEl.value);
        moving.value = false;
        nextTick(() => {
          enableTrap();
        });
        emit(!move ? "afterStart" : "afterMove");
      }
    };

    const handleEndTour = () => {
      showPopover.value = false;
      removeHighlight();
      if (useOverlay.value) {
        endTour();
      } else {
        done();
      }

      function endTour() {
        vgtOverlay.value.overlayClose(done);
      }

      function done() {
        active.value = false;
        moving.value = false;
        lastFocused.focus({
          preventScroll: true,
        });
        emit("afterEnd");
      }
    };

    const updateCurrentStep = (index = -1, el) => {
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
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
      }
    };

    const onOverlayClick = () => {
      onEnd();
    };

    const onCloseClick = () => {
      onEnd();
    };

    useEvent(window, "keyup", onKeyUp);

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
      start: onStart,
      next: onNext,
      prev: onPrev,
      end: onEnd,
      move: onMove,
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
  font-family: inherit;
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

.popover-appear-enter-active {
  transition: opacity 0.2s ease-out;
}
.popover-appear-enter-from {
  opacity: 0;
}
</style>