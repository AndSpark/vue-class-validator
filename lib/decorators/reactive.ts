import { reactive } from 'vue-demi'

export default function Reactive() {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			[x: string]: any
			constructor(...args: any[]) {
				super(...args)
				let proto = constructor.prototype
				const target = reactive(this)
				while (proto && proto !== Object.prototype) {
					const props = Object.getOwnPropertyNames(proto)
					props.forEach(prop => {
						if (typeof this[prop] === 'function' && prop !== 'constructor') {
							this[prop] = this[prop].bind(target)
						}
					})
					proto = Object.getPrototypeOf(proto)
				}
				if (target.watchFields) {
					target.watchFields()
				}
				return target
			}
		}
	}
}
