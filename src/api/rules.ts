import { instance } from '~/api/instance'

const url = '/api/Rules'
export const rulesApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IRules[]>>(url, {
			params
		})
	},

	// Cập nhật data
	update(data: any) {
		return instance.put(url, data, {})
	}
}
