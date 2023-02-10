import { instance } from '~/api/instance'

const url = '/api/CourseOfStudentChange/'

export const studentChangeCourseApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IStudentOfChangeCourse[]>>(url, {
			params: todoApi
		})
	},

	changeCourse(data: ICourseOfStudentChange) {
		return instance.post(url, data, {})
	}
}
