import { instance } from '~/api/instance'

const url = '/api/Branch'
export const branchApi = {
	getAll(todoApi?: object) {
		return instance.get<IApiResultData<IBranch[]>>(url, { params: todoApi })
	},
	add(data: IBranch) {
		return instance.post(url, data)
	},
	update(data: any) {
		return instance.put(url, data, {})
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
