import { instance } from '../instance'

const RestApi = {
	get<T>(url: string, params: Object) {
		return instance.get<TRestApiResult<T>>(`/api/${url}`, {
			params
		})
	},
	getByID<T>(url: string, ID: string, subUrl?: string) {
		return instance.get<TRestApiResult<T>>(`/api/${url}/${ID}${!!subUrl ? `/${subUrl}` : ''}`)
	},
	post(url: string, data: Object) {
		return instance.post(`/api/${url}`, data)
	},
	put(url: string, data: Object) {
		return instance.put(`/api/${url}`, data)
	},
	delete(url: string, id: Object) {
		return instance.delete(`/api/${url}/${id}`)
	},
	getPermission<T>(currentRole: any, controller: string) {
		return instance.get<TRestApiResult<T>>('/api/Role/permission/controller-action', {
			params: { code: currentRole, controller: controller }
		})
	}
}

export default RestApi
