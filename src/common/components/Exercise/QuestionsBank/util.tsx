import { ieltsQuestionGroupApi } from '~/api/IeltsExam/IeltsQuestionGroup'
import { ShowNoti } from '~/common/utils'

async function getQuestionsBank(params, callback) {
	try {
		const response = await ieltsQuestionGroupApi.getAll(params)
		if (response.status == 200) {
			callback(response.data, params)
		} else {
			callback({ ...response.data, data: [] }, params)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

async function getMoreQuestionsBank(params, callback) {
	try {
		const response = await ieltsQuestionGroupApi.getAll(params)
		if (response.status == 200) {
			callback(response.data)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

async function deleteQuestionsBank(params, callback) {
	try {
		const response = await ieltsQuestionGroupApi.delete(params)
		if (response.status == 200) {
			ShowNoti('success', 'Thành công')
			callback(response.data)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

export { getQuestionsBank, getMoreQuestionsBank, deleteQuestionsBank }
