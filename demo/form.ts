import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsDefined,
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
import { Reactive } from '../lib'
import { Validator } from '../lib/'
import { api, InjectUsername } from './utils'

export class Description {
	@Length(4, 12, {
		message: '长度应在4到12间'
	})
	description?: string
}

export class Image {
	name: string

	@IsDefined()
	url: string = '1'
}

export class Profile {
	@Length(2, 4, {
		message: '姓名长度应在2到4间'
	})
	realName: string

	@Type(() => Description)
	@ValidateNested()
	description: Description = new Description()

	@ArrayMinSize(1)
	@ValidateNested()
	images: Image[] = [new Image(), new Image()]
}

@Reactive()
export class CreateUserForm extends Validator {
	@InjectUsername()
	@Length(4, 12, { message: '用户名长度应在4到12间' })
	username: string = '还没有用户名'

	@ValidateIf(o => !isMobilePhone(o.phone, 'zh-CN'))
	@IsEmail({}, { message: '请填写正确的邮箱' })
	email: string = ''

	@IsMobilePhone('zh-CN', null, { message: '请输入正确的手机号码' })
	phone: string = ''

	@MinLength(4, { message: '密码长度不应低于4' })
	@MaxLength(12, { message: '密码长度不应大于12' })
	password: string = ''

	@ValidateNested()
	profile: Profile = new Profile()
}
