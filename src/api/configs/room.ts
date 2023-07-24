import { instance } from '~/api/instance'

const url = '/api/Room'
export const roomApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IRoom[]>>(url, { params: todoApi })
	},
	update(data: any) {
		return instance.put(url, data)
	},
	add(data: IRoom) {
		return instance.post(url, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
