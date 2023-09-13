# vue-class-validator

一个基于 class-validator 的类表单验证[库](https://github.com/AndSpark/vue-class-validator)

## 介绍

这是一个通过 TS 装饰器在 Vue 中来实现表单验证的库
通过类来写表单，使用装饰器来设置表单验证方式
相比于正常的表单与验证分离的写法，通过装饰墙，阅读表单代码时能同时看到验证规则，使代码更易读，清晰

## 安装

```bash
npm install vue-class-validator class-validator class-transformer reflect-metadata
```

## 示例

下面是一段表单代码，利用 class-validator 来做验证

```ts
class Profile {
	@Length(2, 4, { message: '姓名长度应在2到4间' })
	realName: string

	@IsOptional()
	description?: string
}

class CreateUserForm {
	@Length(4, 12, { message: '用户名长度应在4到12间' })
	username: string = ''

	@ValidateIf(o => !isMobilePhone(o.phone))
	@IsEmail({}, { message: '请填写正确的邮箱' })
	email: string = ''

	@IsMobilePhone('zh-CN', null, { message: '请输入正确的手机号码' })
	phone: string = ''

	@MinLength(4, { message: '密码长度不应低于4' })
	@MaxLength(12, { message: '密码长度不应大于12' })
	password: string = ''

	// 用来关联表单校验
	@Type(() => Profile)
	@ValidateNested()
	profile: Profile = new Profile()
}
```

下面是在 vue 中使用的方法

```tsx
export default defineComponent({
	setup() {
		const { form, errors, validateForm, clearError, toInit, isValid } = useValidator(CreateUserForm)
		return () => (
			<div class='container'>
				<field label='用户名' v-model={form.username} error={errors.username}></field>
				<field label='邮箱' v-model={form.email} error={errors.email}></field>
				<field label='手机' v-model={form.phone} error={errors.phone}></field>
				<field label='密码' v-model={form.password} error={errors.password}></field>
				<field
					label='姓名'
					v-model={form.profile.realName}
					error={errors.profile?.realName}
				></field>
				<div>
					<button onClick={() => validateForm()}>验证</button>
					<button onClick={() => clearError()}>清除错误</button>
					<button onClick={() => toInit()}>初始化</button>
				</div>
				<p>{isValid.value ? '验证通过' : '验证不通过'}</p>
			</div>
		)
	},
})
```
