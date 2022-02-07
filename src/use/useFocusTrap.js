import { unref, ref, readonly } from "vue";
import useEvent from "./useEvent";

export default function useFocusTrap(target) {
  const active = ref(false);
  const focusableEls = ref([]);

  const onKeyDown = (event) => {
    if (!active.value || !unref(target)) return;
    const isTabPressed = event.key === "Tab" || event.keyCode === 9;
    if (!isTabPressed) return;
    if (focusableEls.value.length === 0) {
      event.preventDefault();
    } else {
      const firstFocusableEl = focusableEls.value[0];
      const lastFocusableEl = focusableEls.value[focusableEls.value.length - 1];
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
  };

  const enableTrap = () => {
    active.value = true;
    focusableEls.value = getFocusableElements(unref(target));
    if (focusableEls.value.length > 0) {
      const firstFocusableEl = focusableEls.value[0];
      firstFocusableEl.focus();
    }
  };
  const disableTrap = () => {
    active.value = false;
  };

  useEvent(target, "keydown", onKeyDown);

  return { active: readonly(active), enableTrap, disableTrap };
}

function getFocusableElements(target) {
  if (!target) return;
  const selector = `button, [href], input, select, textarea, [tabindex]`;
  const focusableEls = [...target.querySelectorAll(selector)].filter((el) => {
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
  });
  return focusableEls;
}
