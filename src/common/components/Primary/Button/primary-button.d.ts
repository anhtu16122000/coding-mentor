type IPrimaryButton = {
	background: 'green' | 'yellow' | 'blue' | 'red' | 'black' | 'disabled' | 'primary' | 'orange' | 'transparent' | 'purple'
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
		| 'calculate'
		| 'full-screen'
		| 'restore-screen'
		| 'input'
		| 'none'
	type: 'button' | 'submit'
	onClick?: Function
	children?: React.ReactNode
	className?: string
	iconClassName?: string
	disable?: boolean
	loading?: booleans
}
