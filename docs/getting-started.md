---
title: "Getting Started"
---

## Installation

```bash
npm i vue-guided-tour --save
```

## Usage

```js
import { createApp } from "vue";
import App from "./App.vue";
import VueGuidedTour from "vue-guided-tour";

const app = createApp(App);
app.use(VueGuidedTour);
app.mount("#app");
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
          target: ".step-1",
          content: "Hello world",
        },
      ],
    };
  },
};
</script>
```

Then in your components start it with

```js
this.$vgt.start(0);
```

In setup function you need to inject `$vgt`

```js
import { inject } from "vue";

setup() {
  const $vgt = inject("$vgt");
  $vgt.start(0);
}
```
