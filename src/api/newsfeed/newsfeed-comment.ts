import { instance } from '~/api/instance'

const url = '/api/NewsFeedComment'
export const newsFeedCommentApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<INewsFeedComment[]>>(url, {
			params: todoApi
		})
	},

	// Thêm mới data
	add(data: any) {
		return instance.post(url, data)
	}
}
