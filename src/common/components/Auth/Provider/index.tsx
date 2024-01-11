import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logOut, playWithToken } from '~/common/utils/token-handle'
import { userApi } from '~/services/auth'
import { RootState } from '~/store'
import { setAuthData, setAuthLoading, setRefreshToken } from '~/store/authReducer'
import { setUser } from '~/store/userReducer'
import LoadingLayout from '../../MainLayout/LoadingLayout'

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
		// Đây là nhưng page không yêu cầu login
		if (
			router.pathname.search('support-portal') < 1 &&
			router.pathname.search('404') < 1 &&
			router.pathname.search('login') < 1 &&
			router.pathname.search('fogot-password') < 1 &&
			router.pathname.search('reset-password') < 1 &&
			router.pathname.search('register') < 1 &&
			router.pathname.search('verify') < 1 &&
			router.pathname.search('hacked') < 1 &&
			router.pathname.search('anti-download-video') < 1
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

	// Gọi api để lấy token mới
	const _refreshToken = async (param) => {
		if (!allowNoneLogin()) {
			try {
				const response = await userApi.refreshToken(param)
				if (response.status == 200) {
					// Bỏ token mới dô đây để lưu lại
					playWithToken(response?.data, dispatch)
				}
			} catch (error) {}
		}
	}

	function isPastDate(timestamp) {
		// Kiểm tra xem token đã hết hạn refresh hay chưa
		const date = new Date(timestamp)
		return date < new Date()
	}

	function checkTimestamp(timestamp) {
		// Kiểm tra xem hạn refresh của token còn trên 8 tiếng hay không
		const currentTime = Date.now()
		const eightHoursInMilliseconds = 8 * 60 * 60 * 1000

		return timestamp - currentTime < eightHoursInMilliseconds
	}

	async function checkLogin() {
		try {
			const response = await JSON.parse(localStorage.getItem('userData'))

			if (!!response?.theRefresh) {
				// Nếu có token thì mới vào đây, không thì logout luôn
				const theRefresh = response.theRefresh
				dispatch(setRefreshToken(theRefresh))

				if (theRefresh?.refreshTokenExpires) {
					if (isPastDate(new Date(theRefresh?.refreshTokenExpires).getTime())) {
						// Nếu hết hạn refresh token thì logout
						logOut()
					} else {
						if (checkTimestamp(new Date(theRefresh?.refreshTokenExpires).getTime())) {
							// Nếu hạn refresh token còn dưới 8 tiếng thì refresh token
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
				}
				dispatch(setAuthLoading(false))
			}
		} catch (error) {}
	}

	useEffect(() => {
		if (router.asPath.includes('/signin') || router.asPath.includes('/login')) {
			// Khi router về trang login thì ngưng load
			dispatch(setAuthLoading(false))
		}
	}, [router])

	if (loading == false) {
		// Chỉ khi ngưng loading thì mới hiện ra
		return <>{children}</>
	}

	return <LoadingLayout />
}

export default AuthProvider
