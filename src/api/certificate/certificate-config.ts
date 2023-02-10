import { instance } from '../instance'

const url = '/api/CertificateConfig'

export const certificateConfigApi = {
	getGuide() {
		return instance.get<IApiResultCertificate<any[]>>(`${url}/GetGuide`)
	},
	setConfig(data) {
		return instance.post(`${url}/Config`, data)
	},
	getData() {
		return instance.get<{ message: string; data: { Content: string } }>(`${url}/GetData`)
	}
}
