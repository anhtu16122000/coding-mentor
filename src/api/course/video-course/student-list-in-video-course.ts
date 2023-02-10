import { instance } from '../../instance'

const url = '/api/VideoCourseStudent'
export const StudentListInCourseApi = {
	// Lấy tất cả data
	getAllCourseOfStudent(params) {
		return instance.get<IApiResultData<IVideoCourseOfStudent[]>>(`${url}`, params)
	},
	getStudentInCourse(params) {
		return instance.get<IApiResultData<IStudentInVideoCourse[]>>(`${url}/GetStudent`, { params })
	},
	getCertificateOfStudent(videoCourseID, userID) {
		return instance.get<IApiResultData<ICertificateOfStudent[]>>(`${url}/${videoCourseID}/GetCertificate/${userID}`)
	},
	getLearningDetail(videoCourseID, userID) {
		return instance.get<IApiResultData<ILearningDetail[]>>(`${url}/${videoCourseID}/GetLearningDetail/${userID}`)
	},
	getRate(videoCourseID) {
		return instance.get<IApiResultData<IReviewVideoCourse[]>>(`${url}/Rate/${videoCourseID}`)
	},
	// Thêm mới data
	addVideoCourse(videoCourseID) {
		return instance.post(`${url}/AddVideoCourse/${videoCourseID}`)
	},
	addRate(data) {
		return instance.post(`${url}/AddRate`, data)
	}
}
