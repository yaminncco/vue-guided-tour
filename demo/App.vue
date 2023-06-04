<template>
  <div class="app">
    <div class="demo">
      <h1 class="demo-title">Vue Guided Tour</h1>
      <p>a vue.js 3 component to guide your visitors</p>
      <a href="#" class="demo-btn" @click.prevent="start"> Start the tour </a>
    </div>
    <div class="demo-grid">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="`step step-${index + 1}`"
      />
    </div>
  </div>
  <vue-guided-tour
    v-model:stepIndex="currentStepIndex"
    :steps="steps"
    @afterStart="onAfterStart"
    @afterEnd="onAfterEnd"
    @afterMove="onAfterMove"
  >
    <!--
    <template #content="{ stepIndex }">
      <div id="hello-world-title">
        step {{ stepIndex }}
      </div>
    </template>
    <template #close>
      <button @click="$vgt.end">
        x
      </button>
    </template>
    <template #nav="{ isFirstStep, isLastStep }">
      <button
        v-if="!isFirstStep"
        @click="$vgt.prev"
      >
        Prev
      </button>
      <button
        v-if="isLastStep"
        @click="$vgt.end"
      >
        End
      </button>
      <button
        v-else
        @click="$vgt.next"
      >
        Next
      </button>
    </template>
    -->
  </vue-guided-tour>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VueGuidedTourProps } from '../src'

export default defineComponent({
  name: 'App',
  setup() {
    const currentStepIndex = ref(-1)
    const steps = ref<VueGuidedTourProps['steps']>([
      {
        target: '.step-1',
        title: 'Hello world',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
        popover: {
          placement: 'start',
          position: 'right',
        },
      },
      {
        target: '.step-2',
        title: 'Hello world 2',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
        popover: {
          placement: 'end',
          position: 'right',
        },
      },
      {
        target: '.step-3',
        content: 'Hello world 3',
        popover: {
          placement: 'center',
          position: 'left',
        },
      },
      {
        target: '.step-4',
        content: 'Hello world 4',
        popover: {
          placement: 'center',
          position: 'top',
        },
      },
      {
        target: '.step-5',
        content: 'Hello world 5',
        popover: {
          placement: 'start',
          position: 'left',
        },
      },
      {
        target: '.step-6',
        content: 'Hello world 6',
        popover: {
          placement: 'center',
          position: 'right',
        },
      },
      {
        target: '.step-7',
        content: 'Hello world 7',
        popover: {
          placement: 'center',
          position: 'left',
        },
      },
    ])

    return {
      currentStepIndex,
      steps,
    }
  },
  methods: {
    start() {
      this.$vgt.start?.(0)
    },
    onAfterStart() {
      // call after the tour start
      // console.log('onAfterStart')
    },
    onAfterEnd() {
      // call after the tour end
      // console.log('onAfterEnd')
    },
    onAfterMove() {
      // call after the tour move to the next or prev step
      // console.log('onAfterMove')
    },
  },
})
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

.app {
  margin: 200px 0;
  text-align: center;
}

.demo {
  margin-bottom: 60px;
}
.demo-title {
  font-size: 3.2rem;
}
.demo-btn {
  display: inline-block;
  color: #fff;
  background-color: #42b983;
  border: none;
  text-decoration: none;
  padding: 15px 25px;
  font-weight: 700;
  border-radius: 4px;
  font-size: 18px;
  margin-top: 20px;
}
.demo-grid {
  display: grid;
  grid-template: repeat(4, 15em) / repeat(4, 1fr);
  grid-gap: 20px;
  padding: 20px;
  max-width: 960px;
  margin: auto;
}

.step {
  background-color: #41b883;
}
.step-1 {
  grid-row: 1/4;
}
.step-2 {
  grid-column: 2 / 4;
}
.step-3 {
  grid-row: 1 / 3;
}
.step-4 {
  grid-column: 2 / 4;
  grid-row: 2 / 4;
}
.step-5 {
  grid-column: 1 / 2;
}
.step-6 {
  grid-row: 3 / 4;
}
.step-7 {
  grid-column: 2 / 5;
}
</style>
