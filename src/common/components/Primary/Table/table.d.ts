type IPrimaryTable = {
	columns: ColumnType<{
		title?: string
		dataIndex: string
		align?: 'center' | 'right' | 'left'
		render?: string | number | JSX.Element | Function
	}>
	children?: React.ReactNode
	TitleCard?: React.ReactNode
	Extra?: React.ReactNode
	className?: string
	loading?: boolean
	bordered?: boolean
	total?: number
	current?: number
	expand?: ExpandableConfig<any>
	data?: Array<any>
	onExpand?: Function
	onChangePage?: Function
	menuContext?: Array<any>
	pageSize?: number
}
