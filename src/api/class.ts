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
		return instance.get(`${url}/tutoring-curriculum`, { params: classId })
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
	checkCompleteCurriculumInClass(id) { // hoàn thành chủ đề
		return instance.post(`${url}/curriculum-detail-in-class/complete/${id}`)
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
	checkCompleteFileInClass(id, fileCurriculumInClassId) { //Hoàn thành file
		return instance.post(`${url}/file-curriculum-in-class/complete/${id}`, { fileCurriculumInClassId })
	},
	addCurriculumOfClass(data) {
		return instance.post(`${url}/curriculum-detail-in-class`, data)
	},
	addFileCurriculumDetailInClass(id, data) {
		return instance.post(`${url}/file-curriculum-in-class/${id}`, data)
	},
	hideCurriculumDetailInClass(Id) {
		return instance.put(`${url}/hide-curriculum-detail-in-class/${Id}`)
	},
	hideFileCurriculumInClass(Id) {
		return instance.put(`${url}/hide-file-curriculum-in-class/${Id}`)
	}
}
