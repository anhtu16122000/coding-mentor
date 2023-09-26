import { instance } from '../instance'

const url = '/api/ClassReserve'
export const classReserveApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	getByID(ID) {
		return instance.get<IApiResultData<any>>(`${url}${ID}`)
	},
	getPaid(params) {
		return instance.get<IApiResultData<any[]>>(url + '/paid', { params })
	},
	getReview(id) {
		return instance.get<IApiResultData<any>>(url + '/review-reserve/' + id, {})
	},
	add(data) {
		return instance.post(url, data)
	},
	addToClass(data) {
		return instance.post(url + '/add-to-class', data)
	},
	update(data) {
		return instance.put(url, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
