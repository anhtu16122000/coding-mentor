import Router from 'next/router'
import { examApi } from '~/api/exam'
import { examSectionsApi } from '~/api/exam/section'
import { ShowNoti } from '~/common/utils'
import { decode } from '~/common/utils/super-functions'

/**
 * Function call api method to create a new section
 * @param param all values of the form and the exam id
 *
 * After this function is called the loading is set to false
 */
async function postNewSection(param: TPostSection, callback) {
	try {
		const response = await examSectionsApi.post({ ...param })
		if (response.status == 200) {
			callback(true)
		}
	} catch (error) {
		ShowNoti('error', error.message)
		callback(false)
	}
}

/**
 * Function call api method to update a section
 * @param param all values of the form and the section id
 *
 * After this function is called the loading is set to false
 */
async function putUpdateSection(param, callback) {
	try {
		const response = await examSectionsApi.put(param)
		if (response.status == 200) {
			ShowNoti('success', response.data.message)
			callback(true)
		}
	} catch (error) {
		ShowNoti('error', error.message)
		callback(false)
	}
}

export { postNewSection, putUpdateSection }
