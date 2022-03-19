import { instanceToPlain } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { toRef, watch } from 'vue-demi'

const ERROR = Symbol('error')
const IS_VALID = Symbol('isValid')

type ValidatorError<T> = {
	[x in Exclude<keyof T, keyof Validator>]?: T[x] extends PropertyKey
		? string
		: ValidatorRequiredError<T[x]>
}

type ValidatorRequiredError<T> = {
	[x in Exclude<keyof T, keyof Validator>]: T[x] extends PropertyKey
		? string | undefined
		: T[x] extends Function
		? T[x]
		: ValidatorError<T[x]> | undefined
}

type ValidatorJSON<T> = {
	[x in Exclude<keyof T, keyof Validator>]: keyof T extends PropertyKey ? T[x] : ValidatorJSON<T[x]>
}

export default abstract class Validator {
	private [ERROR]: ValidatorError<this> = {}
	private [IS_VALID]: boolean = false

	public getError() {
		return this[ERROR]
	}

	public isValid() {
		return this[IS_VALID]
	}

	public toJSON() {
		return instanceToPlain(this) as ValidatorJSON<this>
	}

	public async validate() {
		let result = await validate(this)
		const errors = this.setError(result)
		for (const key in errors) {
			this[ERROR][key] = errors[key]
		}

		for (const key in this[ERROR]) {
			if (errors[key]) {
				this[ERROR][key] = this[ERROR][key]
			} else {
				delete this[ERROR][key]
			}
		}
	}

	public clearError() {
		this[ERROR] = {}
	}

	private setError(result: ValidationError[]): Record<string, any> {
		let propBag: Record<string, any> = {}
		if (result) {
			for (const error of result) {
				if (error.children?.length) {
					const errors = this.setError(error.children)
					propBag[error.property] = errors
				} else {
					for (const key in error.constraints) {
						const msg = error.constraints[key]
						propBag[error.property] = msg
					}
				}
			}
		}

		return propBag
	}

	private watchFields(parentKeys?: string[]) {
		let target = this
		if (parentKeys) {
			target = parentKeys.reduce((p, c) => {
				if (!p[c]) p[c] = {}
				return p[c]
			}, this)
		}
		for (const key in target) {
			if (Object.prototype.hasOwnProperty.call(target, key)) {
				if (typeof target[key] !== 'object' && typeof target[key] !== 'function') {
					const element = toRef(target, key)
					watch(element, async val => {
						let result = await validate(this)
						const errors = this.setError(result)
						if (parentKeys) {
							const error = parentKeys.reduce((p, c) => {
								if (p && p[c]) return p[c]
								return null
							}, errors)
							parentKeys.reduce((p, c, i) => {
								if (!p[c]) p[c] = {}
								if (i === parentKeys.length - 1) {
									if (error && error[key]) {
										;/[0-9]+/.test(key) ? (p[c] = error) : (p[c][key] = error[key])
									} else {
										;/[0-9]+/.test(key) ? (p[c] = null) : (p[c][key] = null)
									}
								}
								return p[c]
							}, this[ERROR])
						} else {
							//@ts-ignore
							this[ERROR][key] = errors[key]
						}
						this[IS_VALID] = !Object.keys(errors).length ? true : false
					})
				} else if (typeof target[key] === 'object') {
					const keys = parentKeys ? [...parentKeys, key] : [key]
					this.watchFields(keys)
				}
			}
		}
	}
}
