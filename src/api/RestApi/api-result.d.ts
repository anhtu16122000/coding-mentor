type TRestApiUploadResult<T = any> = {
	data: string
	resultCode?: number
	resultMessage?: string
	success?: boolean
}

type TRestApiPani = {
	pageIndex?: number
	pageSize?: number
	totalItem?: number
	totalPage?: number
}

type TRestApiResult<T = any> = {
	data: T
	resultCode?: number
	resultMessage?: string
	success?: boolean
	totalRow?: number
}
