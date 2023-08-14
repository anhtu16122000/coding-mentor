import { instance } from '../instance'

const url = '/api/IeltsGroup'

// API for new examination feature
export const ieltsGroupApi = {
	getAll(params) {
		return instance.get<IApiResultData<TIeltsExam[]>>(url, { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<TIeltsExam>>(`${url}/${ID}`)
	},
	post(data) {
		return instance.post(url, data)
	},
	put(data) {
		return instance.put(url, data)
	},
	changeIndex(data) {
		return instance.put(url + '/change-index', data)
	},
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	},
	getOverview(examID: number) {
		return instance.get<IApiResultData<TIeltsExamOverview>>(`${url}/overview`, { params: { ieltsExamId: examID } })
	}
}
