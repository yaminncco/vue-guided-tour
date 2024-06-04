<template>
  <ClientOnly>
    <VueGuidedTour class="tour" :steps="steps" :padding="10">
      <template #step-first>
        <div style="text-align: center">
          <img
            src="https://loremflickr.com/200/200/cat"
            style="margin: 0 auto 24px; max-width: 200px; border-radius: 50%"
          />
          <h3 class="vgt__title">Welcome to VueGuidedTour</h3>
        </div>
      </template>
      <template #step-last>
        <div style="text-align: center">
          <img
            src="https://loremflickr.com/200/200/cat"
            style="margin: 0 auto 24px; max-width: 200px; border-radius: 50%"
          />
          <h3 class="vgt__title">That's the end of our tour!</h3>
        </div>
      </template>
    </VueGuidedTour>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueGuidedTourProps } from '../../../src'
import { useRouter } from 'vitepress'

const router = useRouter()

const steps = ref<VueGuidedTourProps['steps']>([
  {
    slot: 'step-first',
    popover: {
      width: '450px',
    },
  },
  {
    target: '.step-introduction',
    content:
      'VueGuidedTour is a Vue3 component to guide your visitors through your app',
    popover: {
      width: '350px',
    },
  },
  {
    target: '.step-installation',
    content: 'How to install',
    onBeforeNext: async () => {
      if (router.route.path != '/vue-guided-tour/getting-started.html') {
        await router.go('/vue-guided-tour/getting-started')
      }
    },
  },
  {
    target: '.step-usage',
    content: 'How to use',
    popover: {
      position: 'right',
    },
    onBeforePrev: async () => {
      if (router.route.path != '/vue-guided-tour/') {
        await router.go('/vue-guided-tour/')
      }
    },
  },
  {
    target:
      '.VPNavBarMenu .VPLink[href="https://github.com/yaminncco/vue-guided-tour"]',
    content: 'Github link',
    onBeforePrev: async () => {
      if (router.route.path != '/vue-guided-tour/getting-started.html') {
        await router.go('/vue-guided-tour/getting-started')
      }
    },
    onBeforeNext: async () => {
      if (router.route.path != '/vue-guided-tour/') {
        await router.go('/vue-guided-tour/')
      }
    },
  },
  {
    slot: 'step-last',
    popover: {
      width: '450px',
    },
  },
])
</script>

<style>
html.dark .tour {
  --vgt-overlay-opacity: 0.8;
}

.tour .vue-guided-popover {
  color: var(--vp-c-text-1);
}

.tour .vue-guided-popover,
.tour .vgp__body,
.tour .vgp__arrow {
  background-color: var(--vp-c-bg);
}

.tour .vgt__pages {
  color: var(--vp-c-text-2);
}

.tour .vgt__btn--primary {
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
}
.tour .vgt__btn--primary:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
}

.tour .vgt__btn--secondary {
  color: var(--vp-c-text-2);
}
.tour .vgt__btn--secondary:hover {
  color: var(--vp-c-brand);
}

.tour .vgt__close-btn {
  color: var(--vp-c-text-2);
}
.tour .vgt__close-btn:hover {
  color: var(--vp-c-brand);
}
</style>
