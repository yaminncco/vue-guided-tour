<template>
  <ClientOnly>
    <VueGuidedTour :steps="steps" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueGuidedTourProps } from '../../../src'

const steps = ref<VueGuidedTourProps['steps']>([
  {
    target: '.introduction',
    title: 'Introduction',
    content: 'Docs introduction',
    padding: 10,
  },
  {
    target: '.installation',
    content: 'Installation command',
    padding: 5,
  },
  {
    target:
      '.VPSidebarItem .VPLink[href="/vue-guided-tour/getting-started.html"]',
    content: 'Getting Started',
    popover: {
      position: 'right',
    },
    padding: 10,
  },
  {
    target: '.VPSidebarItem .VPLink[href="/vue-guided-tour/config.html"]',
    content: 'Config',
    popover: {
      position: 'right',
    },
    padding: 10,
  },
  {
    target:
      '.VPNavBarMenu .VPLink[href="https://github.com/yaminncco/vue-guided-tour"]',
    content: 'Github link',
  },
])
</script>
