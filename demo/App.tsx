import { defineComponent, SetupContext, computed } from 'vue-demi'
import { useValidator } from '../lib/hooks/useValidator'
// import { CreateUserForm, Profile } from './form'
import { CreateUserForm, Profile } from './form2'

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
		// const form = new CreateUserForm()

		const { form, errors, validate } = useValidator(CreateUserForm)

		const add = () => {
			form.profiles.push(new Profile())
		}

		return () => (
			<div>
				<field label='用户名' v-model={form.username} error={errors.username}></field>
				{form.profiles.map((v, i) => (
					<field label='姓名' v-model={v.realName} error={errors.profiles?.[i]?.realName}></field>
				))}
				<field label='邮箱' v-model={form.email} error={errors.email}></field>
				<field label='手机' v-model={form.phone} error={errors.phone}></field>
				<field label='密码' v-model={form.password} error={errors.password}></field>
				<button onClick={() => validate()}>验证</button>
				<button onClick={() => add()}>添加</button>
				{/* <button onClick={() => form.clearError()}>清空错误</button> */}
				{/* <field label='用户名' v-model={form.username} error={form.getError().username}></field>
				{form.profiles.map((v, i) => (
					<field
						label='姓名'
						v-model={v.realName}
						error={form.getError().profiles?.[i]?.realName}
					></field>
				))}
				<field label='邮箱' v-model={form.email} error={form.getError().email}></field>
				<field label='手机' v-model={form.phone} error={form.getError().phone}></field>
				<field label='密码' v-model={form.password} error={form.getError().password}></field>
				<button onClick={() => form.validate()}>验证</button>
				<button onClick={() => this.add()}>添加</button>
				<button onClick={() => form.clearError()}>清空错误</button> */}
			</div>
		)
	}
})
