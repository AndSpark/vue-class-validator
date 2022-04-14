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
import { Component, ComponentNested } from '../lib/composition/useComponent'
import { field } from './field'
import { api, InjectUsername } from './utils'

export class Profile {
	@Length(2, 4, {
		message: '姓名长度应在2到4间'
	})
	@Component(field, { label: '姓名' })
	realName: string

	@Length(4, 12, {
		message: '长度应在4到12间'
	})
	@IsOptional()
	@Component(field, { label: '描述' })
	description?: string
}

export class CreateUserForm {
	@InjectUsername()
	@Length(4, 12, { message: '用户名长度应在4到12间' })
	@Component(field, { label: '用户名' })
	username: string = '还没有用户名'

	@ValidateIf(o => !isMobilePhone(o.phone))
	@IsEmail({}, { message: '请填写正确的邮箱' })
	@Component(field, { label: '邮箱' })
	email: string = ''

	@IsMobilePhone('zh-CN', null, { message: '请输入正确的手机号码' })
	@Component(field, { label: '手机' })
	phone: string = ''

	@MinLength(4, { message: '密码长度不应低于4' })
	@MaxLength(12, { message: '密码长度不应大于12' })
	@Component(field, { label: '密码' })
	password: string = ''

	@Type(() => Profile)
	@ValidateNested()
	@ComponentNested(Profile)
	profile: Profile = new Profile()
}
