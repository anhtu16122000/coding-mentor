import { instance } from '~/api/instance'

export const statisticalTotalApi = {
	// ****** teacher ****** //
	getTotalLessonOfTeacher(params) {
		return instance.get('/api/Dashboard/TotalLesson_Teacher', { params })
	},
	getTeachingDetail(params) {
		return instance.get('/api/Dashboard/GetTeachingDetail', { params })
	}
}
