import React, { useEffect, useState } from 'react'
import { Input, Spin, Form, Modal, Divider } from 'antd'
import { ImEnter } from 'react-icons/im'
import { userApi } from '~/services/auth'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/121421-login.json'
import { FiLogIn } from 'react-icons/fi'

type ILoginForm = {
	csrfToken?: string
	onSubmit: Function
	alloweRegisters?: boolean
	error?: string
	loading?: boolean
}

function LoginForm(props: ILoginForm) {
	const [form] = Form.useForm()

	const [visible, setVisible] = useState(false)

	const [loadingTrial, setLoadingTrial] = useState(false)
	const [trialUsers, setTrialUsers] = useState([])

	function removeFullNameContainingChau(arr) {
		return arr.filter((person) => !person.FullName.includes('Châu') && !person.FullName.includes('Chau'))
	}

	const getListAccount = async () => {
		try {
			const res = await userApi.getListAccount()
			if (res.status === 200) {
				setTrialUsers(removeFullNameContainingChau(res.data.data))
			} else {
				setTrialUsers([])
			}
		} catch (error) {
		} finally {
		}
	}

	useEffect(() => {
		getListAccount()
	}, [])

	const _submit = async (data) => {
		props?.onSubmit(data)
	}

	useEffect(() => {
		form.setFieldValue('username', null)
		form.setFieldValue('password', null)
	}, [])

	return (
		<Form autoComplete="on" initialValues={{ remember: true }} form={form} onFinish={_submit} className="w-100 login-forms ">
			<div className="login-form">
				<img className="logo-login" src="/images/logo-2.jpg" alt="" />

				<h6 className="mt-5 mb-3 login-title">Đăng nhập</h6>

				<input name="csrfToken" type="hidden" defaultValue={props?.csrfToken} />

				<label>Tài khoản</label>

				<Form.Item name="username" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
					<Input className="input" placeholder="Nhập tài khoản" prefix={<i className="fa fa-user" aria-hidden="true" />} />
				</Form.Item>

				<label className="password">Mật khẩu</label>

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
					<FiLogIn className="mr-[8px]" />
					Đăng nhập {props.loading && <Spin className="loading-white" />}
				</button>

				<button onClick={() => setVisible(true)} className="btn-login mt-4 !bg-[#ee8503]" type="button">
					<ImEnter className="mr-[8px]" />
					Dùng thử
				</button>

				{!!props?.alloweRegisters && (
					<div className="mt-4 register">
						Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
					</div>
				)}

				<div className="wrap-password mt-3 w-full flex items-center justify-center">
					<a href="/fogot-password">Quên mật khẩu?</a>
				</div>
			</div>

			<Modal width={500} open={visible} onCancel={() => setVisible(false)} footer={null}>
				<div className="w-full h-[300px] flex flex-col items-center justify-center">
					<Lottie loop animationData={loadingJson} play className="inner w-[350px] mx-auto" />
				</div>

				<Divider>
					<h1 className="text-center">Chọn tài khoản dùng thử</h1>
				</Divider>

				<div className="grid grid-cols-4 gap-3">
					{trialUsers.map((user) => {
						return (
							<div
								onClick={() => {
									setLoadingTrial(true)
									_submit({ username: user.UserName, password: 'mon4medi4' })
								}}
								className="bg-[#0d6efd] shadow-sm none-selection cursor-pointer hover:bg-[#0d60dd] active:bg-[#0d6efd] rounded-[6px] h-[36px] flex items-center justify-center col-span-1"
							>
								<div className="font-[600] text-[#fff] text-[16px]">{user?.RoleName}</div>
							</div>
						)
					})}
				</div>
			</Modal>
		</Form>
	)
}

export default LoginForm
