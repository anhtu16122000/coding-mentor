import { instance } from '~/api/instance'

const url = '/api/Branch'
export const branchApi = {
	// Lấy tất cả data có phân trang
	getAll(todoApi?: object) {
		return instance.get<IApiResultData<IBranch[]>>(url, {
			// params: getParams(todoApi),
			params: todoApi
		})
	},
	add(data: IBranch) {
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
