import { reactive } from 'vue-demi'

export default function Reactive() {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			[x: string]: any
			constructor(...args: any[]) {
				super(...args)
				if (this.watchFields) {
					this.watchFields()
				}
				return reactive(this)
			}
		}
	}
}
