import { instance } from '../../instance'

const url = '/api/Seminar'
export const SeminarApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ISeminar[]>>(`${url}`, { params })
	},
	getByID(ID) {
		return instance.get<IApiResultData<any>>(`${url}/${ID}`)
	},
	// Thêm mới data
	add(data: {
		Name: string
		Description: string
		StartTime: string
		EndTime: string
		VideoCourseId: number
		LeaderId: number
		Member: number
		Thumbnail: string
	}) {
		return instance.post(`${url}`, data)
	},
	update(data: {
		Name: string
		Description: string
		StartTime: string
		EndTime: string
		VideoCourseId: number
		LeaderId: number
		Member: number
		Thumbnail: string
		Id: number
	}) {
		return instance.put(`${url}`, data)
	},
	// Xóa
	delete(workshopID) {
		return instance.delete(`${url}/${workshopID}`)
	}
}
