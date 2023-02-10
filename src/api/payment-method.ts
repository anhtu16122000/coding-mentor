import { instance } from '~/api/instance'

const url = '/api/PaymentMethod'

export const paymentMethodsApi = {
	getAll(Params?: any) {
		return instance.get<IApiResultData<IPaymentMethod[]>>(url, {
			params: Params
		})
	},
	getByID(id) {
		return instance.get(`${url}/${id}`)
	},

	update(data: any) {
		return instance.put(url, data, {})
	}
}
