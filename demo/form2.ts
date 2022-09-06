import {
	IsEmail,
	isMobilePhone,
	IsMobilePhone,
	Length,
	MaxLength,
	MinLength,
	ValidateIf,
} from 'class-validator'
import { Validator } from '../lib'

abstract class baseCreateUserForm {
	username: string
	password: string
	email: string
	phone: string
}

class CreateUserForm extends Validator {
	@Length(4, 12, { message: '用户名长度应在4到12间' })
	username: string

	@ValidateIf(o => !isMobilePhone(o.phone, 'zh-CN'))
	@IsEmail({}, { message: '请填写正确的邮箱' })
	email: string

	@IsMobilePhone('zh-CN', null, { message: '请输入正确的手机号码' })
	phone: string

	@MinLength(4, { message: '密码长度不应低于4' })
	@MaxLength(12, { message: '密码长度不应大于12' })
	password: string
}
