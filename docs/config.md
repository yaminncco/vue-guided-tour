# Config

## Props

#### steps

- Type: `Array`
- Default: `required`

Your steps.

#### stepIndex

- Type: `Number`
- Default: `-1`

Current step index, use with 'v-model' to sync.

#### padding

- Type: `Number`
- Default: `0`

Padding of the highlight.

#### useOverlay

- Type: `Boolean`
- Default: `true`

Show or hide overlay.

#### pagination

- Type: `Boolean`
- Default: `true`

Show or hide the pagination.

#### closeBtn

- Type: `Boolean`
- Default: `true`

Show or hide the close (x) btn.

#### name

- Type: `String`
- Default: `undefined`

Tour name if you want to use multiple tours.

#### allowKeyboardEvent

- Type: `Boolean`
- Default: `true`

Whether to allow keyboard events (left, right, Esc).

#### allowEscClose

- Type: `Boolean`
- Default: `true`

Whether to end the tour when pressing 'Esc' key.

#### allowOverlayClose

- Type: `Boolean`
- Default: `true`

Whether to end the tour when clicking on the overlay.

#### arrow

- Type: `Boolean`
- Default: `true`

Show or hide popover arrow.

#### offset

- Type: `Number`
- Default: `0`

Popover distance from the target.

#### position

- Type: `String`
- Default: `bottom`

Popover position, can be: 'top', 'left', 'right', 'bottom'.

#### placement

- Type: `String`
- Default: `start`

Popover placement, can be: 'start', 'center', 'end'.

#### autoAdjust

- Type: `Boolean`
- Default: `true`

Whether to adjust popover to a new position if there is no space.

#### width

- Type: `String | Number`
- Default: `250`

Popover width.


## Step Properties

```js
{
  target: '.step-1', // Target selector (highlight the center of screen if not defined)
  title: 'Hello world', // Step title
  content: 'Step content', // Step content
  slot: 'dynamicSlotName', // Step slot for dynamic content
  padding: 0,
  popover: {
    position: 'bottom',
    placement: 'start',
    offset: 0,
    arrow: true,
    autoAdjust: true
    width: '250px',
    id: 'hello-world', // Used for aria-labelledby & aria-describedby
    // 'aria-label': 'Hello world', // When title is undefined
  },
  overlay: {
    allowInteraction: true,
  },
  onBeforeNext: () => {
    // perform actions
    // return false to prevent the tour from moving to the next step
  }
  onBeforePrev: () => {
    // perform actions
    // return false to prevent the tour from moving to the previous step
  }
  onBeforeExit: () => {
    // perform actions
    // return false to prevent the tour from exiting
  }
}
```

::: tip
Property defined in step will overwrite what is defined in the props
:::

## Methods

#### `$vgt.start(index)`

Start the tour from the index (default 0).

#### `$vgt.next()`

Move on to the next step.

#### `$vgt.prev()`

Move on to the prev step.

#### `$vgt.exit()`

End the tour.

#### `$vgt.move(index)`

Move to a specific step.

## Events

#### `@after-start`

Emit after the tour start.

#### `@after-exit`

Emit after the tour end.

#### `@after-move`

Emit after the tour move to the next or prev step.

## Slots

The available slots: `#[dynamicSlotName]`, `#content`, `#close`, `#nav`

```html
<vue-guided-tour>
  <template #[dynamicSlotName]="{ stepIndex, step }">
    <div>{{ stepIndex }}, {{ step }}</div>
  </template>
  <template #content="{ stepIndex, step }">
    <div>{{ stepIndex }}, {{ step }}</div>
  </template>
  <template #close>
    <button @click="$vgt.exit">x</button>
  </template>
  <template #nav="{ isFirstStep, isLastStep }">
    <button v-if="!isFirstStep" @click="$vgt.prev">Back</button>
    <button v-if="isLastStep" @click="$vgt.exit">Done</button>
    <button v-else @click="$vgt.next">Next</button>
  </template>
</vue-guided-tour>
```
