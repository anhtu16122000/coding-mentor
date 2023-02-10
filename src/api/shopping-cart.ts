import { instance } from '~/api/instance'

export const shoppingCartApi = {
	getOrderDetail(data) {
		return instance.get(`/api/order/orderdetail/${data}`)
	}
}
