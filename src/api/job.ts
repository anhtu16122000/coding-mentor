import { instance } from '~/api/instance'

const url = '/api/Job'
export const jobApi = {
	getAll(jobParams: any) {
		return instance.get<IApiResultData<IJob[]>>(url, {
			params: jobParams
		})
	},
	add(data: IJob) {
		return instance.post(url, data)
	},

	update(data: IJob) {
		return instance.put(url, data, {})
	},

	delete(id) {
		return instance.delete(`${url}/${id}`)
	}
}
