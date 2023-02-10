import { instance } from './instance'

const url = '/api/ZoomRoom'

export const ZoomRoomApi = {
	get(params) {
		return instance.get<IApiResultData<IExamsResponse[]>>(`${url}/GetActive`, {
			params
		})
	},
	getRecordByID(seminarId: number) {
		return instance.get<IApiResultData<IRecord[]>>(`${url}/GetRecord/${seminarId}`)
	},
	post(seminarId) {
		return instance.post(`${url}/CreateRoom/${seminarId}`)
	},
	put(seminarID) {
		return instance.put(`${url}/CloseRoom/${seminarID}`)
	}
}
