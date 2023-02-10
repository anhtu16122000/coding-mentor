import { instance } from '~/api/instance'

const url = '/api/CommentReply'
export const newsFeedCommentReplyApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<INewsFeedCommentReply[]>>(url, {
			params: todoApi
		})
	},

	// Thêm mới data
	add(data: INewsFeedCommentReply) {
		return instance.post(url, data)
	},

	// Update data
	update(data: any) {
		return instance.put(url, data)
	}
}
