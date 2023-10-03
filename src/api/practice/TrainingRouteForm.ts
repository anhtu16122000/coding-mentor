import { instance } from '../instance'

const url = '/api/TrainingRouteForm'

export const trainingRouteFormApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}/${ID}`)
	},
	post(data: IPostExam) {
		return instance.post(url, data)
	},
	saveIndex(data) {
		return instance.post(url + '/change-index', data)
	},
	put(data: IPostExam) {
		return instance.put(url, data)
	},
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	}
}
