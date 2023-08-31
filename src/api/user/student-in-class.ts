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

	update(data: any) {
		return instance.put(url, data, {})
	},

	delete(ID) {
		return instance.delete(`${url}/${ID}`)
	},

	getStudentAvailable(ID, classId) {
		return instance.get(`${url}/student-available?request.classId=${ID}&request.classFilterId=${classId}`)
	},
	getAllClass() {
		return instance.get<IApiResultData<any[]>>('api/Class')
	},
}

export const studentHistoriesApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>('api/LearningHistory', { params })
	}
}
