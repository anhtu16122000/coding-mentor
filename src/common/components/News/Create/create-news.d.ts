type TCreateNews = {
	onRefresh?: Function
	isEdit?: boolean
	defaultData?: TNews
	onOpen?: Function
}

type TNewType = {
	onClick: Function
	title: string
	icon: React.ReactNode
	loading?: boolean
	activated?: boolean
}
