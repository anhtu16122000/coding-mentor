import { instance } from '~/api/instance'

const url = '/api/Rules'
export const rulesApi = {
	getAll(params) {
		return instance.get<IApiResultData<IRules[]>>(url, { params })
	},
	update(data: any) {
		return instance.put(url, data, {})
	}
}
