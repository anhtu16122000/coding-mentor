type IIconButton = {
	disabled?: boolean
	background?: 'green' | 'yellow' | 'blue' | 'red' | 'black' | 'disabled' | 'primary' | 'transparent'
	color: 'green' | 'yellow' | 'blue' | 'red' | 'black' | 'disabled' | 'primary' | 'transparent' | 'white'
	icon?:
		| 'add'
		| 'up-arrow'
		| 'down-arrow'
		| 'remove'
		| 'cancel'
		| 'edit'
		| 'check'
		| 'print'
		| 'eye'
		| 'upload'
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
		| 'save'
		| 'tutoring'
		| 'reset'
		| 'study'
		| 'hide'
		| 'salary'
	type: 'button' | 'submit'
	onClick?: Function
	className?: string
	tooltip?: string
	size?: number
	placementTooltip?: any
	titleTooltip?: string
}
