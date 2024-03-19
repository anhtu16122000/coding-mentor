import { Form, Input, Spin } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Lottie from 'react-lottie-player'
import { useDispatch } from 'react-redux'
import { ROOTS_VERIFY } from '~/Router/path'
import { registerApi } from '~/api/user/user'
import { ShowNoti } from '~/common/utils'
import maill from '../../../../../public/jsons/animation_lmokumbq.json'

function RegisterForm(props) {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const router = useRouter()

	const dispatch = useDispatch()

	// const onLogin = async (data) => {
	// 	try {
	// 		setLoading(true)

	// 		const response = await userApi.login(data)
	// 		if (response.status === 200) {
	// 			const token = response?.data?.token || ''
	// 			const user = parseJwt(token) || ''
	// 			const userData = { token: token, user: user }

	// 			await localStorage.setItem('userData', JSON.stringify(userData))
	// 			await localStorage.setItem('token', token)

	// 			dispatch(setUser(user))
	// 			dispatch(setAuthData(user))
	// 			dispatch(setAuthLoading(false))

	// 		}
	// 	} catch (error) {
	// 		console.log('Login Error: ', error)
	// 	} finally {
	// 		setLoading(false)
	// 	}
	// }

	const onRegister = async (params) => {
		setLoading(true)
		try {
			const DATA_SUBMIT = {
				...params,
				SendOPT: true
			}
			console.log('data: ', DATA_SUBMIT)
			const response = await registerApi.register(DATA_SUBMIT)
			if (response.status == 200) {
				await localStorage.setItem('passworkregister', params?.Password)
				await localStorage.setItem('accountregister', response.data.data?.UserName)
				// onLogin({ username: response.data.data?.UserName, password: params?.Password })
				router.push({ pathname: ROOTS_VERIFY, query: { userId: response?.data?.data?.UserInformationId } })
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
					<div className="w-full h-[200px] flex flex-col items-center justify-center">
						<Lottie loop animationData={maill} play className="inner w-[200px] mx-auto" />
					</div>
					<img className="logo-login" src="/images/logo-2.jpg" alt="" />

					<h6 className="login-title">Đăng ký</h6>
					<Form.Item
						// label={<span className="label-register">Họ và tên</span>}prefix={<SmileOutlined />}
						name="FullName"
						rules={[{ required: true, message: 'Hãy điền họ và tên!' }]}
					>
						<Input className="antd-input-register" placeholder="Họ và tên" />
					</Form.Item>

					<Form.Item
						// label={<span className="label-register">Tên đăng nhập</span>} prefix={<UserOutlined />}
						name="UserName"
						rules={[{ required: true, message: 'Hãy điền tên đăng nhập!' }]}
					>
						{/* <div>
							<input className="input-register" name="FullNameUnicode" placeholder="Nhập tên đăng nhập" />
						</div> */}
						<Input className="antd-input-register" placeholder="Tên đăng nhập" />
					</Form.Item>

					<Form.Item
						// label={<span className="label-register">Mật khẩu</span>}prefix={<LockOutlined />}
						name="Password"
						rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
					>
						{/* <div>
							<input type="password" className="input-register" name="Password" placeholder="Nhập mật khẩu" />
						</div> */}
						<Input.Password className="antd-input-register" placeholder="Mật khẩu" />
						{/* <Input className="antd-input-register" placeholder="Mật khẩu" /> */}
					</Form.Item>

					<Form.Item
						// label={<span className="label-register">Email</span>}
						name="Email"

						// rules={[{ required: true, message: 'Hãy điền email!' }]}prefix={<MailOutlined />}
					>
						{/* <div>
							<input className="input-register" name="FullNameUnicode" placeholder="Nhập Email" />
						</div> */}
						<Input className="antd-input-register" placeholder="Email" />
					</Form.Item>

					<Form.Item
						// label={<span className="label-register">Số điện thoại</span>}prefix={<PhoneOutlined />}
						name="Mobile"
						// rules={[{ required: true, message: 'Hãy nhập số điện thoại!' }]}
					>
						{/* <div>
							<input className="input-register" name="Mobile" placeholder="Nhập số điện thoại" />
						</div> */}
						<Input className="antd-input-register" placeholder="Số điện thoại" />
					</Form.Item>

					<button className="btn-login" type="submit">
						Đăng ký {loading && <Spin className="loading-white" />}
					</button>

					<div className="wrap-password mt-3 w-full flex items-center justify-center">
						Bạn đã có tài khoản?
						<Link href="/signin">
							<span className="font-semibold text-tw-red pl-1 cursor-pointer">ĐĂNG NHẬP</span>
						</Link>
					</div>
				</div>
			</div>
		</Form>
	)
}

export default RegisterForm
