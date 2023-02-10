import { instance } from '~/api/instance'

const url = '/api/UserBranch'
export const userBranchApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IUserBranch[]>>(url, {
			params: todoApi
		})
	},

	// Thêm mới data
	add(data: IUserBranch) {
		return instance.post(url, data)
	},

	// Cập nhật data
	update(data: any) {
		return instance.put(url, data, {})
	}
}
