import { instance } from '../instance'

const url = '/api/Exam'

export const examApi = {
	getAll(params: IGetExam) {
		return instance.get<IApiResultData<IExamsResponse[]>>(url, {
			params
		})
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}/${ID}`)
	},
	getDetailByID(examID: number) {
		return instance.get<{ totalPoint: string } & IApiResultData<any>>(`${url}/Detail/${examID}`)
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
	},
	addRandom(data) {
		return instance.post(`${url}/${data?.sectionId}/addRandom/${data?.amount}/type/${data?.type}`, data)
	}
}
