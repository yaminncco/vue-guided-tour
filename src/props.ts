import { PropType } from 'vue'
import { Step, PopoverOptions, Rect } from './types'

export const position = ['top', 'left', 'right', 'bottom'] as const

export const placement = ['start', 'center', 'end'] as const

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
}

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
    type: String as PropType<Exclude<PopoverOptions['position'], undefined>>,
    default: 'bottom',
    validator: function (value: any) {
      return position.indexOf(value) !== -1
    },
  },
  placement: {
    type: String as PropType<Exclude<PopoverOptions['placement'], undefined>>,
    default: 'start',
    validator: function (value: any) {
      return placement.indexOf(value) !== -1
    },
  },
  autoAdjust: {
    type: Boolean,
    default: true,
  },
  width: {
    type: [String, Number],
    default: 250,
  },
}

export const vueGuidedTourProps = {
  steps: {
    type: Array as PropType<Step[]>,
    required: true,
    default: () => [],
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
  name: {
    type: String,
    default: undefined,
  },
  ...popoverOptions,
  ...overlayOptions,
} as const

export const vueGuidedOverlayProps = {
  rect: {
    type: Object as PropType<Rect>,
  },
  ...overlayOptions,
} as const

export const vueGuidedPopoverProps = {
  rect: {
    type: Object as PropType<Rect>,
  },
  ...popoverOptions,
} as const
