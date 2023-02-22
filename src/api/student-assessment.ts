import { instance } from '~/api/instance'

const url = '/api/StudentAssessment'

export const studentAssessmentApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IStudentAssessment[]>>(url, {
			params
		})
	},
    
    // thêm data
    add(data) {
		return instance.post(`${url}/InsertOrUpdate`, data)
	},

}