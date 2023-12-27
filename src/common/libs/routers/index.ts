import { MANAGEMENT_ROLES, NORMAL_ROLES } from '~/constants/common'
import { MANAGEMENT_MENU, NORMAL_MENU } from './menuV2'
import { MenuItems } from './type'

const filterMenuByRole = (roleId: number, menus: MenuItems[] = []): MenuItems[] => {
	const result = []
	for (const menu of menus) {
		const { allow = [], children } = menu
		if (!allow.includes(roleId)) {
			continue
		}

		const newMenu = {
			...menu
		}
		if (children?.length > 0) {
			newMenu.children = filterMenuByRole(roleId, children as MenuItems[])
		}
		result.push(newMenu)
	}
	return result
}

export const getMenuByRole = (roleId: number): MenuItems[] => {
	let menus: MenuItems[] = []
	if (MANAGEMENT_ROLES.includes(roleId)) {
		menus = MANAGEMENT_MENU
	}
	if (NORMAL_ROLES.includes(roleId)) {
		menus = NORMAL_MENU
	}
	return filterMenuByRole(roleId, menus)
}
