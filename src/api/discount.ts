import { instance } from '~/api/instance'

const url = '/api/Discount'
export const discountApi = {
	getAll(todoApi?: object) {
		return instance.get<IApiResultData<IDiscount[]>>(url, {
			params: todoApi
		})
	},

	// Thêm mới data
	add(data: IDiscount) {
		return instance.post(url, data, {})
	},

	// Cập nhật data
	update(data: any) {
		return instance.put(url, data, {})
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
