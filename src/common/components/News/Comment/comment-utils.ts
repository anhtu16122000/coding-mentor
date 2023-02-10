import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'

export async function putComment(params: { apiParams: any; setLoading: Function; onSuccess: Function }) {
	params.setLoading(true)
	try {
		const response = await RestApi.put('NewsFeedComment', params.apiParams)
		if (response.status == 200) {
			params.onSuccess()
		}
	} catch (error) {
		ShowNostis.error(error.message)
	} finally {
		params.setLoading(false)
	}
}

export async function getCommentReply(params: { apiParams: any; setData: Function; setLoading: Function; setTotal: Function }) {
	params.setLoading(true)
	try {
		const response = await RestApi.get<any>('NewsFeedReply', params.apiParams)
		if (response.status == 200) {
			params.setData(response.data.data)
			params.setTotal(response.data.totalRow)
		} else {
			params.setData([])
			params.setTotal(0)
		}
	} catch (error) {
		ShowNostis.error(error.message)
	} finally {
		params.setLoading(false)
	}
}

export async function putReply(params: { apiParams: any; setLoading: Function; onSuccess: Function }) {
	params.setLoading(true)
	try {
		const response = await RestApi.put('NewsFeedReply', params.apiParams)
		if (response.status == 200) {
			params.onSuccess()
		}
	} catch (error) {
		ShowNostis.error(error.message)
	} finally {
		params.setLoading(false)
	}
}
