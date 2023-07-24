import { instance } from '../../instance'

const url = '/api/ZoomConfig'
export const ZoomConfigApi = {
	getAll() {
		return instance.get<IApiResultData<IZoomConfig[]>>(`${url}`)
	},
	getByID(id) {
		return instance.get<IApiResultData<IZoomConfig[]>>(`${url}/${id}`)
	},
	add(data: { UserZoom: string; APIKey: string; APISecret: string }) {
		return instance.post(`${url}`, data)
	},
	edit(data: { UserZoom: string; APIKey: string; APISecret: string; Id: number }) {
		return instance.put(`${url}`, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
