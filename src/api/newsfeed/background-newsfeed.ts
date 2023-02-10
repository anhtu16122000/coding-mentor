import { instance } from '~/api/instance'

const url = '/api/Background'
export const backgroundNewsFeedApi = {
	// Lấy tất cả data
	getAll() {
		return instance.get<IApiResultData<IBackgroundNewsFeed[]>>(url)
	},

	// Lấy theo id
	getByID(id: number) {
		return instance.get<IApiResultDetail>(`url/${id}`)
	}
}
