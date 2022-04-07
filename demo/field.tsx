import { SetupContext, computed } from 'vue'

export const field = (
	props: { label: string; modelValue: string; error: string },
	{ emit }: SetupContext
) => {
	const value = computed({
		get() {
			return props.modelValue
		},
		set(val) {
			emit('update:modelValue', val)
		}
	})
	return (
		<div>
			<p>
				<span style='margin-right:0.5rem'>{props.label}</span>
				<input v-model={value.value}></input>
				{!!props.error && <span>错误提示: {props.error}</span>}
			</p>
		</div>
	)
}
