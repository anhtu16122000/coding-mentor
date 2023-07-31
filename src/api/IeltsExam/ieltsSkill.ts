import { instance } from '../instance'

const url = '/api/IeltsSkill'

// API for new examination feature
export const ieltsSkillApi = {
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
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	},
	getOverview(examID: number) {
		return instance.get<IApiResultData<TIeltsExamOverview>>(`${url}/overview`, { params: { ieltsExamId: examID } })
	}
}
