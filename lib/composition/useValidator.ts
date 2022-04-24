import { ClassConstructor, instanceToPlain } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue-demi'

type Errors<T> = {
	[x in keyof T]?: T[x] extends PropertyKey ? string : Errors2<T[x]>
}
type Errors2<T> = {
	[x in keyof T]: T[x] extends PropertyKey
		? string | undefined
		: T[x] extends Function
		? T[x]
		: Errors2<T[x]> | undefined
}

type ToJSON<T> = {
	[x in keyof T]: keyof T extends PropertyKey ? T[x] : ToJSON<T[x]>
}

type JSONValue = string | number | boolean | JSONObject | JSONArray

interface JSONObject {
	[x: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}

export function useValidator<T extends object>(constructor: ClassConstructor<T>) {
	const isValid = ref(false)
	const originForm = new constructor()
	const errors = reactive<Errors<T>>(initErrors(originForm))
	const errorMessage = computed(() => {
		return createErrorMsg(errors)
	})
	const form = reactive(originForm)
	const toJSON = () => instanceToPlain(originForm) as ToJSON<T>
	let pauseWatch = false
	const toInit = () => {
		pauseWatch = true
		// 重新初始化时会触发watch的表单验证，由于是异步，所以需要setTimeout暂停watch
		setTimeout(() => (pauseWatch = false))
		clearError()
		const f = new constructor()
		for (const key in form) {
			//@ts-ignore
			form[key] = f[key]
		}
	}
	const stopWatch = watch(
		computed(() => instanceToPlain(form)),
		async (val, oldVal) => {
			if (pauseWatch) return
			let result = await validate(form)
			const err = gerErrors(result)
			const keys = diff(val, oldVal)
			setError(errors, keys, err)
			if (result.length) {
				isValid.value = false
			} else {
				isValid.value = true
			}
			console.log(result)
		},
		{ deep: true }
	)
	onBeforeUnmount(() => {
		stopWatch()
	})
	async function validateForm() {
		let result = await validate(form)
		const err = gerErrors(result)
		for (const key in err) {
			errors[key] = err[key]
		}
		for (const key in errors) {
			errors[key] = err[key]
		}
	}
	function clearError() {
		for (const key in errors) {
			delete errors[key]
		}
	}
	return {
		form,
		errors,
		errorMessage,
		validateForm,
		stopWatch,
		isValid,
		toJSON,
		toInit,
		clearError
	}
}

function gerErrors(result: ValidationError[]): Record<string, any> {
	let propBag: Record<string, any> = {}
	if (result) {
		for (const error of result) {
			if (error.children?.length) {
				const errors = gerErrors(error.children)
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

function setError(target: any, keys: any, errors: any) {
	for (const key in keys) {
		if (keys[key]) {
			if (errors && errors[key]) {
				if (!target[key]) target[key] = {}
				setError(target[key], keys[key], errors[key])
			} else {
				target[key] = null
			}
		} else {
			target[key] = errors[key]
		}
	}
}

function diff<T = JSONArray | JSONObject>(data: T, oldData: T) {
	const keys: Record<string, any> = {}
	let target
	if ((Array.isArray(data) && data.length) || (data && Object.keys(data).length)) {
		target = data
	} else if (oldData) {
		target = oldData
	}

	if (!target) return keys

	for (const key in target) {
		if (typeof data[key] !== 'object' || data[key] === null) {
			if (oldData && data[key] !== oldData[key]) {
				keys[key] = null
			}
		} else {
			const childKeys = diff(data[key], oldData[key])
			if (Object.keys(childKeys).length) {
				keys[key] = childKeys
			}
		}
	}
	return keys
}

function initErrors(target: any): any {
	const errors: Record<string, any> = {}
	for (const key in target) {
		if (typeof target[key] !== 'object') {
			errors[key] = null
		} else {
			const childErrors = initErrors(target[key])
			if (Object.keys(childErrors).length) {
				errors[key] = childErrors
			}
		}
	}
	return errors
}

function createErrorMsg(errors: any) {
	for (const key in errors) {
		if (typeof errors[key] !== 'object') {
			if (errors[key]) {
				return errors[key]
			}
		} else {
			const childErrors = createErrorMsg(errors[key])
			return childErrors
		}
	}
}
