# Getting started

## Installation

```bash
npm i vue-guided-tour --save
```

## Usage

<div class="step-usage">

```js
import { createApp } from 'vue'
import App from './App.vue'
import VueGuidedTour from 'vue-guided-tour'
import 'vue-guided-tour/style.css'

const app = createApp(App)
app.use(VueGuidedTour)
app.mount('#app')
```

```vue
<template>
  <button class="step-1">target</button>
  <vue-guided-tour :steps="steps" />
</template>

<script>
export default {
  data() {
    return {
      steps: [
        {
          target: '.step-1',
          content: 'Hello world',
        },
      ],
    }
  },
}
</script>
```

Then in your components you can start the tour

```js
this.$vgt.start(0)
```

In setup function use `useVgt` composable

```js
import { useVgt } from 'vue-guided-tour'

setup() {
  const $vgt = useVgt()
  $vgt.start(0)
}
```

</div>

::: warning
if prop [`name`](config.md#name) is set then you start the tour `$vgt[name].start(0)`
:::
