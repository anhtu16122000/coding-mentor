import { instance } from '~/api/instance'

const url = 'api/StudentInClass'

export const studentInClassApi = {
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IStudentInClass[]>>(url, {
			params: todoApi
		})
	},
	getWithID(ID: number) {
		return instance.get<IApiResultData<IStudentInClass>>(`${url}/${ID}`)
	},
	add(data: IStudentInClass) {
		return instance.post(`${url}/appends`, data, {})
	},
	adds(data: any) {
		return instance.post(`${url}/appends`, data, {})
	},
	update(data: any) {
		return instance.put(url, data, {})
	},
	delete(ID) {
		return instance.delete(`${url}/${ID}`)
	},
	getStudentAvailable(ID, classId) {
		return instance.get(`${url}/student-available?request.classId=${ID}&request.classFilterId=${classId}`)
	},
	getStudentAvailableV2(ID) {
		return instance.get(`${url}/student-available/`, {
			params: { classId: ID }
		})
	},
	getAllClass() {
		return instance.get<IApiResultData<any[]>>('api/Class')
	},
	getCers(params) {
		return instance.get(`${url}/certificate`, {
			params
		})
	},
	postCers(data) {
		return instance.post(`${url}/certificate`, data, {})
	},
	expCers(data) {
		console.log('----- Export data: ', data)

		return instance.post(`${url}/export-certificate`, data, {})
	},
	delCer(ID) {
		return instance.delete(`${url}/certificate/${ID}`)
	},
	// attendance-by-student
	attendanceByStudent(params: { 'request.classId'?: number; 'request.studentId'?: number }) {
		return instance.get(`${url}/attendance-by-student`, {
			params
		})
	}
}

export const studentHistoriesApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>('api/LearningHistory', { params })
	}
}
