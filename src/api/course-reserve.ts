import { instance } from '~/api/instance'

const url = '/api/CourseReserve'

export const courseReserveApi = {
	add(data: ICourseReserve) {
		return instance.post(url, data)
	},
	reserveAddCourse(data: ICourseReserve) {
		return instance.post('/api/ReserveInsertCourse', data)
	},
	update(data: { ID: string; ExpirationDate: string }) {
		return instance.put(url, data, {})
	},
	getAll(Params: any) {
		return instance.get<IApiResultData<ICourseReserve[]>>(url, {
			params: Params
		})
	}
}
