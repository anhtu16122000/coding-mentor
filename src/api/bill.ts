import { instance } from '~/api/instance'

const url = '/api/Bill'
export const billApi = {
	getClassAvailable(params) {
		return instance.get(`${url}/class-available`, { params: params })
	},
	add(data) {
		return instance.post(url, data)
	}
}
