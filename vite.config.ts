import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const commonConfig = defineConfig({
  base: '/vue-guided-tour/',
  plugins: [vue()],
})

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      ...commonConfig,
      build: {
        outDir: 'dist',
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'VueGuidedTour',
          fileName: (format) => `vue-guided-tour.${format}.js`,
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            exports: 'named',
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
    }
  } else {
    return {
      ...commonConfig,
      build: {
        outDir: 'demo/dist',
      },
    }
  }
})
