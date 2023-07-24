import { instance } from '~/api/instance'

const url = '/api/TeacherOff'
export const teacherOffApi = {
	getAll(params) {
		return instance.get<IApiResultData<ITeacherOff[]>>(url, { params: params })
	},
	add(data) {
		return instance.post(url, data)
	},
	update(data) {
		return instance.put(url, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
