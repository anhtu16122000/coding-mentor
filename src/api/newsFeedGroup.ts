import { instance } from '~/api/instance'

const url = '/api/NewsFeedGroup'

export const learningNeedApi = {
	getAllClassAvailable() {
        return instance.get<IApiResultData<ILearningNeeds[]>>(url)
    }
}
