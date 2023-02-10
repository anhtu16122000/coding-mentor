import { instance } from './instance'

const url = '/api/Area?pageSize=999&pageIndex=1'

export const areaApi = {
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, { params })
	},
	add(data: IArea) {
		return instance.post(url, data)
	},
	// Cập nhật data
	update(data: IArea) {
		return instance.put(url, data)
	},
	delete(data: IArea) {
		return instance.put(url, data)
	}
}

export const districtApi = {
	getAllByArea(areaId: number) {
		return instance.get<IApiResultData<any[]>>('api/District?pageSize=999&pageIndex=1&areaId=' + areaId)
	},
	getAll(params) {
		return instance.get<IApiResultData<IDistrict[]>>('/api/District', { params })
	},
	add(data: IDistrict) {
		return instance.post('/api/District', data)
	},
	// Cập nhật data
	update(data: IDistrict) {
		return instance.put('/api/District', data)
	},
	delete(data: IDistrict) {
		return instance.put('/api/District', data)
	}
}

export const wardApi = {
	getAllByDistrict(areaId: number) {
		return instance.get<IApiResultData<any[]>>('api/Ward?pageSize=999&pageIndex=1&districtId=' + areaId)
	},
	getAll(params) {
		return instance.get<IApiResultData<IWard[]>>('/api/Ward', { params })
	},
	add(data: IWard) {
		return instance.post('/api/Ward', data)
	},
	update(data: IWard) {
		return instance.put('/api/Ward', data)
	},
	delete(data: IWard) {
		return instance.put('/api/Ward', data)
	}
}
