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
	noFullscreen?: boolean

	onInit?: Function
	onChange?: Function
	onBlur?: Function
}
