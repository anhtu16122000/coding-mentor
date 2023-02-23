import { instance } from '~/api/instance'

const url = '/api/Refund'
export const refundApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IRefund[]>>(url, {
			params: todoApi
		})
	},
	// Thêm mới data
	add(data) {
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
