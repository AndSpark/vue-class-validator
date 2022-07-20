import { defineComponent } from 'vue-demi'
import { useValidator } from '../lib'
import { Field } from './Field'
import { CreateUserForm } from './form'
import { useInject } from './utils'

const btn =
	'px-4 py-1 text-sm text-blue-600  mx-2 rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'

export default defineComponent({
	setup() {
		// const { form, errors, validateForm, clearError, toInit, isValid } = useValidator(CreateUserForm)
		const form = new CreateUserForm()
		// 注意在setup中写不能直接用 const err = form.__errors ，在setup返回的函数直接使用err
		// 直接使用err的话，setup返回的函数使用的是err的内存地址，一旦form.__errors被重新赋值，err是没有变化的
		// 在render函数中可以使用 const err = this.form.__errors,因为每次渲染都会访问一遍form.__errors
		return () => (
			<div class='container mx-auto w-1/2'>
				<Field label='用户名' v-model={form.username} error={form.__errors.username}></Field>
				<Field
					label='姓名'
					v-model={form.profile.realName}
					error={form.__errors.profile?.realName}
				></Field>
				<Field label='邮箱' v-model={form.email} error={form.__errors.email}></Field>
				<Field label='手机' v-model={form.phone} error={form.__errors.phone}></Field>
				<Field label='密码' v-model={form.password} error={form.__errors.password}></Field>
				<p>{form.__isValid ? '验证通过' : '验证不通过'}</p>
				<div>
					<button class={btn} onClick={() => form.validate()}>
						验证
					</button>
					{/* <button class={btn} onClick={() => clearError()}>
						清除错误
					</button>
					<button class={btn} onClick={() => toInit()}>
						初始化
					</button> */}
				</div>
			</div>
		)
	}
})
