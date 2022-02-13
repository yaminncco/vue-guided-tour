const overlayOptions = {
  allowOverlayClose: {
    type: Boolean,
    default: true,
  },
  allowEscClose: {
    type: Boolean,
    default: true,
  },
  allowInteraction: {
    type: Boolean,
    default: true,
  },
};

const popoverOptions = {
  arrow: {
    type: Boolean,
    default: true,
  },
  offset: {
    type: Number,
    default: 0,
  },
  position: {
    type: String,
    default: "bottom",
    validator: function (value) {
      return ["top", "left", "right", "bottom"].indexOf(value) !== -1;
    },
  },
  placement: {
    type: String,
    default: "start",
    validator: function (value) {
      return ["start", "center", "end"].indexOf(value) !== -1;
    },
  },
  autoAdjust: {
    type: Boolean,
    default: true,
  },
};

export const vgtProps = {
  steps: {
    type: Array,
    required: true,
    default: () => []
  },
  stepIndex: {
    type: Number,
    default: -1,
  },
  padding: {
    type: Number,
    default: 0,
  },
  useOverlay: {
    type: Boolean,
    default: true,
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  closeBtn: {
    type: Boolean,
    default: true,
  },
  allowKeyboardEvent: {
    type: Boolean,
    default: true,
  },
  ...popoverOptions,
  ...overlayOptions,
};

export const overlayProps = {
  rect: {
    type: Object,
    default() {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      };
    },
  },
  ...overlayOptions,
};

export const popoverProps = {
  rect: {
    type: Object,
    default() {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      };
    },
  },
  ...popoverOptions,
};
