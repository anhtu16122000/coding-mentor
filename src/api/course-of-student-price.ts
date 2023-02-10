import { instance } from '~/api/instance'

const url = '/api/CourseOfStudentPrice'

export const courseStudentPriceApi = {
	getDetail(id: number) {
		return instance.get<IApiResultData<ICourseOfStudentPrice>>(`${url}/${id}`)
	}
}
