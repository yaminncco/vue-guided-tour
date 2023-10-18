import { BoundingRect, Position } from '../types'

export const getBoundingWithPadding = (rect: BoundingRect, padding = 0) => {
  return {
    top: rect.top - padding,
    right: rect.right + padding,
    bottom: rect.bottom + padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }
}

export const isInView = ({
  top,
  left,
  bottom,
  right,
}: Omit<BoundingRect, 'width' | 'height'>) => {
  const { innerWidth: w, innerHeight: h } = window
  return top >= 0 && left >= 0 && right <= w && bottom <= h
}

export const isOutView = ({
  top,
  left,
  bottom,
  right,
}: Omit<BoundingRect, 'width' | 'height'>) => {
  const { innerWidth: w, innerHeight: h } = window
  return {
    top: top < 0,
    left: left < 0,
    right: right > w,
    bottom: bottom > h,
  }
}

export const isPositionVertical = (position: Position) => {
  return position === 'top' || position === 'bottom'
}

export const rafThrottle = <F extends (...args: any[]) => void>(fn: F) => {
  let rafId: number | null
  return (...args: Parameters<F>) => {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = null
      fn(...args)
    })
  }
}

export const getWindowCenterRect = () => {
  const { innerWidth: w, innerHeight: h } = window
  return {
    top: h / 2,
    left: w / 2,
    right: w / 2,
    bottom: h / 2,
    width: 0,
    height: 0,
  }
}
