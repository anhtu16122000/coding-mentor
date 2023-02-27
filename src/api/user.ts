import { instance } from './instance'

const url = '/api/UserInformation'

export const userInformationApi = {
	getAllRole(role) {
		return instance.get<IApiResultData<IUserInformation[]>>('/api/UserInformation', {
			params: {
				RoleID: role
			}
		})
	},

	getByRole(role) {
		return instance.get<IApiResultData<IUserInformation[]>>(`${url}/user-available/${role}`)
	},

	getName(params) {
		return instance.get<IApiResultData<IUserInformation[]>>('/api/Staff', { params: params })
	},

	getRole(roleType) {
		return instance.get<IApiResultData<IRole[]>>('/api/GetRole', {
			params: {
				style: roleType // 0 lấy tất cả, 1 lấy nhân viên
			}
		})
	},

	getAll(params: IUserInputGetall) {
		return instance.get<IApiResultData<IUserResponse[]>>(url, {
			params
		})
	},
	getByID(ID) {
		return instance.get<IApiResultData<IUserResponse>>(`${url}/${ID}`)
	},
	getAllParams(params) {
		return instance.get<IApiResultData<IUserInformation[]>>('/api/UserInformation', {
			params
		})
	},
	add(data) {
		return instance.post(url, data)
	},
	update(data: { Enable?: boolean } & any) {
		return instance.put(url, data)
	},
	delete(data) {
		return instance.delete(`${url}/${data}`)
	},
	importUser(data) {
		let fData = new FormData()
		fData.append('File', data)
		return instance.post(`${url}/ImportStudent`, fData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	checkExistUserName(data: any) {
		return instance.post('/api/check-exist-username', data)
	}
}

export const uploadImageApi = {
	upload(file) {
		let dataFile = new FormData()
		dataFile.append('File', file)
		return instance.post<IApiResultData<any>>('/api/Base/Upload', dataFile, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	}
}

export const registerApi = {
	changeRegister(params: 'Allow' | 'UnAllow') {
		return instance.post<IApiResultData<any>>('/api/ChangeRegister/' + params, {})
	},
	getAllowRegister() {
		return instance.get<IApiResultData<any>>('/api/AllowRegister', {})
	},
	register(params) {
		return instance.post<IApiResultData<any>>('/api/Register/', params, {})
	}
}

export const accountApi = {
	changePassword(params) {
		return instance.post<IApiResultData<any>>('/api/ChangePassword', params, {})
	},
	forgotPassword(params) {
		return instance.post<IApiResultData<any>>('/api/KeyForgotPassword', params, {})
	},
	resetPassword(params) {
		return instance.post<IApiResultData<any>>('/api/ResetPassword', params, {})
	}
}

export const requestApi = {
	getAll(params) {
		return instance.get<IApiResultData<any>>('/api/ChangeInfo', { params })
	},
	getByID(ID) {
		return instance.get<IApiResultData<IUserResponse>>(`${'/api/ChangeInfo'}${ID}`)
	},
	add(data) {
		return instance.post('/api/ChangeInfo', data)
	},
	update(data: { Enable?: boolean } & any) {
		return instance.put('/api/ChangeInfo', data)
	},
	acceptUpdate(ID) {
		return instance.put(`/api/ChangeInfo/${ID}/Status/Approve`)
	},
	delete(data) {
		return instance.delete('/api/ChangeInfo/' + data)
	}
}

export const roleApi = {
	getRole(roleType) {
		return instance.get<IApiResultData<IRole[]>>('/api/GetRole', {
			params: {
				style: roleType // 0 lấy tất cả, 1 lấy nhân viên
			}
		})
	}
}

export const userInNewsFeedGroup = {
	getAllUserInRoom(params: { newsFeedGroupId: number }) {
		return instance.get<IApiResultData<any>>('/api/UserInNewsFeedGroup', {
			params
		})
	},
	addMember(params) {
		return instance.post('/api/UserInNewsFeedGroup', params)
	},
	getUserNotIn(groupId) {
		return instance.get(`/api/UserInNewsFeedGroup/user-not-in-group/${groupId}`, {})
	},

	deleteMember(memberId) {
		return instance.delete(`/api/UserInNewsFeedGroup/${memberId}`, {})
	}
}
