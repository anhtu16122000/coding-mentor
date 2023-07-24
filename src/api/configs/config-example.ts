import { instance } from '~/api/instance'

const url = '/api/Template'
export const configTemplateApi = {
	// Lấy tất cả data có phân trang
	getAll() {
		return instance.get<IApiResultData<IConfigExample[]>>(url)
	},

	getTemplateByType(type) {
		return instance.get<IApiResultData<IConfigExample>>(`${url}/by-type/${type}`)
	},

	getGuide(type) {
		return instance.get<IApiResultData<IGuideExample[]>>(`${url}/guide/${type}`)
	},

	// Thêm mới data
	add(data) {
		return instance.post(url, data)
	},

	// Cập nhật data
	update(data) {
		return instance.put(url, data)
	}
}
