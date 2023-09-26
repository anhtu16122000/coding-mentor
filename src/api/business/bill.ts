import { instance } from '~/api/instance'

const url = '/api/Bill'
export const billApi = {
	getAll(params) {
		return instance.get<IApiResultData<IBill[]>>(url, { params })
	},
	getClassAvailable(params) {
		return instance.get(`${url}/class-available`, { params: params })
	},
	getTuitionOption(params) {
		return instance.get(`${url}/tuition-package-option`, { params: params })
	},
	getStudentReserve(params) {
		return instance.get(`${url}/class-reserve-option`, { params: params })
	},
	getBillDetail(id) {
		return instance.get<IApiResultData<IBillDetail[]>>(`${url}/detail/${id}`)
	},
	add(data) {
		return instance.post(url, data)
	},
	v2(data) {
		return instance.post(url + '/v2', data)
	},
	tuition(data) {
		return instance.post(url + '/register-tuition-package', data)
	},
	getDiscountHistory(params) {
		return instance.get<IApiResultData<IGetDiscountHistory[]>>(`${url}/GetDiscountHistory`, { params })
	}
}
