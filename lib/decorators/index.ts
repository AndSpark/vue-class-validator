import { reactive, watch } from 'vue-demi'

export function Reactive() {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			[x: string]: any
			constructor(...args: any[]) {
				super(...args)
				return this.toReactive?.() || this
			}
		}
	}
}
