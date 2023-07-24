import { instance } from './instance'

const url = '/api/Exam/'
export const exampleApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, {
			params
		})
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
	delete(data) {
		return instance.put(url, data)
	}
}
