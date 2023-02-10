import { instance } from '../../instance'

const url = '/api/ZoomConfig'
export const ZoomConfigApi = {
	// Lấy tất cả data
	getAll() {
		return instance.get<IApiResultData<IZoomConfig[]>>(`${url}`)
	},
	getByID(id) {
		return instance.get<IApiResultData<IZoomConfig[]>>(`${url}/${id}`)
	},
	// Thêm mới data
	add(data: { UserZoom: string; APIKey: string; APISecret: string }) {
		return instance.post(`${url}`, data)
	},
	edit(data: { UserZoom: string; APIKey: string; APISecret: string; Id: number }) {
		return instance.put(`${url}`, data)
	},
	// Xóa
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
