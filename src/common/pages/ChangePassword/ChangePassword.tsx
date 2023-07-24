import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { accountApi } from '~/api/user/user'
import { Card, Form, Input } from 'antd'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { formRequired } from '~/common/libs/others/form'
import { IoMdMail, IoMdPhonePortrait } from 'react-icons/io'
import { FaUserFriends } from 'react-icons/fa'

import PrimaryButton from '~/common/components/Primary/Button'

const ChangePassword = () => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [textError, setTextError] = useState('')

	const userInformation = useSelector((state: RootState) => state.user.information)

	async function postUpdate(params) {
		setLoading(true)
		try {
			const response = await accountApi.changePassword(params)
			if (response.status === 200) {
				ShowNoti('success', response.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	function onFinish(values) {
		const SUBMIT_DATA = { OldPassword: values.currentPassword, NewPassword: values.password, ConfirmNewPassword: values.confirmPassword }

		console.log('SUBMIT DATA: ', SUBMIT_DATA)

		setTextError('')
		if (values.password.length < 6) {
			setTextError('Mật khẩu phải nhiều hơn 5 ký tự')
			return false
		} else if (values.password !== values.confirmPassword) {
			setTextError('Mật khẩu nhập lại không đúng')
			return false
		} else {
			setTextError('')
			postUpdate(SUBMIT_DATA)
		}
	}

	const getRoleName = () => {
		if (userInformation?.RoleId == 1) {
			return 'Admin'
		}
		if (userInformation?.RoleId == 2) {
			return 'Giáo viên'
		}
		if (userInformation?.RoleId == 3) {
			return 'Học viên'
		}
		return ''
	}

	return (
		<div className="change-password">
			<Card className="cp-container">
				<div className="cp-main">
					<div className="cp-left">
						<Card className="w-full">
							<div className="inline-flex flex-col items-center justify-center w-full">
								<img
									className="w-[60px] h-[60px]"
									src={userInformation?.Avatar ? userInformation.Avatar : '/images/default-avatar.svg'}
									alt="avatar"
								/>
								<div className="mt-3 text-[18px] font-[600]">{userInformation.FullName}</div>
								<div className="w-full h-[1.5px] bg-[#f0f0f0] my-3" />
								<div className="w-full flex-col">
									<div className="flex flex-row items-center">
										<FaUserFriends size={20} />
										<div className="ml-3 text-[14px] font-[400]">{getRoleName()}</div>
									</div>
									<div className="mt-2 flex flex-row items-center">
										<IoMdMail size={20} />
										<span className="ml-3 text-[14px] font-[400]">{userInformation.Email}</span>
									</div>
									<div className="mt-2 flex flex-row items-center">
										<IoMdPhonePortrait size={20} />
										<span className="ml-3 text-[14px] font-[400]">{userInformation.Mobile}</span>
									</div>
								</div>
							</div>
						</Card>
					</div>

					<div className="cp-right">
						<Card title="Thay đổi mật khẩu" className="w-full">
							<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
								<div className="grid grid-cols-4 gap-x-4">
									<Form.Item className="col-span-4" label="Mật khẩu cũ" name="currentPassword" rules={formRequired}>
										<Input.Password disabled={loading} className="primary-input" />
									</Form.Item>
									<Form.Item className="col-span-4" label="Mật khẩu mới" name="password" rules={formRequired}>
										<Input.Password disabled={loading} className="primary-input" />
									</Form.Item>
									<Form.Item className="col-span-4" label="Nhập lại mật khẩu mới" name="confirmPassword" rules={formRequired}>
										<Input.Password disabled={loading} className="primary-input" />
									</Form.Item>
									{!!textError && <div className="error-text response mb-3 col-span-4">{textError}</div>}
									<PrimaryButton loading={loading} className="col-span-4" type="submit" background="blue" icon="save">
										Lưu thay đổi
									</PrimaryButton>
								</div>
							</Form>
						</Card>
					</div>
				</div>
			</Card>
		</div>
	)
}

export default ChangePassword
