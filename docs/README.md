---
title: "Introduction"
---

<div class="introduction">

# vue-guided-tour

### A vue.js 3 component to guide your visitors.

<div class="installation">

```bash
npm i vue-guided-tour --save
```

</div>

<a @click.prevent="start" href="#">
Click here to see an example
</a>

<script setup>
import { inject } from "vue";
const $vgt = inject("$vgt");
const start = () => {
  $vgt.start(0);
};
</script>
</div>
