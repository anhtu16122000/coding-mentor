import { instance } from '~/api/instance'

const url = '/api/Permission'

export const permissionApi = {
	getFunctionPermission() {
		return instance.get<IApiResultData<IFunctionPermission[]>>(url)
	},
	searchPermession(params) {
		return instance.get<IApiResultData<IFunctionPermission[]>>(url, { params: params })
	},
	update(data) {
		return instance.put(url, data)
	},
	getRolePermission() {
		return instance.get<IApiResultData<IRolePermission[]>>(`${url}/role`)
	},
	getRoleStaff() {
		return instance.get<IApiResultData<IRolePermission[]>>(`${url}/role-staff`)
	}
}
