const overlayOptions = {
  padding: {
    type: Number,
    default: 0
  },
  allowOverlayClose: {
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
}

const popoverOptions = {
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
  }
}

export const vgtProps = {
  steps: {
    type: Array,
    required: true
  },
  stepIndex: {
    type: Number,
    default: -1
  },
  pagination: {
    type: Boolean,
    default: true
  },
  closeBtn: {
    type: Boolean,
    default: true
  },
  allowKeyboardEvent: {
    type: Boolean,
    default: true
  },
  ...popoverOptions,
  ...overlayOptions
}

export const overlayProps = {
  ...overlayOptions,
  preventScroll: {
    type: Boolean,
    default: false
  }
}

export const popoverProps = {
  targetBounds: {
    type: Object,
    required: true
  },
  ...popoverOptions
}