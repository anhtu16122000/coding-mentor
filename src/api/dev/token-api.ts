import { instance } from '../instance'

export const tokenApi = {
	refreshToken(params: { RefreshToken: string }) {
		return instance.post('/api/RefreshToken', { RefreshToken: params?.RefreshToken })
	}
}
