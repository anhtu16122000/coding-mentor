import { instance } from '~/api/instance'

const url = '/api/Staff'
export const staffApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IStaff[]>>(url, { params })
	}
}
