import Router from 'next/router'
import { setAuthData, setAuthLoading, setRefreshToken } from '~/store/authReducer'
import { setUser } from '~/store/userReducer'

/**
 * It takes a JWT token, splits it into three parts, takes the second part, replaces some characters,
 * decodes it, and returns the JSON payload
 * @param token - The JWT token to decode
 * @returns The token is being decoded and parsed into a JSON object.
 */
function parseJwt(token) {
	var base64Url = token.split('.')[1]
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
	var jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString())
	return JSON.parse(jsonPayload) || {}
}

/**
 * It takes in a token, parses it, and then sets the user data in the Redux store
 * @param params - Response from the server after login and refresh tokens
 * @param dispatch - This is the dispatch function that we can use to dispatch actions to the Redux store
 */
async function playWithToken(params, dispatch) {
	const token = params?.token || ''
	const user = parseJwt(token) || ''
	const theRefresh = {
		refreshToken: params?.refreshToken,
		refreshTokenExpires: params?.refreshTokenExpires
	}
	const userData = { token: token, user: user, theRefresh }
	try {
		await localStorage.setItem('userData', JSON.stringify(userData))
	} catch (error) {
		console.log('--- error: ', error)
	}

	dispatch(setUser(user))
	dispatch(setAuthData(user))
	dispatch(setRefreshToken(theRefresh))
	dispatch(setAuthLoading(false))

	const pathname = Router.pathname

	if (pathname == '/signin') {
		Router.push('/')
	}
}

/**
 * If the user is on the home page or the dashboard, redirect them to the login page. Otherwise,
 * redirect them to the login page with the current page as a query parameter
 */
async function logOut() {
	localStorage.clear()
	const redirect = Router.pathname
	if (redirect == '/' || redirect == '/dashboard') {
		Router.replace({ pathname: '/signin' })
	} else {
		Router.replace({ pathname: '/signin', query: { redirect: redirect } })
	}
}

export { parseJwt, playWithToken, logOut }
