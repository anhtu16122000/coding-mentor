import { instance } from '~/api/instance'

const url = '/api/CourseRegistration'

export const courseRegistrationApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<ICourseRegistration[]>>(url, {
			params: Params
		})
	},
	// chuyển học viên vào khóa
	intoCourse(data: ICourseRegistrationIntoCourse) {
		return instance.post('/api/InsertCourse', data)
	}
}
