import { instance } from '~/api/instance'

const url = '/api/NewsFeed'
export const newsFeedApi = {
	// Lấy tất cả data
	getAll(todoApi: object) {
		return instance.get<IApiResultData<INewsFeed[]>>(url, {
			params: todoApi
		})
	},

	// Thêm mới data
	add(data) {
		return instance.post(url, data)
	},

	// Cập nhật data
	update(data: any) {
		return instance.put(url, data, {})
	},
	// Cập nhật data
	delete(data: any) {
		return instance.put(url, data, {})
	},

	// Upload file
	uploadFile(file: any) {
		let fData = new FormData()
		fData.append('File', file)
		console.log('FDATA: ', fData)
		return instance.post('/api/uploadfile', fData, { headers: { ['Content-Type']: 'multipart/form-data' } })
	}
}
