import { instance } from '~/api/instance'

const url = '/api/Purpose'
export const purposeApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IPurpose[]>>(url, {
			params: todoApi
		})
	},
	// Thêm mới data
	add(data: IPurpose) {
		return instance.post(url, data)
	},

	// Cập nhật data
	update(data: any) {
		return instance.put(url, data, {})
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
