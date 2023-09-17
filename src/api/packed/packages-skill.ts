import { instance } from '../instance'

const url = '/api/PackageSkill'

export const packageSkillApi = {
	getAll(params: any) {
		return instance.get<IApiResultData<TIeltsExam[]>>(url, { params: { ...params, type: 2 } })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<TIeltsExam>>(`${url}/${ID}`)
	},
	post(data: any) {
		return instance.post(url, { ...data, type: 2 })
	},
	put(data: any) {
		return instance.put(url, data)
	},
	delete(Id: number) {
		return instance.delete(url + '/' + Id)
	}
}
