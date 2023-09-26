import { instance } from '~/api/instance'

const url = '/api/TuitionPackage'
export const tuitionPackageApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	getByID(ID) {
		return instance.get<IApiResultData<any>>(`${url}${ID}`)
	},
	add(data) {
		return instance.post(url, data)
	},
	update(data) {
		return instance.put(url, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
