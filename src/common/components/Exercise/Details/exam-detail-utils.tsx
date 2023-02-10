import Router from 'next/router'
import { examApi } from '~/api/exam'
import { ShowNoti } from '~/common/utils'
import { decode } from '~/common/utils/super-functions'

/**
 * Async function get details of the exam from the exam id
 * After this function is called it will check the details and set the details to redux
 */
async function getExamDetails(canback) {
	try {
		const response = await examApi.getDetailByID(parseInt(decode(Router.query?.exam + '')))
		if (response.status == 200) {
			canback({ data: response.data.data, totalPoint: response.data.totalPoint })
		} else {
			canback(null)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
		canback(null)
	}
}

export { getExamDetails }
