import { instance } from '~/api/instance'

const url = '/api/TutoringFee'

export const tutoringFeeApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ITutoringFee[]>>(url, {
			params
		})
	},
	add(data) {
		return instance.post(`${url}/insert-or-update`, data)
	},
	update(data) {
		return instance.put(url, data)
	},
    delete(id: number) {
		return instance.delete(`${url}/${id}`)
	},
    getTeacherAvailable() {
        return instance.get(`${url}/teacher-available`)
    }
}