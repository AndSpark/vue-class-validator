import { SetupContext, computed } from 'vue-demi'

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
		<div class='relative flex items-center pb-5'>
			<span class='w-16'>{props.label}</span>
			<input
				class={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500`}
				v-model={value.value}
			></input>
			{!!props.error && (
				<span class='text-xs text-red-500 absolute right-2 bottom-0'>错误提示: {props.error}</span>
			)}
		</div>
	)
}
