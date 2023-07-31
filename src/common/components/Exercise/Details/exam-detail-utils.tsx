import Router from 'next/router'
import { ieltsExamApi } from '~/api/IeltsExam'
import { examApi } from '~/api/exam'
import { ShowNoti } from '~/common/utils'
import { decode } from '~/common/utils/super-functions'

/**
 * Async function get details of the exam from the exam id
 * After this function is called it will check the details and set the details to redux
 */
async function getExamDetails(canback) {
	try {
		const response: any = await ieltsExamApi.getByID(parseInt(decode(Router.query?.exam + '')))
		if (response.status == 200) {
			canback({ data: response.data.data, totalPoint: response.data.Point })
		} else {
			canback(null)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
		canback(null)
	}
}

export { getExamDetails }
