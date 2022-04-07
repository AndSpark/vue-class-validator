import { defineComponent, SetupContext, computed } from 'vue-demi'
import { useValidator } from '../lib'
import { useComponent } from '../lib/composition/useComponent'
import { CreateUserForm, Profile } from './form'
import { useInject } from './utils'

export default defineComponent({
	setup() {
		// const { form, errors, validateForm, clearError, toInit, toJSON } = useValidator(CreateUserForm)
		const {
			form,
			errors,
			validateForm,
			clearError,
			toInit,
			component: formComponent
		} = useComponent(CreateUserForm)

		useInject(form)

		return () => (
			<div class='container'>
				<formComponent></formComponent>
				{/* <field label='用户名' v-model={form.username} error={errors.username}></field>
				<field
					label='姓名'
					v-model={form.profile.realName}
					error={errors.profile?.realName}
				></field>
				<field label='邮箱' v-model={form.email} error={errors.email}></field>
				<field label='手机' v-model={form.phone} error={errors.phone}></field>
				<field label='密码' v-model={form.password} error={errors.password}></field> */}
				<div>
					<button onClick={() => validateForm()}>验证</button>
					<button onClick={() => clearError()}>取消验证</button>
					<button onClick={() => toInit()}>初始化</button>
				</div>
			</div>
		)
	}
})
