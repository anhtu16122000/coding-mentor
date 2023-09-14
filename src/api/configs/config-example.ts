import { instance } from '~/services/instance'

const url = '/api/Template'
export const configTemplateApi = {
	getAll() {
		return instance.get<IApiResultData<IConfigExample[]>>(url)
	},
	getTemplateByType(type) {
		return instance.get<IApiResultData<IConfigExample>>(`${url}/by-type/${type}`)
	},
	getGuide(type) {
		return instance.get<IApiResultData<IGuideExample[]>>(`${url}/guide/${type}`)
	},
	add(data) {
		return instance.post(url, data)
	},
	update(data) {
		return instance.put(url, data)
	}
}
