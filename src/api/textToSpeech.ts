import { instance } from '~/api/instance'

const url = '/api/Python'
export const textToSpeech = {
	convertTextToSpeech(data) {
		return instance.post(`${url}/convert-text-to-speech`, data)
	},
}