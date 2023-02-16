type IPrimaryButton = {
	background: 'green' | 'yellow' | 'blue' | 'red' | 'black' | 'disabled' | 'primary' | 'orange' | 'transparent'
	icon?:
		| 'add'
		| 'remove'
		| 'cancel'
		| 'save'
		| 'check'
		| 'eye'
		| 'hide'
		| 'file'
		| 'download'
		| 'edit'
		| 'print'
		| 'upload'
		| 'excel'
		| 'enter'
		| 'exchange'
		| 'reset'
		| 'power'
		| 'search'
		| 'send'
		| 'payment'
	type: 'button' | 'submit'
	onClick?: Function
	children?: React.ReactNode
	className?: string
	disable?: boolean
	loading?: booleans
}
