import { MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number] & { text?: string; allow: number[] }
export type MenuItems = {
	text?: string
	label: React.ReactNode
	allow: number[]
	key: React.Key
	icon?: React.ReactNode
	children?: MenuItem[]
	childrenExtend?: MenuItem[]
	type?: 'group' | 'link'
}
