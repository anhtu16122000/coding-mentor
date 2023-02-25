import { instance } from './instance'

const url = '/api/Transcript'
export const transcriptApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ITranscript[]>>(url, {
			params
		})
	},

    // thêm data
    add(data) {
		return instance.post(`${url}`, data)
	},

    updatePoint(data) { 
        return instance.put(`${url}/point-edit`, data)
    },

    // xóa data
    delete(ID) {
		return instance.delete(`${url}/${ID}`)
	},

    getTranscriptByClass(ID) {
        return instance.get(`${url}/by-class/${ID}`)
    },
    
    getTranscriptPoint(ID) {
        return instance.get(`${url}/point/${ID}`)
    },
    getPointByStudentClass(params) {
        return instance.get<IApiResultData<ITranscriptByStudentClass[]>>(`${url}/get-point-by-student-class`, { params })
    },
    getStudentPoint(params) {
        return instance.get(`${url}/student-point`, { params })
    }
}