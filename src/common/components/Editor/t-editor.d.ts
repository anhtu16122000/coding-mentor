type TPrimaryEditor = {
	id?: string
	initialValue?: string
	height?: number | string
	inline?: boolean
	skin?: string
	apiKey?: string
	init?: any
	menubar?: boolean
	ref?: any

	onInit?: Function
	onChange?: Function
	onBlur?: Function
}
