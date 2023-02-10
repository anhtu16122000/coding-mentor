import { instance } from '~/api/instance'

const url = '/api/TestAppointment'
export const testAppointmentApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<ITestCustomer[]>>(url, {
			params: todoApi
		})
	},

	add(data: IStudent) {
		return instance.post(url, data, {})
	},

	update(data: any) {
		return instance.put(url, data, {})
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	},

	updateResult(data: any) {
		return instance.put(`${url}/UpdateResult`, data)
	}
}
