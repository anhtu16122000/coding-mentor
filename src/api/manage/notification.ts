import { instance } from '~/api/instance'

const url = '/api/Notification'
export const notificationApi = {
	// Lấy tất cả data
	getAllSend(todoApi: object) {
		return instance.get<IApiResultData<INotificationBase[]>>(url, {
			params: todoApi
		})
	},

	getAll(todoApi: object) {
		return instance.get<IApiResultData<INotification[]>>(url, {
			params: todoApi
		})
	},

	add(data) {
		return instance.post(url, data)
	},

	seen(id) {
		return instance.put(`${url}/Seen/${id}`)
	},
	seenAll() {
		return instance.put(`${url}/SeenAll`)
	}
}
