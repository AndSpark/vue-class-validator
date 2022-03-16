import { Exclude, instanceToPlain } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { toRef, watch } from 'vue-demi'

const ERROR = Symbol('error')
const IS_VALID = Symbol('isValid')

export default abstract class Validator {
	private [ERROR]: Record<string, any> = {}
	private [IS_VALID]: boolean = false

	@Exclude()
	public getErrors(): Record<string, any> {
		return this[ERROR]
	}

	@Exclude()
	public isValid() {
		return this[IS_VALID]
	}

	@Exclude()
	public toJSON() {
		return instanceToPlain(this)
	}

	@Exclude()
	public async validateModel() {
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

	@Exclude()
	public clearError() {
		this[ERROR] = {}
	}

	@Exclude()
	private setError(result: ValidationError[]): Record<string, any> {
		let propBag: Record<string, any> = {}
		if (result) {
			for (const error of result) {
				if (error.children?.length) {
					const errors = this.setError(error.children)
					propBag[error.property] = errors
				} else {
					for (const key in error.constraints) {
						if (Object.prototype.hasOwnProperty.call(error.constraints, key)) {
							const msg = error.constraints[key]
							propBag[error.property] = msg
						}
					}
				}
			}
		}

		return propBag
	}

	@Exclude()
	private watchFields(parentKeys?: string[]) {
		let target = this
		if (parentKeys) {
			target = parentKeys.reduce((p, c, i) => {
				if (!p[c]) {
					p[c] = {}
				}
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
								if (p && p[c]) {
									return p[c]
								} else {
									return null
								}
							}, errors)
							parentKeys.reduce((p, c, i) => {
								if (!p[c]) {
									p[c] = {}
								}
								if (i === parentKeys.length - 1) {
									if (error && error[key]) {
										p[c][key] = error[key]
									} else {
										p[c][key] = null
									}
								}
								return p[c]
							}, this[ERROR])
						} else {
							if (errors[key]) {
								this[ERROR][key] = errors[key]
							} else {
								this[ERROR][key] = null
							}
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
