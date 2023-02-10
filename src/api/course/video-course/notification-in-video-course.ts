import { instance } from '../../instance'

const url = '/api/NotificationInVideo'
export const NotificationInVideoCourseApi = {
	// Lấy tất cả data
	getAll(params: { videoCourseId: number; pageSize: number; pageIndex: number }) {
		return instance.get<IApiResultData<INotificationInVideoCourse[]>>(`${url}`, { params })
	},
	// Thêm mới data
	addNotification(data: { VideoCourseId: number; Title: string; Content: string }) {
		return instance.post(`${url}`, data)
	}
}
