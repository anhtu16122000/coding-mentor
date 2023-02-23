import { instance } from '~/api/instance'

const url = '/api/Class'
export const classApi = {
	getAll(params) {
		return instance.get<IApiResultData<IClass[]>>(url, { params: params })
	},
	getByID(id) {
		return instance.get<IApiResultData<IClass>>(`${url}/${id}`)
	},
	getAllTeacherWhenCreate(params) {
		return instance.get<IApiResultData<ICurriculum[]>>(`${url}/teacher-when-create`, { params: params })
	},
	checkTeacherAvailable(params) {
		return instance.get<IApiResultData<any[]>>(`${url}/teacher-available`, { params: params })
	},
	checkRoomAvailable(params) {
		return instance.get<IApiResultData<any[]>>(`${url}/room-available`, { params: params })
	},
	checkExistStudentInClass(Id) {
		return instance.get(`${url}/check-exist-student-in-class/${Id}`)
	},
	createLesson(data) {
		return instance.post(`${url}/lesson-when-create`, data)
	},
	addClass(data) {
		return instance.post(url, data)
	},
	deleteClass(Id) {
		return instance.delete(`${url}/${Id}`)
	},
	updateClass(data) {
		return instance.put(url, data)
	},
	getRollUpTeacher(params) {
		return instance.get<IApiResultData<any[]>>(`${url}/roll-up-teacher`, { params: params })
	},
	addRoleUpTeacher(Id) {
		return instance.post(`${url}/roll-up-teacher/${Id}`)
	},

	// these apis belong to curriculum in class (rối vãi loz)
	getCurriculumOfClass(classID) {
		return instance.get(`${url}/curriculum-in-class/${classID}`)
	},
	getCurriculumDetailOfClass(params) {
		return instance.get(`${url}/curriculum-details-in-class`, { params })
	},
	deleteCurriculumDetailOfClass(id) {
		return instance.delete(`${url}/curriculum-detail-in-class/${id}`)
	},
	updateIndexCurriculumDetailOfClass(data) {
		return instance.put(`${url}/curriculum-detail-in-class-index`, data)
	},
	getFileCurriculumOfClass(params) {
		return instance.get(`${url}/file-curriculum-in-class`, { params })
	},
	updateIndexFileCurriculumDetailOfClass(data) {
		return instance.put(`${url}/file-curriculum-in-class-index`, data)
	},
	deleteFileCurriculumDetailOfClass(id) {
		return instance.delete(`${url}/file-curriculum-in-class/${id}`)
	},
	addCurriculumOfClass(data) {
		return instance.post(`${url}/curriculum-detail-in-class`, data)
	},
	addFileCurriculumDetailInClass(id, data) {
		return instance.post(`${url}/file-curriculum-in-class/${id}`, data)
	}
}
