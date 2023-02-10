type IAccount<T = any> = {
	message: string
	data: T
}

type IDataAccount = {
	Id: number
	FullName: string
	RoleName: string
}
