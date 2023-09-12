import { instance } from '../instance'

const url = '/api/DoingTest'

export const doingTestApi = {
	getAll(params) {
		return instance.get<IApiResultData<TIeltsExam[]>>(url, { params })
	},
	getDraft(params) {
		return instance.get<IApiResultData<any[]>>(url + '/draft', { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}/${ID}`)
	},
	getQuestionGroup(params) {
		return instance.get<IApiResultData<any>>(`${url}/ielts-question-group`, { params })
	},
	post(data) {
		return instance.post(url, data)
	},
	insertDetail(data) {
		return instance.post(url + '/insert-or-update-details', data)
	},
	put(data) {
		return instance.put(url, data)
	},
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	}
}
