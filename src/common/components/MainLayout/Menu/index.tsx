import { Menu } from 'antd'
import React, { useEffect, useState, useRef, FC } from 'react'
import { useRouter } from 'next/router'
import { AdminMenu, AdminChildMenu } from '~/common/libs/routers/admin'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { TeacherChildMenu, TeacherMenu } from '~/common/libs/routers/teacher'
import { StudentChildMenu, StudentMenu } from '~/common/libs/routers/student'
import ReactHtmlParser from 'react-html-parser'

const { SubMenu } = Menu

const defaultTab = 'tab-home'

const SHOW_SMALL_MENU = false

const PrimaryMenu: FC<IMainMenu> = ({ isOpen, openMenuMobile, funcMenuMobile, resetMenuMobile }) => {
	const router = useRouter()
	let getRouter = router.pathname

	const menuChild = useRef(null)

	if (getRouter == '/') {
		getRouter = '/user/student'
	}

	const { information: user } = useSelector((state: RootState) => state.user)
	const [isHover, setIsHover] = useState({ changeHeight: null, status: false, position: null })
	const [tab, tabSet] = useState<string>(defaultTab)
	const [subMenuActive, setSubMenuActive] = useState('')
	const [posMenu, setPosMenu] = useState(null)
	const [openKeys, setOpenKeys] = useState([])
	const [statusOpen, setStatusOpen] = useState<boolean>(false)
	const [sameTab, setSameTab] = useState(false)
	const [parentMenu, setParentMenu] = useState([])
	const [childMenu, setChildMenu] = useState([])

	const changeTabs = (e) => {
		e.preventDefault()

		let element = e.target
		let position = element.getBoundingClientRect()
		setPosMenu(position)

		if (!isOpen) {
			let dataTab = e.target.getAttribute('data-tabs')
			dataTab == tab ? setSameTab(true) : tabSet(dataTab)
			setStatusOpen(true)
			setIsHover({ ...isHover, status: true, changeHeight: false })
		}
	}

	const changeTabsClick = (e) => {
		e.preventDefault()
		let dataTab = e.target.getAttribute('data-tabs')
		tabSet(dataTab)
	}

	const closeTabs = (e) => {
		e.preventDefault()

		// Xóa tab trước khi tìm active tab
		tabSet('')

		// Func tìm active tap
		FindTabActive()

		// Reset is Hover
		if (isHover.status) {
			setStatusOpen(false)
			setIsHover({
				changeHeight: false,
				status: false,
				position: null
			})
		}
	}

	const FindTabActive = () => {
		childMenu.forEach((menu, index) => {
			menu.MenuItem.forEach((item, ind) => {
				if (getRouter === '/') {
					tabSet('tab-home')
				} else {
					if (item.ItemType === 'sub-menu') {
						item.SubMenuList.forEach((itemSub, key) => {
							if (itemSub.Route === getRouter) {
								tabSet(menu.MenuName)
								return false
							}
						})
					} else {
						if (item.Route === getRouter) {
							tabSet(menu.MenuName)
							return false
						}
					}
				}
			})
		})
	}

	const FindSubMenuActive = () => {
		childMenu.forEach((menu, index) => {
			menu.MenuItem.forEach((item, ind) => {
				if (item.ItemType === 'sub-menu') {
					item.SubMenuList.forEach((itemSub, key) => {
						if (itemSub.Route === getRouter) {
							setSubMenuActive(item.Key)
							return false
						}
					})
				}
			})
		})
	}

	const onOpenChange = (openKeys) => {
		setOpenKeys(openKeys)
		if (openKeys.length > 0) {
			for (const value of openKeys) {
				childMenu.forEach((menu, index) => {
					menu.MenuItem.forEach((item, ind) => {
						if (item.ItemType === 'sub-menu') {
							if (item.Key === value) {
								setSubMenuActive(value)
								return false
							}
						}
					})
				})
			}
		} else {
			setSubMenuActive('')
		}
	}

	useEffect(() => {
		setTimeout(() => {
			// Get height Screen window
			let heightScr = window.innerHeight
			heightScr = heightScr / 2

			// Get height menu when hover
			let heightMenu = menuChild.current?.clientHeight

			if (!isOpen) {
				if (openKeys.length > 0) {
					if (heightMenu > heightScr) {
						setIsHover({ ...isHover, changeHeight: true })
					}
				} else {
					setIsHover({ ...isHover, changeHeight: false })
				}
			}
		}, 200)

		let itemMenu = document.querySelector('.menu-child-body-element .ant-menu-submenu-inline.is-open')
		if (itemMenu) {
			itemMenu.closest('.ant-menu-inline').classList.add('scroll')
		}
	}, [openKeys])

	useEffect(() => {
		window.innerWidth < 1000 ? resetMenuMobile() : FindSubMenuActive(), FindTabActive()
	}, [getRouter])

	useEffect(() => {
		!isOpen && (setIsHover({ ...isHover, status: false }), FindTabActive())
	}, [isOpen])

	const changeTabsWithPostion = () => {
		// Get height menu when hover
		let heightMenu = menuChild.current?.clientHeight

		// Get height Screen window
		let heightScr = window.innerHeight

		if (posMenu !== null) {
			// Get position menu when hover
			const position = posMenu

			setIsHover({
				changeHeight: !isOpen && heightMenu > heightScr / 2 ? true : false,
				status: !statusOpen ? false : true,
				position: !statusOpen
					? null
					: heightMenu > heightScr / 2
					? position.top > heightScr / 3
						? position.top - heightScr / 3
						: position.top - 65
					: position.top - 52
			})
		}
	}

	// Functions fine active menu when at detail page
	const convertRouter = (router: string) => {
		let arrRouter = router.split('/')

		arrRouter = arrRouter.filter(function (item) {
			if (item == '' || item.includes('detail')) {
				return false
			}
			return true
		})

		let finalRouter = ''

		arrRouter.forEach((item) => {
			finalRouter = finalRouter + '/' + item
		})

		return finalRouter
	}

	getRouter = convertRouter(getRouter)

	const closeMenuMobile = (e) => {
		e.preventDefault()
		funcMenuMobile()
	}

	useEffect(() => {
		changeTabsWithPostion()
	}, [tab])

	useEffect(() => {
		if (sameTab) {
			changeTabsWithPostion()
			setTimeout(() => {
				setSameTab(false)
			}, 100)
		}
	}, [sameTab])

	function parseJwt(token) {
		var base64Url = token.split('.')[1]
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		var jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				})
				.join('')
		)
		return JSON.parse(jsonPayload)
	}

	const userInformation = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		if (!!userInformation?.RoleId) {
			switch (parseInt(userInformation?.RoleId + '')) {
				case 1:
					setParentMenu(AdminMenu)
					setChildMenu(AdminChildMenu)
					break
				case 2:
					setParentMenu(TeacherMenu)
					setChildMenu(TeacherChildMenu)
					break
				case 3:
					setParentMenu(StudentMenu)
					setChildMenu(StudentChildMenu)
					break
				default:
					break
			}
		}
	}, [userInformation])

	useEffect(() => {
		if (childMenu.length > 0) {
			FindSubMenuActive()
			FindTabActive()
		}
	}, [childMenu])

	return (
		<aside className={`menu-bar none-selection ${openMenuMobile ? 'mobile' : ''}`}>
			<div onClick={closeMenuMobile} className={`right-menu ${openMenuMobile ? 'active' : ''}`} />

			<div className="menu-parent">
				<div className="menu-parent-logo" />

				<div className="menu-parent-body">
					<ul className="list-menu">
						{parentMenu.map((item, index) => {
							const isActive = tab == item.Key

							return (
								<li key={`menu-${index}`} className={`mt-[8px] relative ${isActive ? 'active' : ''} ${isOpen ? 'open-menu' : ''}`}>
									<b className={`${isActive ? '' : 'd-none'} ${isHover.status && 'bg-white'}`} />
									<b className={`${isActive ? '' : 'd-none'} ${isHover.status && 'bg-white'}`} />

									{!isActive && <div className="main-menu-mark" />}

									<a
										onClick={changeTabsClick}
										onMouseEnter={changeTabs}
										data-tabs={item?.Key}
										className={`${tab == item.Key && isHover.status && 'bg-white'}`}
									>
										{item.Icon}
									</a>
								</li>
							)
						})}
					</ul>
				</div>
			</div>

			<div className={`menu-child-bg ${!isOpen && `${isHover.status ? 'open' : ''}`}`} onMouseEnter={closeTabs}></div>

			<div className={`menu-child  ${!isOpen && `close-app  ${isHover.status ? 'hover-open' : ''} `}`}>
				<div className="app-header-logo flex items-center justify-center">
					<a href="/">
						<img className={isOpen ? 'logo-img h-[40px]' : 'logo-img-none'} src="/images/logo-2.jpg" />
					</a>
				</div>

				<div
					className={`menu-child-body ${isHover.changeHeight ? 'change-height' : ''}`}
					ref={menuChild}
					style={{ top: isHover.status ? isHover.position : 'unset' }}
				>
					{childMenu?.map((menu, indexMenu) => (
						<div key={indexMenu} className="menu-child-body-element">
							<Menu
								key={indexMenu}
								onOpenChange={onOpenChange}
								selectedKeys={[getRouter == '/' ? '/dashboard' : getRouter]}
								openKeys={[subMenuActive]}
								mode="inline"
								theme="light"
								style={{ display: tab == menu.Parent ? 'block' : 'none' }}
							>
								<Menu.ItemGroup key={menu.MenuKey} title={menu.MenuTitle !== 'xx69x' ? menu.MenuTitle : ''}>
									{menu.MenuItem?.map((item, indexItem) =>
										item.ItemType !== 'sub-menu' ? (
											<Menu.Item key={item.Key} icon={null}>
												<Link href={item.Route}>
													<div style={{ width: '100%', height: '100%', display: 'flex', paddingLeft: 12, alignItems: 'center' }}>
														{item?.Icon}
														<div className="ml-2">{item.Text}</div>
													</div>
												</Link>
											</Menu.Item>
										) : (
											<SubMenu
												className={`${openKeys && item.Key == openKeys[openKeys?.length - 1] ? 'is-open' : ''}`}
												key={item.Key}
												icon={typeof item.Icon == 'string' ? ReactHtmlParser(item.Icon) : item.Icon}
												title={item.TitleSub}
											>
												{item?.SubMenuList.map((subitem) => (
													<Menu.Item
														key={`sub-menu-${subitem?.Key}`}
														icon={typeof subitem.Icon == 'string' ? ReactHtmlParser(subitem.Icon) : subitem.Icon}
													>
														<Link href={subitem.Route}>
															<div style={{ paddingLeft: 24 }}>{subitem.Text}</div>
														</Link>
													</Menu.Item>
												))}
											</SubMenu>
										)
									)}
								</Menu.ItemGroup>
							</Menu>
						</div>
					))}
				</div>
			</div>
		</aside>
	)
}

export default PrimaryMenu
