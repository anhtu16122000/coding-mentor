import { instance } from '~/api/instance'

const url = '/api/elsa'
export const elsaSpeakApi = {
	addFile(data) {
		return instance.post(`${url}/file`, data)
	},
	scripted(data) {
		return instance.post(`${url}/scripted`, data)
	},
}