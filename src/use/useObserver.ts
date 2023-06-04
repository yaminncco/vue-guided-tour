import { watch, unref, onScopeDispose, Ref } from 'vue'

export default function useObserver<
  Target extends HTMLElement | null | undefined
>(
  target: Ref<Target> | Target,
  callback: ResizeObserverCallback,
  options: ResizeObserverOptions = {}
) {
  let observer: ResizeObserver | undefined

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watch(
    () => unref(target),
    (el) => {
      cleanup()
      if (!el) return
      observer = new window.ResizeObserver(callback)
      observer.observe(el, options)
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
