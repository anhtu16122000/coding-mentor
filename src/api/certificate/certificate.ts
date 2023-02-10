import { instance } from '../instance'

const url = '/api/Certificate'

export const certificateApi = {
	getAll(pageSize = 10) {
		return instance.get(`${url}?search.pageSize=${pageSize}`)
	},
	updateCertificate(data) {
		return instance.put(`${url}`, data)
	}
}
