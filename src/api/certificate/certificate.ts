import { instance } from '../instance'

const url = '/api/Certificate'
interface IData {
	data: ICertificate[]
	totalRow: number
}

export const certificateApi = {
	getAll(userId, videoCourseId, pageSize, pageIndex) {
		return instance.get<IData>(
			`${url}?search.userId=${userId}&search.videoCourseId=${videoCourseId}&search.pageSize=${pageSize}&search.pageIndex=${pageIndex}`
		)
	},
	
	getById(id) {
		return instance.get<any>(`${url}/${id}`)
	},
	
	updateCertificate(data) {
		return instance.put(`${url}`, data)
	},

	certificateStudentApi(videoCourseId: number | string, studentId: number | string) {
		return instance.post<any>(`${url}/${videoCourseId}/for-student/${studentId}`)
	},

	exportCertificatePDFApi(params) {
		return instance.post<any>(`${url}/export-pdf`, params)
	}
}
