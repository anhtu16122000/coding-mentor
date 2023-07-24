import { instance } from '~/api/instance'

const url = '/api/ScheduleAvailable'
export const scheduleAvailableApi = {
	getAll(scheduleParams: any) {
		return instance.get<IApiResultData<IScheduleAvailable[]>>(url, {
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
