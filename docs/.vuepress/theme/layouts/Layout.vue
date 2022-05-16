<template>
  <ParentLayout/>
  <ClientOnly>
    <VueGuidedTour :steps="steps" />
  </ClientOnly>
</template>

<script setup>
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'

const steps = [
  {
    target: ".introduction",
    title: "Introduction",
    content: "Docs introduction",
    padding: 10
  },
  {
    target: ".installation",
    content: "Installation command",
    padding: 5
  },
  {
    target: ".sidebar-items li:nth-child(1) .sidebar-item-children",
    content: "Getting Started",
    popover: {
      position: "right"
    }
  },
  {
    target: ".sidebar-items li:nth-child(2) .sidebar-item-children",
    content: "Config",
    popover: {
      position: "right"
    }
  },
  {
    target: ".navbar-items [aria-label='Github']",
    content: "Github link",
  }
]
</script>