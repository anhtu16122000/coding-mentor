import { instance } from '~/api/instance'

const url = '/api/Score'
export const scoreApi = {
	get(data = {}) {
		return instance.get(url, {
			params: data
		})
	},
	postInsertOrUpdate(data = {}) {
		return instance.post(`${url}/InsertOrUpdate`, data)
	},
	calcMediumScore(data = {}) {
		return instance.post(`${url}/CalculaterMediumScore`, data)
	}
}
