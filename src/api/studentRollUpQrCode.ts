import { instance } from '~/api/instance'

const url = '/api/StudentRollUpQrCode'

export const studentRollUpQrCodeApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IStudentRollUpQrCode[]>>(`${url}`, {
			params: todoApi
		})
	},
	add(data) {
		return instance.post(`${url}/attendance-by-qr-code`, data, {})
	},

}