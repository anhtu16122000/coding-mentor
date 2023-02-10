import { instance } from '~/api/instance'

const url = '/api/Parents'

export const parentsApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<IParents[]>>(url, {
			params: Params
		})
	},
	add(data: IParents) {
		return instance.post(url, data)
	},

	update(data: any) {
		return instance.put(url, data, {})
	}
}
