import { instance } from '~/api/instance'

const url = '/api/GroupNewsFeed'
export const groupNewsFeedApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<IGroupNewsFeed[]>>(url, {
			params: todoApi
		})
	},

	// Lấy theo id
	getByID(id: number) {
		return instance.get<IApiResultData<IGroupNewsFeed>>(`url/${id}`)
	},

	// Thêm mới data
	add(data) {
		return instance.post('url', data)
	},

	// Cập nhật data
	update(data: any) {
		return instance.put('url', data, {})
	},

	// Upload background
	uploadImage(file: any) {
		let fData = new FormData()
		fData.append('File', file)
		console.log('FDATA: ', fData)
		return instance.post('/api/uploadfileGroup', fData, {})
	}
}
