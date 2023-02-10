import { instance } from '../../instance'

const url = '/api/AnswerInVideo'
export const AnswerQuestionInVideoCourseApi = {
	// Lấy tất cả data
	getAll(questionID) {
		return instance.get<IApiResultData<IAnswerQuestionInVideoCourse[]>>(`${url}/GetByQuestion/${questionID}`)
	},
	// Thêm mới data
	addQuestion(data: { QuestionInVideoId: number; Content: string }) {
		return instance.post(`${url}`, data)
	},
	// Xóa
	deleteQuestion(answerID) {
		return instance.delete(`${url}/${answerID}`)
	}
}
