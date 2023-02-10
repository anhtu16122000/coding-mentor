import { instance } from '~/api/instance'

const url = '/api/StudyTime'
export const studyTimeApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IStudyTime[]>>(url, {
			params: todoApi
		})
	},

	update(data: any) {
		return instance.put(url, data, {})
	},
	add(data: IStudyTime) {
		return instance.post(url, data, {})
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
