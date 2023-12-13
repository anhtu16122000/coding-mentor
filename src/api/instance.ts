import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import appConfigs from '~/appConfig'
import { ShowNostis } from '~/common/utils'
import { wait } from '~/common/utils/super-functions'
import { logOut } from '~/common/utils/token-handle'

console.log(`%cSWIMMING API:`, 'color: #00BCD4; font-weight: bold', appConfigs.hostURL)

function getUrl(config: any) {
	return !!config.baseURL ? config.url.replace(config.baseURL, '').split('?')[0] : config.url
}

export const authHeader_X = async () => {
	let data = await JSON.parse(localStorage.getItem('userData'))
	return !!data && !!data.token ? { token: data.token } : {}
}

function convertMsToS(ms) {
	var seconds = ms / 1000
	return seconds.toFixed(1)
}

export const instance = axios.create({
	baseURL: appConfigs.hostURL,
	headers: { Accept: 'application/json' }
})

instance.interceptors.request.use(
	async (config: AxiosRequestConfig & { startCall: number }) => {
		if (!getUrl(config).toString().includes('/auth/')) {
			const authHeader: any = await authHeader_X()
			config.headers = { ...config.headers, ...authHeader }
			config.startCall = new Date().getTime()
		}

		console.log(`%c ${config?.method.toUpperCase()} - ${getUrl(config)}:`, 'color: #0086b3; font-weight: bold', config)
		return config
	},
	(error: any) => {
		console.log(`%c ${error?.response?.status}  :`, 'color: red; font-weight: bold', error?.response?.data)
		return Promise.reject(error)
	}
)

let isTimeout = false

instance.interceptors.response.use(
	(response: any) => {
		const apiUrl = `${response?.status} - ${getUrl(response?.config)}`
		const elapsedTime = new Date().getTime() - response?.config?.startCall // Tính thời gian đã trôi qua
		const apiRating = elapsedTime < 1000 ? 'Rất nhanh' : elapsedTime > 2000 ? 'Rất chậm' : 'Hơi nhanh'
		const apiTime = `${elapsedTime}ms --> ${convertMsToS(elapsedTime)}s`

		console.log(` %c ${apiUrl}:`, 'color: #008000; font-weight: bold', { timeSpend: apiTime, rate: apiRating, ...response })
		return response
	},
	async function (error: any) {
		if (!!error?.response) {
			console.log('error?.response', error?.response)
			if (error?.response?.status == 401 && !isTimeout) {
				isTimeout = true
				logOut()
			}

			const apiUrl = `${error?.response?.status} - ${getUrl(error?.response?.config)}`
			const elapsedTime = new Date().getTime() - error?.response?.config?.startCall // Tính thời gian đã trôi qua
			const apiRating = elapsedTime < 1000 ? 'Rất nhanh' : elapsedTime > 2000 ? 'Rất chậm' : 'Hơi nhanh'
			const apiTime = `${elapsedTime}ms --> ${convertMsToS(elapsedTime)}s`

			console.log(` %c ${apiUrl}:`, 'color: red; font-weight: bold', { timeSpend: apiTime, rate: apiRating, ...error?.response })
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
