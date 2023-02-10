import { instance } from '../../instance'

const url = '/api/SeminarRecord/'
export const SeminarRecordApi = {
	getByID(ID) {
		return instance.get<IApiResultData<any>>(`${url}${ID}`)
	},
	getBySeminarID(ID) {
		return instance.get<IApiResultData<any>>(`${url}BySeminar/${ID}`)
	},
	post(data) {
		return instance.post(url, data)
	},
	put(data) {
		return instance.put(url, data)
	},
	delete(examID: number) {
		return instance.delete(url + '/' + examID)
	}
}
