import { instance } from '~/api/instance'

const url = '/api/Discount'
export const discountApi = {
	getAll(todoApi?: object) {
		return instance.get<IApiResultData<IDiscount[]>>(url, { params: todoApi })
	},
	add(data: IDiscount) {
		return instance.post(url, data, {})
	},
	update(data: any) {
		return instance.put(url, data, {})
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
export const voucherApi = {
	getVoucher(data: number[]) {
		return instance.post('api/Discount/lesson-over', data, {})
	},
}
