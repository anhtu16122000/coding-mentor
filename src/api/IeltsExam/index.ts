import { instance } from '../instance'

const url = '/api/IeltsExam'

// API for new examination feature
export const ieltsExamApi = {
	getAll(params: IGetExam) {
		return instance.get<IApiResultData<TIeltsExam[]>>(url, { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<TIeltsExam>>(`${url}/${ID}`)
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
