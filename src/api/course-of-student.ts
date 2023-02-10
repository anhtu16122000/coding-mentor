import { instance } from '~/api/instance'

const url = '/api/CourseOfStudent'

export const courseOfStudentApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<ICourseOfStudent[]>>(url, {
			params: Params
		})
	}
}
