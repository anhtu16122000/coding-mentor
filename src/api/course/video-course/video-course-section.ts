import { instance } from '../../instance'

const url = '/api/Section'
export const VideoCourseSectionApi = {
	// Lấy tất cả data
	getByVideoID(ID) {
		return instance.get<IApiResultData<IVideoCourseSection[]>>(`${url}/GetByVideoCourse/${ID}`)
	},
	// Thêm mới data
	add(data: { VideoCourseId: number; Name: string }) {
		return instance.post(url, data)
	},
	// Cập nhật data
	update(params) {
		return instance.put(url, params)
	},
	updateIndex(params) {
		return instance.put(`${url}/ChangeIndex`, params)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
