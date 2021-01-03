export const getBoundingClientRect = (el, padding = 0) => {
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top - padding,
    right: rect.right + padding,
    bottom: rect.bottom + padding,
    left: rect.left - padding,
    width: rect.width + padding*2,
    height: rect.height + padding*2,
    x: rect.x - padding,
    y: rect.y - padding
  }
}

export const isInView = ({top, left, bottom, right}) => {
  const { innerWidth: w, innerHeight: h } = window
  return (top >= 0 && left >= 0 && right <= w && bottom <= h)
}

export const isOutView = ({top, left, bottom, right}) => {
  const { innerWidth: w, innerHeight: h } = window
  return {
    top: top < 0,
    left: left < 0,
    right: right > w,
    bottom: bottom > h,
  }
}

export const isPositionVertical = (position) => {
  return position === 'top' || position === 'bottom'
}