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
	checkTeacherTutoringAvailable(params) {
		return instance.get<IApiResultData<any[]>>(`${url}/teacher-tutoring-available`, { params: params })
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
	getClassTutoringConfig() {
		return instance.get(`${url}/tutoring-config`)
	},
	updateClassTutoringConfig(data) {
		return instance.put(`${url}/tutoring-config`, data)
	},
	getClassTutoringCurriculum(classId) {
		return instance.get(`${url}/tutoring-curriculum`, { params: classId})
	},
	getCurriculumOfClass(classID) {
		return instance.get(`${url}/curriculum-of-class/${classID}`)
	},
	getCurriculumDetailOfClass(classID) {
		return instance.get(`${url}/curriculum-details-of-class/${classID}`)
	},
	getFileCurriculumOfClass(classID) {
		return instance.get(`${url}/file-curriculum-of-class/${classID}`)
	},
	addCurriculumOfClass(data) {
		return instance.get(`${url}/file-curriculum-of-class`, data)
	},
}
