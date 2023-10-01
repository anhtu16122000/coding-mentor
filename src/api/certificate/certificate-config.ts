import { instance } from '../instance'

const url = '/api/CertificateTemplate'

export const certificateConfigApi = {
	getGuide() {
		return instance.get<IApiResultCertificate<any[]>>(`${url}/guide`)
	},
	setConfig(data) {
		return instance.post(`${url}/Config`, data)
	},
	createCertificateConfig(data) {
		return instance.post(`${url}`, data)
	},
	updateCertificateConfig(data) {
		return instance.put(`${url}`, data)
	},
	getData() {
		return instance.get<{ message: string; data: { Content: string } }>(`${url}/GetData`)
	},
	getAll(querys: IQueryPage) {
		return instance.get<any>(`${url}?search.pageSize=${querys.pageSize}&search.pageindex=${querys.pageIndex}`)
	},
	getById(id: any) {
		return instance.get<IApiResultCertificate<any>>(url + `/${id}`)
	},
	deleteById(id: any) {
		return instance.delete<any>(url + `/${id}`)
	}
}
interface IQueryPage {
	pageSize: number
	pageIndex: number
}
