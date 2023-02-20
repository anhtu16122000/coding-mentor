import { instance } from '~/api/instance'

const url = '/api/CurriculumDetail'
export const curriculumDetailApi = {
	getAll(params) {
		return instance.get<IApiResultData<ICurriculumDetail[]>>(url, { params: params })
	},
	add(data) {
		return instance.post(url, data)
	},
	update(data) {
		return instance.put(url, data)
	},
	updateIndexCurriculumDetail(data) {
		return instance.put(`${url}/CurriculumDetailIndex`, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	},
	getFile(curriculumDetailID) {
		return instance.get(`${url}/file/${curriculumDetailID}`)
	},
	addFile(curriculumDetailID, file) {
		return instance.post(`${url}/file/${curriculumDetailID}`, file)
	},
	deleteFile(fileID) {
		return instance.delete(`${url}/file/${fileID}`)
	},
	updateIndexCurriculumDetailFile(data) {
		return instance.put(`${url}/FileCurriculumDetailIndex`, data)
	}
}
