import { instance } from '~/api/instance'

const url = '/api/FrequentlyQuestion/'

export const faqApi = {
	getAll(Params: any) {
		return instance.get(url, { params: Params })
	},
	// instance.get<IApiResultData<IFaq[]>>(url, { params: Params });

	update(data) {
		return instance.put(url, data, {})
	},
	add(data) {
		return instance.post(url, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
