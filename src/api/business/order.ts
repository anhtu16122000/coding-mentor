import { instance } from '~/api/instance'

const donePayUrl = '/api/Order/'
export const DonePayApi = {
	getAll(params) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(
			`${donePayUrl}GetListOrder?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&search=${params.search}&PaymentStatus=${params.PaymentStatus}`
		)
	},
	update(data) {
		return instance.put(donePayUrl + 'UpdatePaidPayment', data)
	}
}
