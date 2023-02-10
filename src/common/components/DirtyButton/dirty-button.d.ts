type TDirtyButton = {
	children?: React.ReactNode
	className?: string
	background?: string
	shadow?: 'none' | 'sm' | 'md'
	color?: string
	iconSize?: number
	icon?: 'none' | 'inline' | 'outline'
	radius?: number
	disabled?: boolean
	loading?: boolean
	onClick?: Function
}
