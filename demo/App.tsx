import { defineComponent } from 'vue-demi'
import { useValidator } from '../lib'
import { useComponent } from '../lib/composition/useComponent'
import { CreateUserForm, Profile } from './form'
import { useInject } from './utils'
const btn =
	'px-4 py-1 text-sm text-blue-600  mx-2 rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'

export default defineComponent({
	setup() {
		const {
			form,
			validateForm,
			clearError,
			toInit,
			isValid,
			component: userForm,
			errorMessage
		} = useComponent(CreateUserForm, true)

		useInject(form)
		return () => (
			<div class='w-[300px] mx-auto mt-10'>
				<userForm></userForm>
				<div class='flex w-full justify-center'>
					<button
						class={btn}
						onClick={async () => {
							await validateForm()
							console.log(errorMessage)
						}}
					>
						验证
					</button>
					<button class={btn} onClick={() => clearError()}>
						清除错误
					</button>
					<button class={btn} onClick={() => toInit()}>
						初始化
					</button>
				</div>
				<p class='mt-2'>{isValid.value ? '验证通过' : '验证不通过'}</p>
			</div>
		)
	}
})

// export default defineComponent({
// 	setup() {
// 		const { form, errors, validateForm, clearError, toInit, isValid } = useValidator(CreateUserForm)

// 		useInject(form)

// 		return () => (
// 			<div class='container'>
// 				<field label='用户名' v-model={form.username} error={errors.username}></field>
// 				<field
// 					label='姓名'
// 					v-model={form.profile.realName}
// 					error={errors.profile?.realName}
// 				></field>
// 				<field label='邮箱' v-model={form.email} error={errors.email}></field>
// 				<field label='手机' v-model={form.phone} error={errors.phone}></field>
// 				<field label='密码' v-model={form.password} error={errors.password}></field>
// 				<p>{isValid.value ? '验证通过' : '验证不通过'}</p>
// 				<div>
// 					<button onClick={() => validateForm()}>验证</button>
// 					<button onClick={() => clearError()}>清除错误</button>
// 					<button onClick={() => toInit()}>初始化</button>
// 				</div>
// 			</div>
// 		)
// 	}
// })
