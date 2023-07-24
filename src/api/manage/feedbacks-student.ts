import { instance } from '~/api/instance'

const url = '/api/Feedback'
export const feedbackStudentApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<IFeedbackStudent[]>>(url, {
			params: Params
		})
	},
	getByID(ID) {
		return instance.get<IApiResultData<IFeedbackStudent>>(`${url}/${ID}`)
	},
	update(data) {
		return instance.put(url, data, {})
	},
	updateRating(data) {
		return instance.put(`${url}/rating-feedback/${data.Id}?rating=${data.Rating}`)
	},
	add(data) {
		return instance.post(url, data)
	},

}

const urlReply = '/api/FeedbackReply'
export const feedbackReplyApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<IFeedbackStudentReply[]>>(urlReply, {
			params: Params
		})
	},
	getByID(ID) {
		return instance.get<IApiResultData<IFeedbackStudentReply>>(`${urlReply}/${ID}`)
	},
	update(data) {
		return instance.put(urlReply, data, {})
	},
	delete(Id) {
		return instance.delete(`${urlReply}/${Id}`)
	},
	add(data) {
		return instance.post(urlReply, data)
	}
}
