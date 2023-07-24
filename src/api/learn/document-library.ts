import { instance } from '~/api/instance'

const url = '/api/DocumentLibrary'
export const documentLibraryApi = {
	getAll(todoApi) {
		return instance.get<IApiResultData<IDocumentLibrary[]>>(url, {
			params: todoApi
		})
	},
	getByID(ID) {
		return instance.get<IApiResultData<IDocumentLibrary>>(`${url}/${ID}`)
	},

	// Thêm mới data
	add(data) {
		return instance.post(url, data, {})
	},

	addFile(data) {
		return instance.post(`${url}/api/FileInDocumentLibrary/UploadFile`, data)
	},

	// Cập nhật data
	update(data) {
		return instance.put(url, data, {})
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}

const urlFile = '/api/DocumentLibraryDirectory'
export const documentLibraryDirectoryApi = {
	getAll(todoApi) {
		return instance.get<IApiResultData<IDocumentLibrary[]>>(urlFile, {
			params: todoApi
		})
	},
	getByID(ID) {
		return instance.get<IApiResultData<IDocumentLibrary>>(`${urlFile}/${ID}`)
	},

	// Thêm mới data
	add(data) {
		return instance.post(urlFile, data, {})
	},

	// Cập nhật data
	update(data) {
		return instance.put(urlFile, data, {})
	},

	delete(id) {
		return instance.delete(`${urlFile}/${id}`)
	}
}
