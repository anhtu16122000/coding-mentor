import { instance } from '~/api/instance'

const url = '/api/Idiom'
export const idiomApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<IIdioms[]>>(url, {
			params: Params
		})
	},

	getRandom() {
		return instance.get(`${url}/random`)
	},

	update(data: IIdioms) {
		return instance.put(url, data, {})
	},

	add(data: IIdioms) {
		return instance.post(url, data)
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
