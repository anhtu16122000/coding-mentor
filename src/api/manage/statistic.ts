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

export const staticsticalApi = {
	getOverview(params) {
		return instance.get('/api/Statistical/overview', {params})
	} ,
	getStudentAge(params) {
		return instance.get('/api/Statistical/student-age', {params})
	},
	getFeedBackRating(params) {
		return instance.get('/api/Statistical/feedback-rating', {params})
	},
	getNewClass(params) {
		return instance.get('/api/Statistical/new-class', {params})
	},
	getNewCustomer(params) {
		return instance.get('/api/Statistical/new-customer', {params})
	},
	getRevenue(params) {
		return instance.get('/api/Statistical/revenue', {params})
	},
	getTopLearningNeed(params) {
		return instance.get('/api/Statistical/top-learning-need', {params})
	},
	getTopPurpose(params) {
		return instance.get('/api/Statistical/top-purpose', {params})
	},
	getTopSource(params) {
		return instance.get('/api/Statistical/top-source', {params})
	},
	getTopJob(params) {
		return instance.get('/api/Statistical/top-job', {params})
	},
	getTotalScheduleTeacher(params) {
		return instance.get('/api/Statistical/total-schedule-teacher', {params})
	},
	getTotalScheduleStudent(params) {
		return instance.get('/api/Statistical/total-schedule-student', {params})
	},
	getRateTeacher(params) {
		return instance.get('/api/Statistical/rate-teacher', {params})
	},
	getStatisticialTestAppointment(params) {
		return instance.get('/api/Statistical/api/Dashboard/StatisticialTestAppointment', {params})
	},
	getStatisticalNewCustomerofsales(params) {
		return instance.get('/api/Statistical/new-customerofsales', {params})
	}
}