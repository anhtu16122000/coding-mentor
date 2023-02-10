import { instance } from '~/api/instance'

const url = '/api/GroupUserNewsFeed'
export const userGroupNewsFeedApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IUserGroupNewsFeed[]>>(url, {
			params: todoApi
		})
	},

	// Lấy theo id
	getByID(id: number) {
		return instance.get<IApiResultData<IUserGroupNewsFeed[]>>(`${url}/${id}`)
	},

	// Thêm mới data
	add(data) {
		return instance.post(url, data)
	},

	// Cập nhật data
	update(data: any) {
		return instance.put(url, data, {})
	}
}
