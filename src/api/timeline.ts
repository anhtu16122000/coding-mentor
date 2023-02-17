import { instance } from './instance'

const url = '/api/TimeLine'

export const timeLineApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ITimeline[]>>(url, {
			params
		})
	},

    // thêm data
    add(data) {
		return instance.post(`${url}`, data)
	},


    // xóa data
    delete(ID) {
		return instance.delete(`${url}/${ID}`)
	},

}