import { instance } from '~/api/instance'

const url = '/api/FeedbackCategorys'
export const feedbackApi = {
	getAll(Params: any) {
		return instance.get<IApiResultData<IFeedback[]>>(url, {
			params: Params
		})
	},
	update(data: IFeedback) {
		return instance.put(url, data, {})
	},
	add(data: IFeedback) {
		return instance.post(url, data)
	}
}
