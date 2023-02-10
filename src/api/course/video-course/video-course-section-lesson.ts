import { instance } from '../../instance'

const url = '/api/LessonVideo'
export const VideoCourseSectionLessonApi = {
	// Lấy tất cả data
	getBySectionID(ID) {
		return instance.get<IApiResultData<IVideoCourseSectionLesson[]>>(`${url}/GetBySection/${ID}`)
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data)
	},
	complete(ID) {
		return instance.post(`${url}/Completed/${ID}`)
	},
	// Cập nhật data
	update(data: { Name: string; VideoUrl: string; ExamTopicId: number; Id: number }) {
		return instance.put(url, data)
	},
	updateIndex(params) {
		return instance.put(`${url}/ChangeIndex`, params)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
