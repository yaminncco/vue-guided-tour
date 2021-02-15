export const vgtProps = {
  steps: {
    type: Array,
    required: true
  },
  stepIndex: {
    type: Number,
    default: -1
  },
  padding: {
    type: Number,
    default: 0
  },
  pagination: {
    type: Boolean,
    default: true
  },
  closeBtn: {
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
  },
  allowInteraction: {
    type: Boolean,
    default: true
  }
}

export const popoverProps = {
  overlaysRef: {
    type: Array,
    required: true
  },
  updatePopover: {
    type: Boolean,
    default: false
  }
}

export const popoverOptions = {
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