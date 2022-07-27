import { defineComponent, getCurrentInstance, isReactive } from 'vue-demi'
import { Field } from './Field'
import { CreateUserForm } from './form'

const btn =
	'px-4 py-1 text-sm text-blue-600  mx-2 rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'

export default defineComponent({
	setup() {
		// const { form, errors, validateForm, clearError, toInit, isValid } = useValidator(CreateUserForm)
		const form = new CreateUserForm()
		const err = form.__errors
		getCurrentInstance()!.data = { form }

		return () => (
			<div class='container mx-auto w-1/2'>
				<Field label='用户名' v-model={form.username} error={err.username}></Field>
				<Field label='姓名' v-model={form.profile.realName} error={err.profile?.realName}></Field>
				<Field
					label='简介'
					v-model={form.profile.description.description}
					error={err.profile?.description?.description}
				></Field>
				<Field label='邮箱' v-model={form.email} error={err.email}></Field>
				<Field label='手机' v-model={form.phone} error={err.phone}></Field>
				<Field label='密码' v-model={form.password} error={err.password}></Field>
				<p>{form.__isValid ? '验证通过' : '验证不通过'}</p>
				<div>
					<button class={btn} onClick={() => form.validate()}>
						验证
					</button>
					<button class={btn} onClick={() => form.clearError()}>
						清除错误
					</button>
					<button class={btn} onClick={() => form.toInit()}>
						初始化
					</button>
				</div>
			</div>
		)
	}
})
