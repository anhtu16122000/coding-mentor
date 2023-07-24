import { instance } from '../instance'

export const accountApi = {
	getAccount() {
		return instance.get<IAccount<IDataAccount[]>>('/api/getAccount')
	},
	loginDev(data) {
		return instance.post('/api/LoginDev', data)
	},
	newToken() {
		return instance.post('/api/NewToken')
	}
}
