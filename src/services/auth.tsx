import { instance } from './instance'
const FormData = require('form-data')

export const userApi = {
	login(params: { username: string; password: string }) {
		console.log('- USER LOGIN: ', params)
		const formData = new FormData()
		formData.append('username', params.username)
		formData.append('password', params.password)
		return instance.post('/api/Account/Login', formData)
	},
	loginDev(params) {
		console.log('- DEV LOGIN: ', params)
		const formData = new FormData()
		formData.append('roleId', params.roleId)
		return instance.post('/api/LoginByDev', formData, {
			headers: formData.getHeaders()
		})
	},
	getListAccount() {
		return instance.get('/api/GetAccountTemplate')
	},
	refreshToken(params: { RefreshToken: string }) {
		return instance.post('/api/RefreshToken', { RefreshToken: params?.RefreshToken })
	}
}
