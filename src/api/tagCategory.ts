import { instance } from '~/api/instance'

const url = '/api/TagCategory'
export const tagCategoryApi = {
	getAll(tagParam?: {type: number, pageSize: number, pageIndex: number}) {
		return instance.get<IApiResultData<ITag[]>>(url, {
			params: tagParam
		})
	},
	add(data: ITag) {
		return instance.post(url, data)
	},
	delete(id: number) {
		return instance.delete(`${url}/${id}`)
	}
}

