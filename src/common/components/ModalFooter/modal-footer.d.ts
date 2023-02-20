interface IModalFooter {
	loading?: boolean
	hideCancel?: boolean
	hideOK?: boolean
	cancelText?: string
	okText?: string
	onCancel?: Function
	onOK?: Function
	layout?: 'vertical' | 'horizontal' | 'inline'
	position?: 'center' | 'left' | 'right' | 'end'
	children?: React.ReactNode
	buttonFull?: boolean
}
