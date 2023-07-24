import React, { useState } from 'react'
import Router from 'next/router'
import AuthLayout from '~/common/components/Auth/Layout'
import { ShowNoti } from '~/common/utils'
import { accountApi } from '~/api/user/user'
import { Form, Input, Spin } from 'antd'

function ResetPasswordPage() {
	const [form] = Form.useForm()

	const [textError, setTextError] = useState('')
	const [loading, setLoading] = useState(false)

	const postForgot = async (params) => {
		setLoading(true)
		try {
			const response = await accountApi.resetPassword(params)
			if (response.status === 200) {
				ShowNoti('success', 'Thành công, vui lòng đăng nhập!')
				Router.replace('/signin')
			}
		} catch (error) {
			ShowNoti('error', error?.message)
			setTextError(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function _submit(params) {
		const SUBMIT_DATA = { ...params, Key: Router.query?.key }
		console.log('SUBMIT DATA: ', SUBMIT_DATA)
		postForgot(SUBMIT_DATA)
	}

	return (
		<>
			<div className="w-full scrollable login-forms">
				<Form layout="vertical" form={form} onFinish={_submit} className="w-100 login-form center-column ">
					<img className="logo-register" src="/white-logo.png" alt="" />

					<h6 className="mt-5 mb-3 login-title">Lấy lại mật khẩu</h6>

					<Form.Item label="Mật khẩu mới" name="NewPassword" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
						<Input.Password
							className="input"
							type="password"
							prefix={<i className="fa fa-lock" aria-hidden="true" />}
							placeholder="Nhập mật khẩu"
						/>
					</Form.Item>

					<Form.Item label="Nhập lại mật khẩu" name="ConfirmNewPassword" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
						<Input.Password
							className="input"
							type="password"
							prefix={<i className="fa fa-lock" aria-hidden="true" />}
							placeholder="Nhập lại mật khẩu"
						/>
					</Form.Item>

					{!!textError && <div className="error-text response">{textError}</div>}

					<button disabled={loading} className="btn-login mt-4" type="submit">
						Gửi thông tin {loading && <Spin className="loading-white" />}
					</button>

					<div className="mt-4 register">
						Quay lại trang <a href="/signin">Đăng nhập</a>
					</div>
				</Form>
			</div>
		</>
	)
}

ResetPasswordPage.Layout = AuthLayout
export default ResetPasswordPage
