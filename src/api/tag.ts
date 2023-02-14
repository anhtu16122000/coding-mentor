import { instance } from '~/api/instance'

const url = '/api/Tag'
export const tagApi = {
	getAllTagByTagCeteId(tagParam?: {tagCategoryId: number, pageSize: number, pageIndex: number}) {
		return instance.get<IApiResultData<ITag[]>>(url, {
			params: tagParam
		})
	},
	add(data: ITag) {
		return instance.post(url, data)
	},
	deleteTag(id: number) {
		return instance.delete(`${url}/${id}`)
	}
}

