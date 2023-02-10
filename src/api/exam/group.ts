import { instance } from '../instance'

const url = '/api/ExerciseGroup/'

export const examGroupsApi = {
	get(params) {
		return instance.get<IApiResultData<IExamsResponse[]>>(url, {
			params
		})
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}${ID}`)
	},
	getDetailByID(examID: number) {
		return instance.get<IApiResultData<any>>(`${url}Detail/${examID}`)
	},
	post(data) {
		return instance.post(url, data)
	},
	put(data) {
		return instance.put(url, data)
	},
	delete(examID: number) {
		return instance.delete(url + examID)
	},
	changeIndex(data) {
		return instance.put(url + 'ChangeIndex', data)
	}
}
