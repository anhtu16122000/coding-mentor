import { instance } from '~/api/instance'

const url = '/api/Warning'
export const warningApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IWarning[]>>(url, {
			params: todoApi
		})
	}
}
