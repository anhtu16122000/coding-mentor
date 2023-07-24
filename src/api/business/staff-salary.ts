import { instance } from '~/api/instance'
const url = '/api/Salary'
export const staffSalaryApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IStaffSalary[]>>(url, {
			params: todoApi
		})
	},

	// Thêm mới data
	add(data: IStaffSalary) {
		return instance.post(url, data)
	},

	// Cập nhật data
	update(data: any) {
		return instance.put(url, data, {})
	}, 
	getTeachingDetail(params) {
		return instance.get<IApiResultData<IStaffSalaryTeachingDetail[]>>(`${url}/teaching-detail`, { params })
	},
	addSalaryClosing() {
		return instance.post(`${url}/salary-closing`)
	},
	getUserAvailable(todoApi) {
		return instance.get<IApiResultData<IStaffSalary[]>>(`${url}/user-available`, {
			params: todoApi
		})
	}
}
