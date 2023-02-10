import { userApi } from '~/services/auth'

export default (_: { username: string; password: string }) => {
	const callApi: any = async () => {
		try {
			const response = await userApi.login(_)
			if (response.status === 200) {
				return response
			}
		} catch (error) {
			return { status: 'error', message: error?.message || '', token: null }
		}
	}

	callApi()
}
