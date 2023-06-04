<template>
  <ClientOnly>
    <VueGuidedTour :steps="steps" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { VueGuidedTourProps } from '../../../src'

const steps: VueGuidedTourProps['steps'] = [
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
    target: '.sidebar-items > li:nth-child(1)',
    content: 'Getting Started',
    popover: {
      position: 'right',
    },
  },
  {
    target: '.sidebar-items > li:nth-child(2)',
    content: 'Config',
    popover: {
      position: 'right',
    },
  },
  {
    target: ".navbar-items [aria-label='Github']",
    content: 'Github link',
  },
]
</script>
