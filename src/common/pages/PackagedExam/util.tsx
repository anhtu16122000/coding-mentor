import { packedApi } from '~/api/packed'
import { ShowNoti } from '~/common/utils'

async function getPacked(params, callback) {
	try {
		const response = await packedApi.getAll(params)
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

async function getMorePacked(params, callback) {
	try {
		const response = await packedApi.getAll(params)
		if (response.status == 200) {
			callback(response.data)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

export { getPacked, getMorePacked }
