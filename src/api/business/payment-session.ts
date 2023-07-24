import { instance } from '~/api/instance'

const url = '/api/PaymentSession'

export const paymentSessionApi = {
	getAll(Params?: any) {
		return instance.get<IApiResultData<IPaymentSession[]>>(url, {
			params: Params
		})
	},
	getByID(id) {
		return instance.get(`${url}/${id}`)
	},
	add(data: any) {
		return instance.post(url, data)
	},
	update(data: any) {
		return instance.put(url, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
