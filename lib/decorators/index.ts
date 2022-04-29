import { reactive } from 'vue-demi'

export function Reactive() {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			[x: string]: any
			constructor(...args: any[]) {
				super(...args)
				const target = reactive(this)
				if (target.watchFields) {
					target.watchFields()
				}
				return target
			}
		}
	}
}

export function BeforeValidate() {
	return function (target: any, key: string, descriptor: PropertyDescriptor) {
		Reflect.defineMetadata('hook:beforeValidate', descriptor.value, descriptor.value)
	}
}
