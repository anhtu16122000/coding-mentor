import { instance } from '~/api/instance'

const url = '/api/Grade'
export const gradeApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IGrade[]>>(url, {
			params: todoApi
		})
	},

	add(data: IGrade) {
		return instance.post(url, data, {})
	},

	update(data: any) {
		return instance.put(url, data, {})
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
