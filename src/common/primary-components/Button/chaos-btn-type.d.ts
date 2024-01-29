// Cấm chỉnh sửa dưới mọi hình thức

type TChaosButton = {
	className?: string
	children?: React.ReactNode
	actionType?: 'button' | 'submit' | 'reset'
	hover?: 'opacity' | 'scale-out' | 'scale-in'
	type?: 'save' | 'create' | 'edit' | 'export' | 'import' | 'delete'
	icon?: React.ReactNode
	hideIcon?: boolean
	loading?: boolean
	disabled?: boolean
	onClick?: (e?: any) => void
}

// Cấm chỉnh sửa dưới mọi hình thức
