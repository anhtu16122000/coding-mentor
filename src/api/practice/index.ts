import { instance } from '../instance'

const url = '/api/TrainingRoute'

export const trainingRouteApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	getForm(params) {
		return instance.get<IApiResultData<any[]>>(url + '/form', { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}/${ID}`)
	},
	post(data: IPostExam) {
		return instance.post(url, data)
	},
	put(data: IPostExam) {
		return instance.put(url, data)
	},
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	}
}
