<template>
  <a @click.prevent="start" href="#"> Click here to see an example </a>
</template>

<script setup lang="ts">
import { useVgt } from '../../../src'
const $vgt = useVgt()
const start = () => {
  $vgt?.start?.(0)
}
</script>
