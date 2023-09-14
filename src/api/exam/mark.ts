import { log } from '~/common/utils'
import { instance } from '../instance'

const url = '/api/IeltsQuestionGroupResult'

export const MarkApi = {
	getAll(params: IGetExam) {
		return instance.get<IApiResultData<IExamsResponse[]>>(url, { params })
	},
	getByID(ID: number) {
		return instance.get<IApiResultData<any>>(`${url}/${ID}`)
	},
	getAnswerComment(params) {
		log.Yellow('GET: answer-comment: ', params)

		return instance.get<IApiResultData<IExamsResponse[]>>(url + '/answer-comment', { params })
	},
	post(data: IPostExam) {
		return instance.post(url + '/grading-essay', data)
	}
}

// IeltsExamResult
