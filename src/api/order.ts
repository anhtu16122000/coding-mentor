import { instance } from '~/api/instance'

const donePayUrl = '/api/Order/'
export const DonePayApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(
			`${donePayUrl}GetListOrder?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&search=${params.search}&PaymentStatus=${params.PaymentStatus}`
		)
	},
	// Cập nhật data
	update(data) {
		return instance.put(donePayUrl + 'UpdatePaidPayment', data)
	}
}
