import { instance } from '~/api/instance'

const url = '/api/Schedule'
export const scheduleApi = {
	getAll(scheduleParams: any) {
		return instance.get<IApiResultData<ISchedule[]>>(url, {
			params: scheduleParams
		})
	},
	add(data) {
		return instance.post(url, data)
	},

	update(data) {
		return instance.put(url, data, {})
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
