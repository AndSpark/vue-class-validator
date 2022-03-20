import { defineComponent, SetupContext, computed } from 'vue-demi'
import { CreateUserForm } from './form'

const field = (
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
				<span>{props.label}</span>
				<input v-model={value.value}></input>
				{!!props.error && <span>错误提示: {props.error}</span>}
			</p>
		</div>
	)
}

export default defineComponent({
	setup() {
		const form = new CreateUserForm()
		form.getError().profile?.realName
		return {
			form
		}
	},
	render() {
		const { form } = this
		return (
			<div>
				<field label='用户名' v-model={form.username} error={form.getError().username}></field>
				<field
					label='姓名'
					v-model={form.profile.realName}
					error={form.getError().profile?.realName}
				></field>
				<field label='邮箱' v-model={form.email} error={form.getError().email}></field>
				<field label='手机' v-model={form.phone} error={form.getError().phone}></field>
				<field label='密码' v-model={form.password} error={form.getError().password}></field>
				<button onClick={() => form.validate()}>验证</button>
				<button onClick={() => form.clearError()}>清空错误</button>
			</div>
		)
	}
})
