import {
	ROLE_ACADEMIC,
	ROLE_ACCOUNTANT,
	ROLE_ADMIN,
	ROLE_MANAGER,
	ROLE_PARENT,
	ROLE_SALER,
	ROLE_STUDENT,
	ROLE_TEACHER
} from '~/constants/common'
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
	if ([ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC].includes(roleId)) {
		menus = MANAGEMENT_MENU
	}
	if ([ROLE_PARENT, ROLE_STUDENT].includes(roleId)) {
		menus = NORMAL_MENU
	}
	console.log('checkGrantMenu', filterMenuByRole(roleId, menus))
	return filterMenuByRole(roleId, menus)
}
