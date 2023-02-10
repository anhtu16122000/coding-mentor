import { instance } from '~/api/instance'

export const studentApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IStudent[]>>('/api/Student/', {
			params: todoApi
		})
	},

	getWithID(ID: number) {
		return instance.get<IApiResultData<IStudent>>(`/api/Student/${ID}`)
	},

	add(data: IStudent) {
		return instance.post('/api/Student', data, {})
	},

	update(data: any) {
		return instance.put('/api/Student/', data, {})
	}
}
