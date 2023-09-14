import { instance } from '../instance'

const url = '/api/IeltsExamResult'

export const examResultApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	getQuestions(params) {
		return instance.get<IApiResultData<any>>(`${url}/ielts-question-in-section-result`, { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}/${ID}`)
	},
	getDetailByID(examID: number) {
		return instance.get<{ totalPoint: string } & IApiResultData<any>>(`${url}/Detail/${examID}`)
	},
	getOverView(params) {
		return instance.get<{ totalPoint: string } & IApiResultData<any>>(`${url}/ielts-exam-result-overview`, { params })
	},
	post(data) {
		return instance.post(url, data)
	},
	addGroup(data) {
		return instance.post(url + 'AddExerciseGroup', data)
	},
	put(data) {
		return instance.put(url, data)
	},
	review(data) {
		return instance.put(url + '/review', data)
	},
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	}
}
