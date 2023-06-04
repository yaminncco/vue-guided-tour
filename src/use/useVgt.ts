import { inject, InjectionKey } from 'vue'
import { Vgt } from '../types'

export const vgtInjectionKey = Symbol('vgt') as InjectionKey<Vgt>

export default function useVgt() {
  const vgt = inject(vgtInjectionKey)
  if (!vgt) {
    throw new Error('[vue-guided-tour]: Did you forget to install the plugin?')
  }
  return vgt
}
