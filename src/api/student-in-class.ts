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
		return instance.post(url, data, {})
	},

	update(data: any) {
		return instance.put(url, data, {})
	},

	delete(ID) {
		return instance.delete(`${url}/${ID}`)
	},
    
    getStudentAvailable(ID) {
        return instance.get(`${url}/student-available/${ID}`)
    }
}