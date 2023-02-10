import { instance } from '~/api/instance'

const url = '/api/SalaryOfTeacher'
export const teacherSalaryApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<ITeacherSalary[]>>(url, { params: Params })
	},
	getDetail(Params: any) {
		return instance.get<IApiResultData<ITeacherSalaryDetail[]>>('/api/SalaryOfTeacherDetail', { params: Params })
	},
	getFixExam(Params: any) {
		return instance.get<IApiResultData<ITeacherSalaryFixExam[]>>('/api/TeacherFixExam', { params: Params })
	}
}
