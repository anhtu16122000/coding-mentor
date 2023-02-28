import React, { useState } from 'react'
import AuthLayout from '~/common/components/Auth/Layout'
import { ShowNoti } from '~/common/utils'
import { accountApi } from '~/api/user'
import { Form, Input, Spin } from 'antd'

function ForgotPasswordPage() {
	const [form] = Form.useForm()

	const [step, setStep] = useState(1)
	const [textError, setTextError] = useState('')
	const [loading, setLoading] = useState(false)

	const postForgot = async (params) => {
		setLoading(true)
		try {
			const response = await accountApi.forgotPassword(params)
			if (response.status === 200) {
				setStep(2)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
			setTextError(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function _submit(params) {
		console.log('SUBMIT DATA: ', params)
		postForgot(params)
	}

	return (
		<>
			<div className="w-full scrollable">
				<Form form={form} onFinish={_submit} className="w-100 ">
					<div className="login-forms">
						<div className="login-form">
							<img className="logo-login" src="/images/logo-2.jpg" alt="" />

							<h6 className="mt-5 mb-3 login-title">Lấy lại mật khẩu</h6>

							{step == 1 && (
								<>
									<label>Tên đăng nhập</label>
									<Form.Item name="UserName" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
										<Input className="input" placeholder="" prefix={<i className="fa fa-user" aria-hidden="true" />} />
									</Form.Item>

									{!!textError && <div className="error-text response">{textError}</div>}

									<button disabled={loading} className="btn-login mt-4" type="submit">
										Gửi thông tin {loading && <Spin className="loading-white" />}
									</button>

									<div className="mt-4 register">
										Bạn đã nhớ ra mật khẩu? <a href="/login">Đăng nhập</a>
									</div>
								</>
							)}

							{step == 2 && (
								<>
									<div className="text-[red] text-16-600">Vui lòng kiểm tra Email để tạo mật khẩu mới!</div>
									<div className="mt-4 register">
										Quay lại <a href="/login">Đăng nhập</a>
									</div>
								</>
							)}
						</div>
					</div>
				</Form>
			</div>
		</>
	)
}

ForgotPasswordPage.Layout = AuthLayout
export default ForgotPasswordPage
