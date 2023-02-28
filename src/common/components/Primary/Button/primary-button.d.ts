type IPrimaryButton = {
	background: 'green' | 'yellow' | 'blue' | 'red' | 'black' | 'disabled' | 'primary' | 'orange' | 'transparent'
	icon?:
		| 'add'
		| 'arrow-up'
		| 'arrow-down'
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
		| 'cart'
		| 'none'
	type: 'button' | 'submit'
	onClick?: Function
	children?: React.ReactNode
	className?: string
	disable?: boolean
	loading?: booleans
}
