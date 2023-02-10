import React, { useEffect, useState } from 'react'
import AuthLayout from '~/common/components/Auth/Layout'
import LoginForm from '~/common/components/Auth/LoginForm'
import { registerApi } from '~/api/user'
import { parseJwt, ShowNoti } from '~/common/utils'
import { userApi } from '~/services/auth'
import { useDispatch } from 'react-redux'
import { setUser } from '~/store/userReducer'
import { setAuthData, setAuthLoading } from '~/store/authReducer'
import Router from 'next/router'
import Head from 'next/head'
import appConfigs from '~/appConfig'

function SignIn({ csrfToken }) {
	const dispatch = useDispatch()

	const [alloweRegisters, setAlloweRegisters] = useState(false)

	useEffect(() => {
		getAllow()
	}, [])

	const getAllow = async () => {
		try {
			const response = await registerApi.getAllowRegister()
			if (response.status === 200) {
				if (response.data.data == 'Allow') {
					setAlloweRegisters(true)
				} else {
					setAlloweRegisters(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	const [errorLogin, setErrorLogin] = useState('')
	const [loading, setLoading] = useState(false)

	const _Submit = async (data) => {
		setErrorLogin('')
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

				// if (!!Router.query?.redirect) {
				// 	Router.push(Router.query?.redirect + '')
				// } else {
				Router.push('/')
				// }
			}
		} catch (error) {
			console.log('Login Error: ', error)
			setErrorLogin(error?.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Đăng nhập</title>
			</Head>
			<LoginForm loading={loading} error={errorLogin} onSubmit={_Submit} alloweRegisters={alloweRegisters} />
		</>
	)
}

SignIn.Layout = AuthLayout
export default SignIn
