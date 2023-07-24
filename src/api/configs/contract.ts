import { instance } from '../instance'

const url = '/api/Contract/'
export const contractApi = {
	getAll(params) {
		return instance.get<IApiResultData<IContract[]>>(url, {
			params
		})
	},
	getByStudentID(studentID) {
		return instance.get<IApiResultData<IContract[]>>(`${url}template/${studentID}`)
	},
	update(data) {
		return instance.put(url, data)
	},
	addContract(data) {
		return instance.post(url, data)
	}
}
