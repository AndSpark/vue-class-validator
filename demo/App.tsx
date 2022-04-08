import { defineComponent, SetupContext, computed } from 'vue-demi'
import { useValidator } from '../lib'
import { useComponent } from '../lib/composition/useComponent'
import { CreateUserForm, Profile } from './form'
import { useInject } from './utils'

export default defineComponent({
	setup() {
		const {
			form,
			validateForm,
			clearError,
			toInit,
			isValid,
			component: userForm
		} = useComponent(CreateUserForm)

		useInject(form)
		return () => (
			<div class='container'>
				<userForm></userForm>
				<p>{isValid.value ? '验证通过' : '验证不通过'}</p>
				<div>
					<button onClick={() => validateForm()}>验证</button>
					<button onClick={() => clearError()}>清除错误</button>
					<button onClick={() => toInit()}>初始化</button>
				</div>
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
