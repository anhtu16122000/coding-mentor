import { instance } from '~/api/instance'

const url = '/api/Bill'
export const billApi = {
	getAll(params) {
		return instance.get<IApiResultData<IBill[]>>(url, {
			params
		})
	},
	getClassAvailable(params) {
		return instance.get(`${url}/class-available`, { params: params })
	},
	getBillDetail(id) {
		return instance.get<IApiResultData<IBillDetail[]>>(`${url}/detail/${id}`)
	},

	add(data) {
		return instance.post(url, data)
	},
	getDiscountHistory(params) {
		return instance.get<IApiResultData<IGetDiscountHistory[]>>(`${url}/GetDiscountHistory`, {
			params
		})
	}
}
