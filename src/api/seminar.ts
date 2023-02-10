import { instance } from './instance'

const URL = '/api/Seminar'

export const seminarApi = {
	getAll(params) {
		return instance.get<IGetAllSeminar<ISeminar[]>>(`${URL}?search.pageSize=${params}`)
	}
}
