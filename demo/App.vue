<template>
  <div class="app">
    <div class="demo">
      <h1 class="demo-title">
        Vue Guided Tour
      </h1>
      <p>a vue.js 3 component to guide your visitors</p>
      <a 
        href="#"
        class="demo-btn"
        @click.prevent="start"
      >
        Start the tour
      </a>
    </div>
    <div class="demo-grid">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="`step step-${index+1}`"
      />
    </div>
  </div>
  <vue-guided-tour
    ref="vgt"
    v-model:stepIndex="currentStepIndex"
    :steps="steps"
    @afterStart="onAfterStart"
    @afterEnd="onAfterEnd"
    @afterMove="onAfterMove"
  >
    <!--
    <template #content="{ stepIndex }">
      <div>
        step {{ stepIndex }}
      </div>
    </template>
    <template #close="{ onEnd }">
      <button @click="onEnd">
        x
      </button>
    </template>
    <template #nav="{ isFirstStep, isLastStep, onPrev, onNext, onEnd }">
      <button
        v-if="!isFirstStep"
        @click="onPrev"
      >
        Prev
      </button>
      <button
        v-if="isLastStep"
        @click="onEnd"
      >
        End
      </button>
      <button
        v-else
        @click="onNext"
      >
        Next
      </button>
    </template>
    -->
  </vue-guided-tour>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentStepIndex: -1,
      steps: [
        {
          target: '.step-1',
          // padding: 0,
          popover: {
            title: 'Hello world',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
            placement: 'start', // start, end, center
            position: 'right', // top, left, right, bottom
            // offset: 0,
            // arrow: true,
            // autoAdjust: true
          }
        },
        {
          target: '.step-2',
          popover: {
            title: 'Hello world 2',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
            placement: 'end',
            position: 'right',
          }
        },
        {
          target: '.step-3',
          popover: {
            title: '',
            content: 'Hello world 3',
            placement: 'center',
            position: 'left',
          }
        },
        {
          target: '.step-4',
          popover: {
            content: "Hello world 4",
            placement: 'center',
            position: 'top',
          }
        },
        {
          target: '.step-5',
          popover: {
            content: 'Hello world 5',
            placement: 'start',
            position: 'left',
          }
        },
        {
          target: '.step-6',
          popover: {
            content: 'Hello world 6',
            placement: 'center',
            position: 'right',
          }
        },
        {
          target: '.step-7',
          popover: {
            content: 'Hello world 7',
            placement: 'center',
            position: 'left',
          }
        },
      ]
    }
  },
  methods: {
    start() {
      this.$refs.vgt.onStart(0)
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
    }
  }
}
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
  grid-row: 1/4
}
.step-2 {
  grid-column: 2 / 4
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
