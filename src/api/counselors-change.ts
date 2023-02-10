import { instance } from '~/api/instance'

const url = '/api/CounselorsChange/'

export const counselorsChangeApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IStudentChange[]>>(url, {
			params: todoApi
		})
	},

	addNote(data: IStudent) {
		return instance.post(url, data, {})
	},

	update(data: any) {
		return instance.put(url, data, {})
	},

	add(data: IStudent) {
		return instance.post(url, data, {})
	}
}
