import React from 'react'
import { Input, Spin, Form } from 'antd'

type ILoginForm = {
	csrfToken?: string
	onSubmit: Function
	alloweRegisters?: boolean
	error?: string
	loading?: boolean
}

function LoginForm(props: ILoginForm) {
	const [form] = Form.useForm()

	const _submit = async (data) => {
		props?.onSubmit(data)
	}

	return (
		<Form autoComplete="on" initialValues={{ remember: true }} form={form} onFinish={_submit} className="w-100 login-form center-column">
			<img className="logo-login" src="/images/logo-2.jpg" alt="" />

			<h6 className="mt-5 mb-3 login-title">Đăng nhập</h6>

			<input name="csrfToken" type="hidden" defaultValue={props?.csrfToken} />

			<label>Email</label>

			<Form.Item name="username" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
				<Input className="input" placeholder="Nhập email" prefix={<i className="fa fa-user" aria-hidden="true" />} />
			</Form.Item>

			<div className="wrap-password mt-1">
				<label className="password">Mật khẩu</label>
			</div>

			<Form.Item name="password" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
				<Input.Password
					className="input"
					type="password"
					prefix={<i className="fa fa-lock" aria-hidden="true" />}
					placeholder="Nhập mật khẩu"
				/>
			</Form.Item>

			{!!props?.error && <div className="error-text response">{props?.error}</div>}

			<button className="btn-login mt-4" type="submit">
				Đăng nhập {props.loading && <Spin className="loading-white" />}
			</button>

			{!!props?.alloweRegisters && (
				<div className="mt-4 register">
					Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
				</div>
			)}

			<div className="wrap-password mt-3 w-full flex items-center justify-center">
				<a href="/fogot-password">Quên mật khẩu?</a>
			</div>
		</Form>
	)
}

export default LoginForm
