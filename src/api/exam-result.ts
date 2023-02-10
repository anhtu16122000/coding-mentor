import { instance } from './instance'

const url = '/api/ExamResult/'

export const examResultApi = {
	get(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}Detail/${ID}`)
	},
	submit(data) {
		return instance.post(url + 'Submit', data)
	}
}
