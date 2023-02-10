import { instance } from '~/api/instance'

export const staffSalaryApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IStaffSalary[]>>('/api/Salary', {
			params: todoApi
		})
	},

	// Thêm mới data
	add(data: IStaffSalary) {
		return instance.post('/api/Salary', data)
	},

	// Cập nhật data
	update(data: any) {
		return instance.put('/api/Salary', data, {})
	}
}
