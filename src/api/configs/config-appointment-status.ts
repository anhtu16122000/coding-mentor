import { instance } from '~/api/instance'

export const configAppointmentStatusApi = {
	getAll(params) {
		return instance.get<IApiResultData<IConfigAppointmentStatus[]>>('/api/ExamAppointStatus', { params })
	},
	add(data) {
		return instance.post(`/api/ExamAppointmentStatus/Insert`, data)
	},
	update(data) {
		return instance.put('/api/ExamAppointmentStatus/Update', data)
	},
	delete(ID) {
		return instance.delete(`/api/ExamAppointmentStatus/Delete/${ID}`)
	}
}
