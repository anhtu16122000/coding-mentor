type IIconButton = {
	disabled?: boolean
	background?: 'green' | 'yellow' | 'blue' | 'red' | 'black' | 'disabled' | 'primary' | 'transparent'
	color: 'green' | 'yellow' | 'blue' | 'red' | 'black' | 'disabled' | 'primary' | 'transparent' | 'white'
	icon?:
		| 'add'
		| 'remove'
		| 'cancel'
		| 'edit'
		| 'check'
		| 'eye'
		| 'more'
		| 'exchange'
		| 'document'
		| 'download'
		| 'filter'
		| 'menu'
		| 'x'
		| 'login'
		| 'send'
		| 'file'
		| 'edit3'
		| 'user-group'
		| 'book'
		| 'info'
	type: 'button' | 'submit'
	onClick?: Function
	className?: string
	tooltip?: string
	size?: number
	placementTooltip?: any
	titleTooltip?: string
}
