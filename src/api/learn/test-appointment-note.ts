import { instance } from '~/api/instance'

const url = '/api/TestAppointmentNote'
export const testAppointmentNoteApi = {
	getAll(params) {
		return instance.get<IApiResultData<ITestCustomerNote[]>>(url, { params: params })
	},
	addNote(data) {
		return instance.post(url, data)
	},
	deleteNote(id) {
		return instance.delete(`${url}/${id}`)
	}
}
