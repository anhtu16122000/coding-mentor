import { instance } from '../instance'

const url = '/api/IeltsExam'

// API for new examination feature
export const ieltsExamApi = {
	getAll(params: IGetExam) {
		return instance.get<IApiResultData<TIeltsExam[]>>(url, { params })
	},
	getOptions() {
		return instance.get<IApiResultData<TIeltsExam[]>>(url + '/option')
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<TIeltsExam>>(`${url}/${ID}`)
	},
	getQuestions(params) {
		return instance.get<IApiResultData<any>>(`${url}/ielts-question-in-section`, { params })
	},
	post(data: TInputIeltsExam) {
		return instance.post(url, data)
	},
	put(data: TInputIeltsExam & { ID: number | string }) {
		return instance.put(url, data)
	},
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	},
	getOverview(examID: number) {
		return instance.get<IApiResultData<TIeltsExamOverview>>(`${url}/overview`, { params: { ieltsExamId: examID } })
	}
}
