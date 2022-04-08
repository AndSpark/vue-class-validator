import { defineComponent, h, reactive } from 'vue'
import { useValidator } from '..'

export function Component(component: any, props: Record<string, any> = {}) {
	return function (target: any, key: string) {
		return Reflect.defineMetadata('component', { component, props }, target, key)
	}
}

export function ComponentNested<T extends { new (...args: any[]): any }>(constructor: T) {
	return function (target: any, key: string) {
		return Reflect.defineMetadata('componentNested', constructor, target, key)
	}
}

export function useComponent<T extends { new (...args: any[]): any }>(constructor: T) {
	const { form, errors, validateForm, clearError, toInit, toJSON, isValid } =
		useValidator(constructor)

	const list = getFormComponent(form)

	const component = defineComponent({
		name: constructor.name,
		setup() {
			return () => createFormComponent(list, form, errors)
		}
	})

	return {
		form,
		errors,
		validateForm,
		clearError,
		toInit,
		toJSON,
		isValid,
		component
	}
}

function getFormComponent(form) {
	const componentList: Record<string, any> = {}
	for (const key in form) {
		if (Object.prototype.hasOwnProperty.call(form, key)) {
			const info = Reflect.getMetadata('component', form, key)
			const componentNested = Reflect.getMetadata('componentNested', form, key)
			if (componentNested) {
				componentList[key] = getFormComponent(form[key])
			}
			if (info) {
				componentList[key] = info
			}
		}
	}
	return componentList
}

function createFormComponent(componentList, form, errors) {
	return h('div', null, [
		Object.entries(componentList).map(([key, v]: [string, any]) => {
			if (typeof form[key] === 'object') {
				return createFormComponent(componentList[key], form[key], errors[key])
			}
			return h(v.component, {
				modelValue: form[key],
				'onUpdate:modelValue': (value: any) => {
					form[key] = value
				},
				error: errors && errors[key],
				...v.props
			})
		})
	])
}
