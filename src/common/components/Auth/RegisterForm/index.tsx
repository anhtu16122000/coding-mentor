import { Form, Spin } from 'antd'
import { useState } from 'react'
import { registerApi } from '~/api/user'
import { parseJwt, ShowNoti } from '~/common/utils'
import Router from 'next/router'
import { userApi } from '~/services/auth'
import { useDispatch } from 'react-redux'
import { setUser } from '~/store/userReducer'
import { setAuthData, setAuthLoading } from '~/store/authReducer'
import InputTextField from '~/common/components/FormControl/InputTextField'
import Link from 'next/link'

function RegisterForm(props) {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const dispatch = useDispatch()

	const onLogin = async (data) => {
		try {
			setLoading(true)
			const response = await userApi.login(data)
			if (response.status === 200) {
				const token = response?.data?.token || ''
				const user = parseJwt(token) || ''
				const userData = { token: token, user: user }

				await localStorage.setItem('userData', JSON.stringify(userData))
				await localStorage.setItem('token', token)

				dispatch(setUser(user))
				dispatch(setAuthData(user))
				dispatch(setAuthLoading(false))

				Router.replace('/')
			}
		} catch (error) {
			console.log('Login Error: ', error)
		} finally {
			setLoading(false)
		}
	}

	const onRegister = async (params) => {
		setLoading(true)
		try {
			const response = await registerApi.register(params)
			if (response.status == 200) {
				onLogin({ username: response.data.data?.UserName, password: params?.Password })
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Form autoComplete="on" form={form} onFinish={onRegister} className="w-100" layout="vertical">
			<div className="login-forms">
				<div className="login-form">
					<img className="logo-login" src="/images/logo-2.jpg" alt="" />

					<h6 className="login-title">Đăng ký</h6>
					<Form.Item
						label={<span className="label-register">Họ và tên</span>}
						name="FullName"
						rules={[{ required: true, message: 'Hãy điền họ và tên!' }]}
					>
						<div>
							<input className="input-register" name="FullNameUnicode" placeholder="Nhập họ và tên" />
						</div>
					</Form.Item>

					<Form.Item
						label={<span className="label-register">Tên đăng nhập</span>}
						name="UserName"
						rules={[{ required: true, message: 'Hãy điền tên đăng nhập!' }]}
					>
						<div>
							<input className="input-register" name="FullNameUnicode" placeholder="Nhập tên đăng nhập" />
						</div>
					</Form.Item>

					<Form.Item
						label={<span className="label-register">Mật khẩu</span>}
						name="Password"
						rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
					>
						<div>
							<input type="password" className="input-register" name="Password" placeholder="Nhập mật khẩu" />
						</div>
					</Form.Item>

					<Form.Item
						label={<span className="label-register">Email</span>}
						name="Email"
						// rules={[{ required: true, message: 'Hãy điền email!' }]}
					>
						<div>
							<input className="input-register" name="FullNameUnicode" placeholder="Nhập Email" />
						</div>
					</Form.Item>

					<Form.Item
						label={<span className="label-register">Số điện thoại</span>}
						name="Mobile"
						// rules={[{ required: true, message: 'Hãy nhập số điện thoại!' }]}
					>
						<div>
							<input className="input-register" name="Mobile" placeholder="Nhập số điện thoại" />
						</div>
					</Form.Item>

					<button className="btn-login" type="submit">
						Đăng ký {loading && <Spin className="loading-white" />}
					</button>

					<div className="wrap-password mt-3 w-full flex items-center justify-center">
						Bạn đã có tài khoản?
						<Link href="/signin">
							<span className="font-semibold text-tw-blue pl-1 cursor-pointer">ĐĂNG NHẬP</span>
						</Link>
					</div>
				</div>
			</div>
		</Form>
	)
}

export default RegisterForm
