import MyLink from '~/common/components/MyLink'
import { MenuItems } from './type'

export const renderItemMenu = ({ label = '', key = '', children = [], allow }): MenuItems & { childrenExtend: MenuItems[] } => {
	return {
		label: <MyLink href={key} nextLinkRest={{ prefetch: false }} DisplayComponent={label} />,
		key: key,
		allow,
		text: label,
		type: 'link',
		childrenExtend: children
	}
}

export const findPathUrl = (
	pathname: string,
	menus: MenuItems[] = [],
	prevResult = []
): { key: string; label: string; type?: string; children?: MenuItems[] }[] => {
	for (const menu of menus) {
		if (!menu) continue
		const { children, key, label, text, type, childrenExtend } = menu
		const currentLabel = typeof label === 'string' ? label : text
		console.log('key', key)
		console.log('pathname', pathname)
		if (pathname === key) {
			return [...prevResult, { key, type, label: currentLabel, children }]
		}
		if (children?.length > 0) {
			const result = findPathUrl(pathname, children as MenuItems[], [...prevResult, { key, type, label: currentLabel, children }])
			if (result) {
				return result
			}
		}
		if (childrenExtend?.length > 0) {
			const result = findPathUrl(pathname, childrenExtend as MenuItems[], [
				...prevResult,
				{ key, type, label: currentLabel, childrenExtend }
			])
			if (result) {
				return result
			}
		}
	}
}
