import { instance } from '~/api/instance'

export const configAppointmentStatusApi = {
	// Lấy tất cả data có phân trang
	getAll(params) {
		return instance.get<IApiResultData<IConfigAppointmentStatus[]>>('/api/ExamAppointStatus', { params })
	},
	// Thêm mới data
	add(data) {
		return instance.post(`/api/ExamAppointmentStatus/Insert`, data)
	},

	// Cập nhật data
	update(data) {
		return instance.put('/api/ExamAppointmentStatus/Update', data)
	},

	// Xóa data
	delete(ID) {
		return instance.delete(`/api/ExamAppointmentStatus/Delete/${ID}`)
	}
}
