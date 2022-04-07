import { defineComponent, h, reactive } from 'vue'
import { useValidator } from '..'

export function Component(component: any, props: Record<string, any> = {}) {
	return function (target: any, key: string) {
		return Reflect.defineMetadata('component', { component, props }, target, key)
	}
}

export function useComponent<T extends { new (...args: any[]): any }>(constructor: T) {
	const { form, errors, validateForm, clearError, toInit, toJSON } = useValidator(constructor)

	const list: any = {}
	for (const key in form) {
		if (Object.prototype.hasOwnProperty.call(form, key)) {
			const info = Reflect.getMetadata('component', form, key)
			if (info) {
				list[key] = info
			}
		}
	}

	const component = defineComponent({
		name: 'aaa',
		setup() {
			return () =>
				h('div', null, [
					Object.entries(list).map(([key, v]: [string, any]) => {
						return h(v.component, {
							modelValue: form[key],
							'onUpdate:modelValue': (value: any) => {
								form[key] = value
							},
							error: errors[key],
							...v.props
						})
					})
				])
		}
	})

	return {
		form,
		errors,
		validateForm,
		clearError,
		toInit,
		toJSON,
		component
	}
}
