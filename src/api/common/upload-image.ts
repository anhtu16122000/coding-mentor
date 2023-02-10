import { instance } from '../instance'

const url = '/api/Base'
export const UploadFileApi = {
	uploadImage(data) {
        let fData = new FormData
        fData.append("file", data )
		return instance.post(`${url}/Upload`, fData, {})
	},
}
