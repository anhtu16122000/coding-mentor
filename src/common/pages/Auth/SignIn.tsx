import React, { useEffect, useState } from 'react'
import { registerApi } from '~/api/user/user'
import { ShowNoti } from '~/common/utils'
import { userApi } from '~/services/auth'
import { useDispatch } from 'react-redux'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import { playWithToken } from '~/common/utils/token-handle'
import LoginForm from '~/common/components/Auth/LoginForm'
import { setListClass, setStatusData, setTotalClass } from '~/store/classReducer'
import { setAuthLoading } from '~/store/authReducer'

function SignIn() {
	const dispatch = useDispatch()

	const [alloweRegisters, setAlloweRegisters] = useState(false)

	useEffect(() => {
		dispatch(setAuthLoading(false))

		getAllow()
		dispatch(setListClass([]))
		dispatch(setTotalClass(0))
		dispatch(setStatusData({ closing: 0, opening: 0, totalRow: 0, upcoming: 0 }))
	}, [])

	const getAllow = async () => {
		try {
			const response = await registerApi.getAllowRegister()
			if (response.status == 200) {
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

	const _submit = async (data) => {
		setErrorLogin('')
		try {
			setLoading(true)
			const response = await userApi.login(data)
			if (response.status == 200) {
				playWithToken(response?.data, dispatch)
			}
		} catch (error) {
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
			<LoginForm loading={loading} error={errorLogin} onSubmit={_submit} alloweRegisters={alloweRegisters} />
		</>
	)
}

export default SignIn
