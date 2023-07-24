import { instance } from '~/api/instance'

const url = '/api/LearningNeed'

export const learningNeedApi = {
	getAll(Params: object) {
		return instance.get<IApiResultData<ILearningNeeds[]>>(url, { params: Params })
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
