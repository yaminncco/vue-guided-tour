import { unref, ref, readonly, Ref } from 'vue'
import useEvent from './useEvent'

export default function useFocusTrap<
  Target extends HTMLElement | null | undefined
>(target: Ref<Target> | Target) {
  const active = ref(false)
  const focusableEls: Ref<HTMLElement[]> = ref([])

  const onKeyDown = (event: KeyboardEvent) => {
    if (!active.value || !unref(target)) return
    const isTabPressed = event.key === 'Tab'
    if (!isTabPressed) return
    if (focusableEls.value.length === 0) {
      event.preventDefault()
    } else {
      const firstFocusableEl = focusableEls.value[0]
      const lastFocusableEl = focusableEls.value[focusableEls.value.length - 1]
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
  }

  const enableTrap = () => {
    const _target = unref(target)
    if (!_target) return
    active.value = true
    focusableEls.value = getFocusableElements(_target)
    if (focusableEls.value.length > 0) {
      const firstFocusableEl = focusableEls.value[0]
      firstFocusableEl.focus()
    }
  }
  const disableTrap = () => {
    active.value = false
  }

  useEvent(target, 'keydown', onKeyDown)

  return { active: readonly(active), enableTrap, disableTrap }
}

function getFocusableElements(target: HTMLElement) {
  const selector = `button, [href], input, select, textarea, [tabindex]`
  const focusableEls = [...target.querySelectorAll(selector)].filter((el) => {
    const tabindex = el.getAttribute('tabindex')
    if (tabindex && parseInt(tabindex, 10) < 0) {
      return false
    }
    if (el.getAttribute('disabled')) {
      return false
    }

    let _el = el
    while (_el) {
      if (
        getComputedStyle(_el).display === 'none' ||
        getComputedStyle(_el).visibility === 'hidden'
      ) {
        return false
      }
      _el = _el.parentElement as Element
    }
    return true
  }) as HTMLElement[]
  return focusableEls
}
