import { instance } from '~/api/instance'

const url = '/api/Refunds'

class Refunds {
	add = (data) => instance.post(url, data)
}

export const refundsApi = new Refunds()
