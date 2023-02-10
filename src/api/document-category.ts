import { instance } from '~/api/instance'

const url = '/api/DocumentCategory'

export const documentCategoryApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<ICategoryDocument[]>>(url, {
			params: Params
		})
	},
	add(data) {
		return instance.post(url, data)
	},
	// Edit and Delete
	update(data) {
		return instance.put(url, data)
	}
}
