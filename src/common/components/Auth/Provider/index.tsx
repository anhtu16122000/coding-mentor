import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { classApi } from '~/api/learn/class'
import { log } from '~/common/utils'
import { logOut, playWithToken } from '~/common/utils/token-handle'
import { userApi } from '~/services/auth'
import { RootState } from '~/store'
import { setAuthData, setAuthLoading, setRefreshToken } from '~/store/authReducer'
import { setListClass, setStatusData, setTotalClass } from '~/store/classReducer'
import { setUser } from '~/store/userReducer'

type IAuthLayout = {
	children: React.ReactNode
}

function AuthProvider({ children }: IAuthLayout) {
	const dispatch = useDispatch()

	const { loading, data, refreshToken } = useSelector((state: RootState) => state.auth)

	const listClassState = useSelector((state: RootState) => state.class.listClass)

	const router = useRouter()

	useEffect(() => {
		checkLogin()
	}, [])

	const allowNoneLogin = () => {
		if (
			router.pathname.search('support-portal') < 1 &&
			router.pathname.search('404') < 1 &&
			router.pathname.search('login') < 1 &&
			router.pathname.search('fogot-password') < 1 &&
			router.pathname.search('reset-password') < 1 &&
			router.pathname.search('register') < 1 &&
			router.pathname.search('verify') < 1
		) {
			return false
		} else {
			return true
		}
	}

	useEffect(() => {
		if (!data) {
			if (!allowNoneLogin()) {
				logOut()
			}
		}
	}, [data])

	const userInformation = useSelector((state: RootState) => state.user.information)

	const is = {
		parent: userInformation?.RoleId == '8',
		admin: userInformation?.RoleId == '1'
	}

	const getClass = async () => {
		// if (!!listClassState && listClassState.length == 0) {
		// 	try {
		// 		const res = await classApi.getAll({ pageSize: 10, pageIndex: 1 })
		// 		if (res.status == 200) {
		// 			dispatch(setListClass([...res.data.data]))
		// 			dispatch(setTotalClass(res.data?.totalRow))
		// 		}
		// 	} catch (err) {}
		// }
	}

	const _refreshToken = async (param) => {
		log.Red('AuthProvider Refreshing Token', new Date().getTime())

		if (!allowNoneLogin()) {
			console.time('Gọi api RefreshToken hết')
			try {
				const response = await userApi.refreshToken(param)
				if (response.status == 200) {
					playWithToken(response?.data, dispatch, getClass)
				}
			} catch (error) {}
			console.timeEnd('Gọi api RefreshToken hết')
		}
	}

	function isPastDate(timestamp) {
		const date = new Date(timestamp)
		return date < new Date()
	}

	function checkTimestamp(timestamp) {
		const currentTime = Date.now()
		const eightHoursInMilliseconds = 8 * 60 * 60 * 1000

		return currentTime - timestamp > eightHoursInMilliseconds
	}

	async function checkLogin() {
		try {
			const response = await JSON.parse(localStorage.getItem('userData'))

			if (!!response?.theRefresh) {
				const theRefresh = response.theRefresh
				dispatch(setRefreshToken(theRefresh))

				if (theRefresh?.refreshTokenExpires) {
					if (isPastDate(new Date(theRefresh?.refreshTokenExpires).getTime())) {
						if (!allowNoneLogin()) {
							logOut()
						}
					} else {
						if (checkTimestamp(new Date(theRefresh?.refreshTokenExpires).getTime())) {
							_refreshToken({ RefreshToken: theRefresh?.refreshToken, token: response?.token })
						} else {
							if (!userInformation) {
								dispatch(setUser(response?.user))
								dispatch(setAuthData(response?.user))
								dispatch(setRefreshToken(response?.theRefresh))
								dispatch(setAuthLoading(false))
							}
						}
					}
				}
			} else {
				if (!allowNoneLogin()) {
					logOut()
					dispatch(setAuthLoading(false))
				}
			}
		} catch (error) {}
	}

	return <>{children}</>
}

export default AuthProvider
