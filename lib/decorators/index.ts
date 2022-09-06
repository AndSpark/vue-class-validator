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

export function Validate(
	name: string = 'formData',
	format?: (error: Record<string, any>) => string
) {
	return function (target: any, key: string, descriptor: PropertyDescriptor) {
		const fn = descriptor.value
		descriptor.value = async function (...args: any) {
			const bindFn = fn.bind(this, ...args)
			await this[name].validate()
			if (!this[name].__isValid) {
				if (format) {
					throw new Error(format(this[name].__errors))
				}
				throw new Error(JSON.stringify(Object.values(this[name].__errors)))
			}
			try {
				await bindFn()
			} catch (error) {
				return Promise.reject(error)
			}
		}
	}
}
