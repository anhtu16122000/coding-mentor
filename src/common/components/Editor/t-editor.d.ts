type TPrimaryEditor = {
	id?: string
	initialValue?: string
	height?: number
	inline?: boolean
	skin?: string
	apiKey?: string
	menubar?: boolean

	onInit?: Function
	onChange?: Function
	onBlur?: Function
}
