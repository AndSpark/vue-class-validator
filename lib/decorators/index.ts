import { validate } from 'class-validator'

export function Reactive() {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			[x: string]: any
			constructor(...args: any[]) {
				super(...args)
				validate(this).then(res => {
					this.__innerErrors = this.formatValidationError(res)
				})
				return this.toReactive?.() || this
			}
		}
	}
}
