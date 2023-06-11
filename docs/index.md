---
title: 'Home'
---

# vue-guided-tour

<div class="introduction">

### A vue.js 3 component to guide your visitors.

<div class="installation">

```bash
npm i vue-guided-tour --save
```

</div>

<a href="#" @click.prevent="start"> Click here to see an example </a>

<script setup lang="ts">
import { useVgt } from '../src'
const $vgt = useVgt()
const start = () => {
  $vgt?.start?.(0)
}
</script>

</div>
