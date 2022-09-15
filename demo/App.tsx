import { Field } from './Field'
import { CreateUserForm } from './form'
import { Component, Mut, VueComponent } from 'vue3-oop'
import { Validate } from '../lib'

const btn =
	'px-4 py-1 text-sm text-blue-600  mx-2 rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'

@Component()
export default class Index extends VueComponent {
	formData: CreateUserForm = new CreateUserForm()

	@Validate('formData')
	submit() {}

	render() {
		const err = this.formData.__errors
		return (
			<div class='container  mx-auto w-1/2'>
				<Field label='用户名' v-model={this.formData.username} error={err.username}></Field>
				<Field
					label='姓名'
					v-model={this.formData.profile.realName}
					error={err.profile?.realName}
				></Field>
				<Field
					label='简介'
					v-model={this.formData.profile.description.description}
					error={err.profile?.description?.description}
				></Field>
				<Field label='邮箱' v-model={this.formData.email} error={err.email}></Field>
				<Field label='手机' v-model={this.formData.phone} error={err.phone}></Field>
				<Field label='密码' v-model={this.formData.password} error={err.password}></Field>
				<p>{this.formData.__isValid ? '验证通过' : '验证不通过'}</p>
				<div>
					<button class={btn} onClick={() => this.submit()}>
						验证
					</button>
					<button class={btn} onClick={() => this.formData.clearError()}>
						清除错误
					</button>
					<button class={btn} onClick={() => this.formData.toInit()}>
						初始化
					</button>
				</div>
			</div>
		)
	}
}
