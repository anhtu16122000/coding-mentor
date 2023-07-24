import { instance } from '~/api/instance'

const url = '/api/StudyRoute'

export const studyRouteApi = {
	getStudentStudyRoute(todoApi: object) {
		return instance.get<IApiResultData<IStudentStudyRoute[]>>(`${url}/student-study-route`, {
			params: todoApi
		})
	},

	add(data: IStudentInClass) {
		return instance.post(url, data, {})
	},

	update(data: any) {
		return instance.put(url, data, {})
	},
    delete(id) {
		return instance.delete(`${url}/${id}`)
	},

    updateIndex(data) {
        return instance.post(`${url}/update-index`, data)
    }
    
}