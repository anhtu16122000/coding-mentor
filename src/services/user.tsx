import { instance } from './instance'

export const getPublicContent = async () => {
	try {
		const res = await instance.get('/test/all')
		return res
	} catch (error) {
		return Promise.reject(error)
	}
}

export const getUserBoard = async () => {
	try {
		const res = await instance.get('/test/user')
		return res
	} catch (error) {
		return Promise.reject(error)
	}
}

export const getModeratorBoard = async () => {
	try {
		const res = await instance.get('/test/mod')
		return res
	} catch (error) {
		return Promise.reject(error)
	}
}

export const getAdminBoard = async () => {
	try {
		const res = await instance.get('/test/admin')
		return res
	} catch (error) {
		return Promise.reject(error)
	}
}
