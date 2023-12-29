import { Menu } from 'antd'
import { MenuItems } from '~/common/libs/routers/type'
import styles from './style.module.scss'

type NewType = {
	menus: MenuItems[]
	pathUrlKeys: string[]
	openMenuMobile: boolean
	closeMenuMobile: (e: any) => void
	isOpen: boolean
}

type TSideBarOneProps = NewType

const SideBarOne = (props: TSideBarOneProps) => {
	const { menus, pathUrlKeys, openMenuMobile, closeMenuMobile, isOpen } = props

	// const onClick: MenuProps['onClick'] = (e) => {
	// 	console.log('click ', e)
	// }
	return (
		<aside className={`${styles.root} menu-bar none-selection ${openMenuMobile ? 'mobile' : ''}`}>
			<div onClick={closeMenuMobile} className={`right-menu ${openMenuMobile ? 'right-menu-active' : ''}`} />

			<div className={`menu-child-bg `}></div>

			<div className={`menu-child  ${!isOpen && `close-app  `}`}>
				<div className="app-header-logo flex items-center justify-center">
					<a href="/">
						<img className={isOpen ? 'logo-img h-[40px]' : 'logo-img-none'} src="/images/logo-2.jpg" />
					</a>
				</div>

				<div className="mt-0 !overflow-scroll-y h-[100%] scrollable">
					<Menu
						inlineIndent={1}
						// onClick={onClick}
						style={{ width: 247 }}
						defaultSelectedKeys={[pathUrlKeys[pathUrlKeys.length - 1]]}
						defaultOpenKeys={pathUrlKeys}
						mode="inline"
						items={menus}
					/>
				</div>
			</div>
		</aside>
	)
}

export default SideBarOne
