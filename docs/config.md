---
title: 'Config'
---

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

## Step Properties

```js
{
  target: '.step-1', // Target selector
  title: 'Hello world', // Step title
  content: 'Step content', // Step content
  padding: 0,
  popover: {
    position: 'bottom',
    placement: 'start',
    offset: 0,
    arrow: true,
    autoAdjust: true
    id: 'hello-world', // Used for aria-labelledby & aria-describedby
    // 'aria-label': 'Hello world', // When title is undefined
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

#### `$vgt.end()`

End the tour.

#### `$vgt.move(index)`

Move to a specific step.

## Events

#### `@after-start`

Emits after the tour start.

#### `@after-end`

Emits after the tour end.

#### `@after-move`

Emits after the tour move to the next or prev step.

## Slots

The available slots: `#content`, `#close`, `#nav`

```vue
<vue-guided-tour>
  <template #content="{ stepIndex }">
    <div>step {{ stepIndex }}</div>
  </template>
  <template #close>
    <button @click="$vgt.end">x</button>
  </template>
  <template #nav="{ isFirstStep, isLastStep }">
    <button v-if="!isFirstStep" @click="$vgt.prev">Prev</button>
    <button v-if="isLastStep" @click="$vgt.end">End</button>
    <button v-else @click="$vgt.next">Next</button>
  </template>
</vue-guided-tour>
```
