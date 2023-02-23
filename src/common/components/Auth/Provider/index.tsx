import Router, { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '~/common/utils/common'
import { RootState } from '~/store'
import { setAuthData, setAuthLoading } from '~/store/authReducer'
import { setUser } from '~/store/userReducer'

type IAuthLayout = {
	children: React.ReactNode
}

function AuthProvider({ children }: IAuthLayout) {
	const dispatch = useDispatch()
	const { loading, data } = useSelector((state: RootState) => state.auth)

	const router = useRouter()

	useEffect(() => {
		checkLogin()
	}, [])

	const allowNoneLogin = () => {
		if (
			router.pathname !== '/minhtuoiloz' &&
			router.pathname.search('login') < 1 &&
			router.pathname.search('fogot-password') < 1 &&
			router.pathname.search('reset-password') < 1 &&
			router.pathname.search('register') < 1
		) {
			return true
		} else {
			return false
		}
	}

	useEffect(() => {
		if (!data) {
			if (allowNoneLogin()) {
				logOut()
			}
		}
	}, [data])

	async function checkLogin() {
		try {
			const response = await JSON.parse(localStorage.getItem('userData'))
			if (!!response) {
				dispatch(setUser(response.user))
				dispatch(setAuthData(response.user))
				dispatch(setAuthLoading(false))
			} else {
				if (allowNoneLogin()) {
					logOut()
				}
			}
		} catch (error) {}
	}

	return <>{children}</>
}

export default AuthProvider
