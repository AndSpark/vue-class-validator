import { reactive, watch } from 'vue'
import { validate, ValidationError } from 'class-validator'

export class VueValidator {
	public __errors: Record<string, any> = {}
	public __isValid = false

	constructor() {
		const form = reactive(this)

		return form
	}

	public async validate() {
		const result = await validate(this)
		const errors = VueValidator.formatValidationError(result)
		this.__errors = errors
		return this.__isValid
	}

	static formatValidationError(validationErrors: ValidationError[]) {
		let errors: Record<string, any> = {}
		for (const error of validationErrors) {
			if (error.children?.length) {
				const err = VueValidator.formatValidationError(error.children)
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
