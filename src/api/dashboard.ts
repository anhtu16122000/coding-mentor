import { instance } from './instance'

const URL = '/api/Dashboard'
export const dashboardApi = {
	getOverview() {
		return instance.get<IStatisticGetAll<any[]>>(`${URL}/Overview`)
	},
	getOverviewTeacher() {
		return instance.get<IGetOverviewTeacher<any[]>>(`${URL}/OverviewTeacher`)
	},
	getOverviewStudent() {
		return instance.get<IGetOverviewStudent<any[]>>(`${URL}/OverviewStudent`)
	},
	getStatisticGetInMonth() {
		return instance.get<IStatisticGetAllInMonth<any[]>>(`${URL}/StatisticGetInMonth`)
	},
	getStatisticAgeStudent() {
		return instance.get<IStatisticGetAgeStudent<any[]>>(`${URL}/StatisticAgeStudent`)
	},
	getStatisticTopCourse() {
		return instance.get<IStatisticGetTopCourse<any[]>>(`${URL}/StatisticTopCourse`)
	},
	getLearningDetails() {
		return instance.get<IStatisticGetTopCourse<any[]>>(`${URL}/Student/LearningDetails`)
	},
	getOverviewLearning(params) {
		return instance.get<IApiResultData<any[]>>(
			`${URL}/OverviewLearning?search.pageSize=${params.pageSize}&search.pageIndex=${params.pageIndex}&search.search=${params.search}`
		)
	},
	getOverviewVideoCourse(params) {
		return instance.get<IApiResultData<any[]>>(
			`${URL}/OverviewVideoCourse?search.pageSize=${params.pageSize}&search.pageIndex=${params.pageIndex}&search.search=${params.search}`
		)
	},
	getOverviewExam(params) {
		return instance.get<IApiResultData<any[]>>(
			`${URL}/OverviewExam?search.pageSize=${params.pageSize}&search.pageIndex=${params.pageIndex}&search.search=${params.search}`
		)
	},
	getOverviewUserInformation(params) {
		return instance.get<IApiResultData<any[]>>(
			`${URL}/OverviewUserInformation?search.pageSize=${params.pageSize}&search.pageIndex=${params.pageIndex}&search.search=${params.search}`
		)
	}
}
