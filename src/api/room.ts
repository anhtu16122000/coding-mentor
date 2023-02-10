import { instance } from '~/api/instance'

const url = '/api/Room'
export const roomApi = {
	// Lấy tất cả
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IRoom[]>>(url, {
			params: todoApi
		})
	},

	// Update data
	update(data: any) {
		return instance.put(url, data)
	},

	// Add data
	add(data: IRoom) {
		return instance.post(url, data)
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
