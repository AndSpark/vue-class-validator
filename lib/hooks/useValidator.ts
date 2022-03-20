import { ClassConstructor, instanceToPlain } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import Validator from '../validator'

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

export function useValidator<T extends object>(constructor: ClassConstructor<T>) {
	const errors = reactive<Errors<T>>({})
	const isValid = ref(false)
	const originForm = new constructor()
	const form = reactive(originForm)
	const toJSON = () => instanceToPlain(originForm) as ToJSON<T>
	const validate = () => validateForm(originForm, errors)
	const stopWatch = watch(
		computed(() => instanceToPlain(form)),
		(val, oldVal) => {
			console.log(val, oldVal)
		},
		{ deep: true }
	)
	onBeforeUnmount(() => {
		stopWatch()
	})
	return {
		form,
		isValid,
		validate,
		toJSON,
		errors
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

async function validateForm(form, errors) {
	let result = await validate(form)
	const err = gerErrors(result)
	for (const key in err) {
		errors[key] = err[key]
	}
	for (const key in errors) {
		errors[key] = err[key]
	}
}

const toType = (data: any) => Object.prototype.toString.call(data).replace(/\[object |\]/g, '')

function diff<T = object | any[]>(data: T, oldData: T) {
	const keys = {}
	const type = toType(data)
	if (type === 'Object') {
	}
	if (type === 'Array') {
	}
}
