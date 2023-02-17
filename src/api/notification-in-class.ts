import { instance } from '~/api/instance'

const url = '/api/NotificationInClass'

export const notificationInClassApi = {

	getAll(todoApi: object) {
		return instance.get<IApiResultData<INotificationInClass[]>>(url, {
			params: todoApi
		})
	},

	add(data) {
		return instance.post(url, data)
	},

	
}