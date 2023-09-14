import { instance } from '~/api/instance'

const url = '/api/Schedule'
export const scheduleApi = {
	getAll(scheduleParams: any) {
		return instance.get<IApiResultData<ISchedule[]>>(url, {
			params: scheduleParams
		})
	},
	getDetails(Id) {
		return instance.get<IApiResultData<ICurriculumDetail>>(`${url}/${Id}`)
	},
	add(data) {
		return instance.post(url, data)
	},
	adds(data) {
		return instance.post(`${url}/multiple`, data)
	},
	check(data:any) {
		return instance.post(`${url}/validate`, data)
	},

	update(data) {
		return instance.put(url, data, {})
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	},
	cancelTutoring(id) {
		return instance.put(`${url}/tutoring-cancel/${id}`)
	},
	updateRateTeacher(data) {
		return instance.put(`${url}/rate-teacher`, data, {})
	}
}
