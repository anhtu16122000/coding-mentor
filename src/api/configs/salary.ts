import { instance } from '~/api/instance'

const url = '/api/SalaryConfig'
export const salaryConfigApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ISalary[]>>(url, {
			params
		})
	},

    // thêm data
    add(data) {
		return instance.post(`${url}/insert-or-update`, data)
	},

	// Cập nhật data
	update(data: any) {
		return instance.put(url, data, {})
	},

    // xóa data
    delete(ID) {
		return instance.delete(`${url}/${ID}`)
	},

	getUserAvailable() {
		return instance.get(`${url}/user-available`)
	}
}