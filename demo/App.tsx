import { defineComponent, SetupContext, computed } from 'vue-demi'
import { useValidator } from '../lib'
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
				<span style='margin-right:0.5rem'>{props.label}</span>
				<input v-model={value.value}></input>
				{!!props.error && <span>错误提示: {props.error}</span>}
			</p>
		</div>
	)
}

export default defineComponent({
	setup() {
		const { form, errors, validateForm, clearError, toInit, toJSON } = useValidator(CreateUserForm)
		const add = () => form.profiles.push(new Profile())
		const del = () => form.profiles.shift()
		const toJson = () => console.log(toJSON())
		return () => (
			<div class='container'>
				<field label='用户名' v-model={form.username} error={errors.username}></field>
				{form.profiles.map((v, i) => (
					<>
						<field
							label='姓名'
							v-model={v.realName}
							error={errors.profiles?.[i]?.description}
						></field>
						<field
							label='描述'
							v-model={v.description}
							error={errors.profiles?.[i]?.description}
						></field>
					</>
				))}
				<field label='邮箱' v-model={form.email} error={errors.email}></field>
				<field label='手机' v-model={form.phone} error={errors.phone}></field>
				<field label='密码' v-model={form.password} error={errors.password}></field>
				<div>
					<button onClick={() => validateForm()}>验证</button>
					<button onClick={() => add()}>添加</button>
					<button onClick={() => del()}>移除</button>
					<button onClick={() => clearError()}>取消验证</button>
					<button onClick={() => toInit()}>初始化</button>
					<button onClick={() => toJson()}>toJSON</button>
				</div>
			</div>
		)
	}
})

// export default defineComponent({
// 	setup() {
// 		const form = new CreateUserForm1()
// 		return () => (
// 			<div>
// 				<field label='用户名' v-model={form.username} error={form.getError().username}></field>
// 				{form.profiles.map((v, i) => (
// 					<field
// 						label='姓名'
// 						v-model={v.realName}
// 						error={form.getError().profiles?.[i]?.realName}
// 					></field>
// 				))}
// 				<field label='邮箱' v-model={form.email} error={form.getError().email}></field>
// 				<field label='手机' v-model={form.phone} error={form.getError().phone}></field>
// 				<field label='密码' v-model={form.password} error={form.getError().password}></field>
// 				<button onClick={() => form.validate()}>验证</button>
// 				<button onClick={() => form.clearError()}>清空错误</button>
// 			</div>
// 		)
// 	},
// })
