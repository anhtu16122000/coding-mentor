import { ieltsExamApi } from '~/api/IeltsExam'
import { examApi } from '~/api/exam'
import { ShowNoti } from '~/common/utils'

async function getExams(params, callback) {
	try {
		const response = await ieltsExamApi.getAll(params)
		if (response.status == 200) {
			callback(response.data)
		} else {
			console.log(response.data)

			callback({ ...response.data, data: [] })
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

async function getMoreExams(params, callback) {
	try {
		const response = await ieltsExamApi.getAll(params)
		if (response.status == 200) {
			callback(response.data)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

export { getExams, getMoreExams }
