import { instance } from '~/api/instance'

const url = '/api/Program'
export const programApi = {
	getAll(todoApi?: object) {
		return instance.get<IApiResultData<IProgram[]>>(url, {
			params: todoApi
		})
	},
	getTeacherInProgram(data) {
		return instance.get<IApiResultData<ITeacher[]>>(`${url}/teacher-in-program`, { params: data })
	},
	add(data: IProgram) {
		return instance.post(url, data, {})
	},

	update(data: IProgram) {
		return instance.put(url, data, {})
	},

	updateAllowTeacher(data) {
		return instance.put(`${url}/${data.programId}/allow-teacher/${data?.teacherId}`)
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
