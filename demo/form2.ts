import { Type } from 'class-transformer'
import {
	isEmail,
	IsEmail,
	isMobilePhone,
	IsMobilePhone,
	IsOptional,
	length,
	Length,
	MaxLength,
	MinLength,
	ValidateIf,
	ValidateNested
} from 'class-validator'
import 'reflect-metadata'
import { api, InjectUsername } from './utils'

export class Profile {
	@IsOptional()
	avatar?: string

	@Length(2, 4, {
		message: '姓名长度应在2到4间'
	})
	realName: string

	@Length(4, 12, {
		message: '长度应在4到12间'
	})
	@IsOptional()
	description?: string
}

export class CreateUserForm {
	@InjectUsername()
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

	@Type(() => Profile)
	@ValidateNested()
	profiles: Profile[] = []

	@Type(() => Profile)
	@ValidateNested()
	profile: Profile = new Profile()
}
