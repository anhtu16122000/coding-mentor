import { packedApi } from '~/api/packed'
import { packageSectionApi } from '~/api/packed/packages-section'
import { ShowNoti } from '~/common/utils'

async function getPackageSection(params, callback) {
	try {
		const response = await packageSectionApi.getAll(params)
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

async function getMoregetPackageSection(params, callback) {
	try {
		const response = await packageSectionApi.getAll(params)
		if (response.status == 200) {
			callback(response.data)
		}
	} catch (error) {
		ShowNoti('error', error?.message)
	}
}

export { getPackageSection, getMoregetPackageSection }
