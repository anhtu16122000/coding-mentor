import { instance } from './instance'

const url = '/api/SetPackageResult'
export const setPackageResultApi = {
	// Lấy lịch sử làm bài
	getHistory(TYPE: number, ID: number) {
		return instance.get<IApiResultData<Array<IPackageHistory>>>(url + '/history/' + ID + '/type/' + TYPE)
	}
}
