import { instance } from '~/api/instance'

const url = '/api/Curriculum'

export const curriculumApi = {
	getAll(params) {
		return instance.get<IApiResultData<ICurriculum[]>>(url, { params: params })
	},
	getDetails(Id) {
		return instance.get<IApiResultData<ICurriculumDetail>>(`${url}/${Id}`)
	},
	add(data) {
		return instance.post(url, data)
	},
	update(data) {
		return instance.put(url, data)
	},
	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
