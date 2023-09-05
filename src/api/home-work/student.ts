import { instance } from '../instance'

const url = '/api/StudentHomework'

export const studentHomeWorkApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}/${ID}`)
	},
	post(data: IPostExam) {
		return instance.post(url, data)
	},
	addGroup(data) {
		return instance.post(url + 'AddExerciseGroup', data)
	},
	put(data: IPostExam) {
		return instance.put(url, data)
	},
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	}
}
