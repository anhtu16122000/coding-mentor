import { instance } from '~/api/instance'

const url = '/api/Source'
export const sourceApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<ISource[]>>(url, {
			params: todoApi
		})
	},
	add(data: ISource) {
		return instance.post(url, data)
	},
	update(data: any) {
		return instance.put(url, data, {})
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
