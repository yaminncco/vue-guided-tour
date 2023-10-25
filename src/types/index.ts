import { position, placement } from '../props'

export type Position = (typeof position)[number]

export type Placement = (typeof placement)[number]

export interface VueGuidedTourProps
  extends TourOptions,
    PopoverOptions,
    OverlayOptions {}

export interface TourOptions {
  steps: Step[]
  stepIndex?: number
  padding?: number
  useOverlay?: boolean
  pagination?: boolean
  closeBtn?: boolean
  allowKeyboardEvent?: boolean
  allowOverlayClose?: boolean
  allowEscClose?: boolean
  name?: string
}

export interface OverlayOptions {
  allowInteraction?: boolean
}

export interface PopoverOptions {
  position?: Position
  placement?: Placement
  offset?: number
  arrow?: boolean
  autoAdjust?: boolean
  width?: string | number
  id?: string
}

export interface Step {
  target?: string
  title?: string
  content?: string
  slot?: string
  padding?: number
  popover?: PopoverOptions
  overlay?: OverlayOptions
  onBeforeNext?: () => any
  onBeforePrev?: () => any
  onBeforeExit?: () => any
}

export interface TourApi {
  start: (index?: number) => void
  next: () => void
  prev: () => void
  exit: () => void
  move: (index?: number) => void
}

export type Vgt = TourApi & Partial<Record<string, TourApi>>

export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export interface BoundingRect {
  top: number
  left: number
  width: number
  height: number
  bottom: number
  right: number
}
