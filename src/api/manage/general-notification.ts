import { instance } from '~/api/instance'

const url = '/api/GeneralNotification'
export const generalNotificationApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<IGeneralNotification[]>>(url, {
			params: Params
		})
	},
	getReceiverById(id) {
		return instance.get<IApiResultData<IGeneralNotification[]>>(`${url}/receiver/${id}`)
	},
	add(data) {
		return instance.post(url, data)
	}
}
