import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { classApi } from '~/api/class'
import { logOut, playWithToken } from '~/common/utils/token-handle'
import { userApi } from '~/services/auth'
import { RootState } from '~/store'
import { setAuthLoading, setRefreshToken } from '~/store/authReducer'
import { setListClass, setStatusData, setTotalClass } from '~/store/classReducer'

type IAuthLayout = {
	children: React.ReactNode
}

function AuthProvider({ children }: IAuthLayout) {
	const dispatch = useDispatch()
	const { loading, data, refreshToken } = useSelector((state: RootState) => state.auth)

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
			router.pathname.search('register') < 1
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
		try {
			const res = await classApi.getAll({ pageSize: 10, pageIndex: 1 })
			if (res.status == 200) {
				dispatch(setListClass([...res.data.data]))
				dispatch(setTotalClass(res.data?.totalRow))
				dispatch(setStatusData({ ...res.data, data: [] }))
			}
		} catch (err) {}
	}

	const _refreshToken = async (param) => {
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
						_refreshToken({ RefreshToken: theRefresh?.refreshToken, token: response?.token })
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
