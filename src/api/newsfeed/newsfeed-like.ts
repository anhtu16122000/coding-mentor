import { instance } from '~/api/instance'

const url = '/api/NewsFeedLike'
export const newsFeedLikeApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<INewsFeedLike[]>>(url, {
			params: todoApi
		})
	},

	// Thêm mới data
	add(data: any) {
		return instance.post(url, data)
	}
}
