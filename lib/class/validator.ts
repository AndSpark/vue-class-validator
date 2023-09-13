import { computed, isReactive, reactive, ref, watch } from 'vue-demi'
import { validate, ValidationError } from 'class-validator'
import { instanceToPlain } from 'class-transformer'
import Differ from '@netilon/differify'
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

const differify = new Differ()

export abstract class Validator {
	private __stopWatch: boolean = false
	// 全部的错误
	private __innerErrors: ValidatorError<this> = {}
	// 显示的错误
	public __errors: ValidatorError<this> = reactive({})
	public __isValid = false

	constructor() {
		if (isReactive(this)) {
			watch(
				computed(() => JSON.parse(JSON.stringify(this))),
				(val, oldVal) => {
					if (this.__stopWatch) return
					this.diff(oldVal, val)
					this.checkValid()
				},
				{
					deep: true,
				}
			)
		}
	}

	public async validate() {
		const result = await validate(this)
		const errors = this.formatValidationError(result)
		this.setError(errors)
		this.checkValid()
		return this.__isValid
	}

	public toPlain() {
		const obj = instanceToPlain(this)
		delete obj.__errors
		delete obj.__stopWatch
		delete obj.__isValid
		delete obj.__innerErrors
		return obj as ValidatorJSON<this>
	}

	public toReactive() {
		if (isReactive(this)) return this
		const form = reactive(this)
		watch(
			computed(() => JSON.parse(JSON.stringify(form))),
			(val, oldVal) => {
				if (this.__stopWatch) return
				this.diff(oldVal, val)
				this.checkValid()
			},
			{
				deep: true,
			}
		)
		return form
	}

	public toInit() {
		this.__stopWatch = true
		const proto = Object.getPrototypeOf(this)
		const form = new proto.constructor()
		for (const key in form) {
			if (['__errors', '__isValid', '__innerErrors'].includes(key)) continue
			this[key] = form[key]
		}
		this.__isValid = false
		setTimeout(() => {
			this.clearError()
			this.__stopWatch = false
		})
	}

	public clearError() {
		for (const key in this.__errors) {
			delete this.__errors[key]
		}
	}

	private setError(error) {
		this.__innerErrors = { ...error }
		for (const key in this.__errors) {
			delete this.__errors[key]
		}
		Object.assign(this.__errors, error)
	}

	private checkValid() {
		if (Object.values(this.__innerErrors).filter(v => v !== undefined).length) {
			this.__isValid = false
		} else {
			this.__isValid = true
		}
	}

	private async diff(oldVal, val) {
		const result = await validate(this)
		const errors = this.formatValidationError(result)
		this.__innerErrors = errors
		const res = differify.compare(oldVal, val)
		if (res.status === 'MODIFIED') {
			let _s = res._
			const changeKeys: string[][] = []
			const _keys: string[][] = []
			let _key: string[] = []
			;['__errors', '__isValid', '__innerErrors'].forEach(v => {
				delete _s![v]
			})
			do {
				for (const key in _s) {
					if (_s[key].status === 'EQUAL') continue
					if (_s[key]._ === undefined) {
						changeKeys.push([..._key, key])
					} else {
						_keys.push([..._key, key])
					}
				}
				_key = _keys.pop() || []
				_s = _key.length ? _key.reduce((p, c) => p![c]._, res._) : null
			} while (_s)

			changeKeys.forEach(key => {
				key.reduce(
					(p, c, i) => {
						if (p[0][c] === undefined && i !== key.length - 1) p[0][c] = {}
						if (p[1][c] === undefined && i !== key.length - 1) p[1][c] = {}
						if (i === key.length - 1) {
							p[1][c] = p[0][c]
						}
						return [p[0][c], p[1][c]]
					},
					[errors, this.__errors]
				)
			})

			this.clearNotExistError()
		}
	}

	private clearNotExistError(k?: string) {
		const target = k ? this.__errors[k] : this.__errors
		for (const key in target) {
			if (this.__innerErrors[key] === undefined) {
				delete target[key]
			}
			if (typeof target[key] === 'object') {
				this.clearNotExistError(target[key])
			}
		}
	}

	private formatValidationError(validationErrors: ValidationError[]) {
		let errors: Record<string, any> = {}
		for (const error of validationErrors) {
			if (error.children?.length) {
				const err = this.formatValidationError(error.children)
				errors[error.property] = err
			} else {
				for (const key in error.constraints) {
					const msg = error.constraints[key]
					errors[error.property] = msg
				}
			}
		}
		return errors
	}
}
