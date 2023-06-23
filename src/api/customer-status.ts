import { instance } from '~/api/instance'

const url = '/api/CustomerStatus'

export const customerStatusApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<IConsultationStatus[]>>(url, {
			params: Params
		})
	},
	count() {
		return instance.get<IApiResultData<IConsultationStatus[]>>(url + '/status-count', {})
	},
	add(data: IConsultationStatus) {
		return instance.post(url, data)
	},
	update(data: IConsultationStatus) {
		return instance.put(url, data, {})
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
