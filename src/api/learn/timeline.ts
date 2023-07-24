import { instance } from '../instance'

const url = '/api/TimeLine'
export const timeLineApi = {
	getAll(params) {
		return instance.get<IApiResultData<ITimeline[]>>(url, { params })
	},
	add(data) {
		return instance.post(`${url}`, data)
	},
	delete(ID) {
		return instance.delete(`${url}/${ID}`)
	}
}
