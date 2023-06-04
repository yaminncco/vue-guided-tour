import { watch, unref, onScopeDispose, Ref } from 'vue'

export default function useEvent<
  Target extends Window | EventTarget | null | undefined,
  E extends Event
>(
  target: Ref<Target> | Target,
  type: string,
  callback: (evt: E) => void,
  options?: boolean | AddEventListenerOptions
) {
  let eventTarget: Window | EventTarget | undefined

  const cleanup = () => {
    if (eventTarget) {
      eventTarget.removeEventListener(
        type,
        callback as (evt: Event) => void,
        options
      )
      eventTarget = undefined
    }
  }

  const stopWatch = watch(
    () => unref(target),
    (el) => {
      cleanup()
      if (!el) return
      eventTarget = el
      el.addEventListener(type, callback as (evt: Event) => void, options)
    },
    { immediate: true, flush: 'post' }
  )

  const stop = () => {
    stopWatch()
    cleanup()
  }

  onScopeDispose(stop)

  return stop
}
