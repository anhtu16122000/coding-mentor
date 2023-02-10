import { instance } from '../../instance'

const url = '/api/FileInVideo'
export const VideoCourseLessonUploadFileApi = {
	// Lấy tất cả data
	getByLessonID(ID) {
		return instance.get<IApiResultData<IVideoCourseFile[]>>(`${url}/GetByLesson/${ID}`)
	},
	// Thêm mới data
	add(data: { LessonVideoId: number; FileName: string; FileUrl: string }) {
		return instance.post(url, data)
	},
	upload(data) {
		let fData = new FormData()
		fData.append('file', data)
		return instance.post(`${url}/UploadFile`, fData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
