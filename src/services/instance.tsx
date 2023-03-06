import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import appConfigs from '~/appConfig'

const SHOW_LOG = false
const NODE_STATUS: any = process.env.NODE_ENV

function getUrl(config: any) {
	return !!config.baseURL ? config.url.replace(config.baseURL, '').split('?')[0] : config.url
}

export const instance = axios.create({
	baseURL: appConfigs.hostURL,
	headers: {
		Accept: 'application/json'
	}
})

instance.interceptors.request.use(
	async (config: AxiosRequestConfig) => {
		const url: any = getUrl(config)
		console.log(`%c ${config.method.toUpperCase()} - ${url}:`, 'color: #0086b3; font-weight: bold', config)
		return config
	},
	(error: any) => {
		console.log(`%c ${error.response.status}  :`, 'color: red; font-weight: bold', error.response.data)
		return Promise.reject(error)
	}
)

instance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response
	},
	function (error: any) {
		if (!!error?.response) {
			console.log(`%c ${error?.response?.status}  :`, 'color: red; font-weight: bold', error?.response?.data)
			return !!error?.response?.data ? Promise.reject(error.response.data) : Promise.reject(error)
		} else if (error.request) {
			console.log(`%c ${JSON.stringify(error)}  :`, 'color: red; font-weight: bold', error?.response?.data)
			return !!error?.response?.data ? Promise.reject(error.response.data) : Promise.reject(error)
		} else {
			console.log(`%c ${JSON.stringify(error)}  :`, 'color: red; font-weight: bold', 'Hình như là setting sai')
			return !!error?.response?.data ? Promise.reject(error.response.data) : Promise.reject(error)
		}
	}
)
