import { instance } from '../../instance'

const url = '/api/product'
export const VideoCourseApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCourse[]>>(url, {
			params
		})
	},
	getByID(ID) {
		return instance.get<IApiResultData<IVideoCourse>>(`${url}/${ID}`)
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data)
	},
	// Cập nhật data
	update(params) {
		return instance.put(url, params)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
