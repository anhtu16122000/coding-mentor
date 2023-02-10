type IPaymentMethod = IBaseApi<{
	Name: string
	Code: string
	Thumbnail: string
	Description: string
	Active: boolean
	Id: number
}>
