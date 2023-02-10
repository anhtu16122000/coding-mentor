import { instance } from '../../instance'

const url = '/api/QuestionInVideo'
export const QuestionInVideoCourseApi = {
	// Lấy tất cả data
	getAll(params: { videoCourseId: number; pageSize: number; pageIndex: number }) {
		return instance.get<IApiResultData<IQuestionInVideoCourse[]>>(`${url}`, { params })
	},
	// Thêm mới data
	addQuestion(data: { VideoCourseId: Number; Content: string }) {
		return instance.post(`${url}`, data)
	},
	// Xóa
	deleteQuestion(questionID) {
		return instance.delete(`${url}/${questionID}`)
	}
}
