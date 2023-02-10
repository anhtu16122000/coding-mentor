import { examApi } from '~/api/exam'
import { ShowNoti } from '~/common/utils'

async function getExams(params, callback) {
	try {
		const response = await examApi.getAll(params)
		if (response.status == 200) {
			callback(response.data)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

async function getMoreExams(params, callback) {
	try {
		const response = await examApi.getAll(params)
		if (response.status == 200) {
			callback(response.data)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

export { getExams, getMoreExams }
