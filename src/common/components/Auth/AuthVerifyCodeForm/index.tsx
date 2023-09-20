import { Form, Spin } from 'antd'
import Title from 'antd/lib/typography/Title'
import Router, { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { verifyApi } from '~/api/user/user'
import CodesInput from '~/common/custom/CodesInput'
import useEventListener from '~/common/custom/CodesInput/useEventListener'
import { parseJwt } from '~/common/utils'
import { userApi } from '~/services/auth'
import { setAuthData, setAuthLoading } from '~/store/authReducer'
import { setUser } from '~/store/userReducer'
import { FormCodeButton, FormCodeContainer, FromCode } from './index.styled'

const INPUTS = ['code1', 'code2', 'code3', 'code4', 'code5', 'code6']

function AuthVerifyCodeForm() {
	const [form] = Form.useForm()
	const router = useRouter()
	const formRef = useRef(null)
	const dispatch = useDispatch()
	const [isSubmit, setIsSubmit] = useState<boolean>(false)

	const onLogin = async (data) => {
		try {
			const response = await userApi.login(data)
			if (response.status === 200) {
				const token = response?.data?.token || ''
				const user: any = parseJwt(token) || ''
				const userData = { token: token, user: user }

				await localStorage.setItem('userData', JSON.stringify(userData))
				await localStorage.setItem('token', token)
				await localStorage.removeItem('passworkregister')
				await localStorage.removeItem('accountregister')
				dispatch(setUser(user))
				dispatch(setAuthData(user))
				dispatch(setAuthLoading(false))

				Router.push('/')
				console.log('router')
			}
		} catch (error) {
			console.log('Login Error: ', error)
		}
	}

	const handlePaste = (event: any) => {
		const data = event.clipboardData.getData('text')

		const dataArr = data.split('')

		const newValues = {}

		INPUTS.forEach((input, index) => {
			newValues[input] = dataArr[index]
		})

		form.setFieldsValue(newValues)

		event.preventDefault()
	}
	const onFinish = async (values: any) => {
		setIsSubmit(true)
		console.log('Success:', values)
		try {
			const data = {
				Otp: `${values.code1}${values.code2}${values.code3}${values.code4}${values.code5}${values.code6}`,
				userId: router.query.userId
			}
			const password = await localStorage.getItem('passworkregister')
			const account = await localStorage.getItem('accountregister')
			const res = await verifyApi.verify(data)
			if (res.status == 200) {
				onLogin({ username: account, password })
				setIsSubmit(false)
			} else {
				setIsSubmit(false)
			}
		} catch (error) {
			setIsSubmit(false)
			console.log(error)
		}
	}

	useEventListener('paste', handlePaste, formRef)

	return (
		<FormCodeContainer className="verify-code-container" ref={formRef}>
			<FromCode name="basic" onFinish={onFinish} form={form}>
				<CodesInput keyName="code" inputs={INPUTS} />
				{/* {err && <div style={{ color: 'red' }}>Không được để trống</div>} */}
				<FormCodeButton className="html-button-verify-code" disabled={isSubmit} type="submit">
					<Title level={5} style={{ color: '#fff' }}>
						Xác nhận
					</Title>
					{isSubmit && <Spin style={{ position: 'absolute', top: 13, right: 15 }} />}
				</FormCodeButton>
			</FromCode>
		</FormCodeContainer>
	)
}

export default AuthVerifyCodeForm
