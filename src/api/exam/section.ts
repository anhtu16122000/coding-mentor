import { instance } from '../instance'

const url = '/api/ExamSection/'

export const examSectionsApi = {
	get(params: IGetExam) {
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
	post(data: TPostSection) {
		return instance.post(url, data)
	},
	put(data: IPostExam) {
		return instance.put(url, data)
	},
	delete(examID: number) {
		return instance.delete(url + examID)
	},
	changeIndex(data) {
		return instance.put(url + 'ChangeSectionIndex', data)
	}
}
