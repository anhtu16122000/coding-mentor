import { instance } from '../instance'

const url = '/api/Homework'

export const homeWorkApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	getTeacher(Id) {
		return instance.get<IApiResultData<any[]>>(url + '/teacher-available/' + Id, {})
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
