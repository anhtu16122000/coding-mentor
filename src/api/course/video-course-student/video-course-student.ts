import { instance } from '../../instance'

const url = '/api/VideoCourseStudent'

export const VideoCourseStudentApi = {
	createCertificate() {
		return instance.post(`${url}/CreateCertificate`)
	}
}
