import { instance } from '~/api/instance'

const url = '/api/ScoreBoardTemplate'
export const gradesTemplatesApi = {
	get(data = {}) {
		return instance.get(url, {
			params: data
		})
	},
	post(data = {}) {
		return instance.post(url, data)
	},
	put(data = {}) {
		return instance.put(url, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
