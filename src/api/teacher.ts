import { instance } from '~/api/instance'

const url = '/api/Teacher/'
export const teacherApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ITeacher[]>>(url, {
			params
		})
	},
	add(data: ITeacher) {
		return instance.post(url, data)
	},
	update(data: ITeacher) {
		return instance.put(url, data)
	},
	updateRole(data: { RoleID: number; UserInformationID: number }) {
		return instance.put(url, data)
	}
}
