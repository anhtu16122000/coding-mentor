import { instance } from './instance'

const url = '/api/Contract/'
export const contractApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IContract[]>>(url, {
			params
		})
	},

	// Cập nhật data
	update(data: IContract) {
		return instance.put(url, data)
	}
}
