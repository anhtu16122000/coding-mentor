import { instance } from '~/api/instance'

const url = '/api/Invoice'

export const invoiceApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<IInvoice[]>>(url, {
			params: Params
		})
	}
}
