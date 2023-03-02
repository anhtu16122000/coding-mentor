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
import { log } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'
import { ManagerChildMenu, ManagerMenu } from '~/common/libs/routers/manager'
import { SalerChildMenu, SalerMenu } from '~/common/libs/routers/saler'
import { AccountantChildMenu, AccountantMenu } from '~/common/libs/routers/accountant'
import { AcademicChildMenu, AcademicMenu } from '~/common/libs/routers/academic'
import { ParentStudentChildMenu, ParentStudentMenu } from '~/common/libs/routers/parent'

const { SubMenu } = Menu

const defaultTab = 'home'

const PrimaryMenu: FC<IMainMenu> = ({ isOpen, openMenuMobile, funcMenuMobile, resetMenuMobile }) => {
	const router = useRouter()
	let pathname = router.pathname

	const menuChild = useRef(null)

	// if (pathname == '/') {
	// 	pathname = '/user/student'
	// }

	const [isHover, setIsHover] = useState({ changeHeight: null, status: false, position: null })
	const [posMenu, setPosMenu] = useState(null)
	const [openKeys, setOpenKeys] = useState([])
	const [statusOpen, setStatusOpen] = useState<boolean>(false)
	const [sameTab, setSameTab] = useState(false)

	const [parentMenu, setParentMenu] = useState([])
	const [childMenu, setChildMenu] = useState([])

	const [mainActivated, setMainActivated] = useState<string>(defaultTab)
	const [subMenuActive, setSubMenuActive] = useState('')

	useEffect(() => {
		if (parentMenu.length > 0) {
			getActiveTab()
		}
	}, [parentMenu])

	function getActiveTab() {
		// console.time('- getActiveTab')

		if (pathname == '/') {
			//
		}

		// console.timeEnd('- getActiveTab')
	}

	const changeTabs = (e) => {
		e.preventDefault()

		let element = e.target
		let position = element.getBoundingClientRect()
		setPosMenu(position)

		if (!isOpen) {
			let dataTab = e.target.getAttribute('data-tabs')
			dataTab == mainActivated ? setSameTab(true) : setMainActivated(dataTab)
			setStatusOpen(true)
			setIsHover({ ...isHover, status: true, changeHeight: false })
		}
	}

	const changeTabsClick = (e) => {
		e.preventDefault()
		let dataTab = e.target.getAttribute('data-tabs')
		setMainActivated(dataTab)
	}

	const closeTabs = (e) => {
		e.preventDefault()

		// Xóa tab trước khi tìm active tab
		setMainActivated('')

		// Func tìm active tap
		getActivated()

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

	const getActivated = () => {
		childMenu.forEach((menuItem, index) => {
			let isPrimary = pathname !== '/'
			menuItem.MenuItem.forEach((item, ind) => {
				if (isPrimary) {
					if (item.ItemType === 'sub-menu') {
						item.SubMenuList.forEach((itemSub, key) => {
							if (itemSub.Route == pathname) {
								setMainActivated(menuItem.Parent)
								return false
							}
						})
					} else {
						if (item.Route == pathname) {
							setMainActivated(menuItem.Parent)
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
						if (itemSub.Route === pathname) {
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
		window.innerWidth < 1000 ? resetMenuMobile() : FindSubMenuActive(), getActivated()
	}, [pathname])

	useEffect(() => {
		!isOpen && (setIsHover({ ...isHover, status: false }), getActivated())
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

	pathname = convertRouter(pathname)

	const closeMenuMobile = (e) => {
		e.preventDefault()
		funcMenuMobile()
	}

	useEffect(() => {
		changeTabsWithPostion()
	}, [mainActivated])

	useEffect(() => {
		if (sameTab) {
			changeTabsWithPostion()
			setTimeout(() => {
				setSameTab(false)
			}, 100)
		}
	}, [sameTab])

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
				case 4:
					setParentMenu(ManagerMenu)
					setChildMenu(ManagerChildMenu)
					break
				case 5:
					setParentMenu(SalerMenu)
					setChildMenu(SalerChildMenu)
					break
				case 6:
					setParentMenu(AccountantMenu)
					setChildMenu(AccountantChildMenu)
					break
				case 7:
					setParentMenu(AcademicMenu)
					setChildMenu(AcademicChildMenu)
					break
				case 8:
					setParentMenu(ParentStudentMenu)
					setChildMenu(ParentStudentChildMenu)
					break
				default:
					break
			}
		}
	}, [userInformation])

	useEffect(() => {
		if (childMenu.length > 0) {
			FindSubMenuActive()
			getActivated()
		}
	}, [childMenu])

	return (
		<aside className={`menu-bar none-selection ${openMenuMobile ? 'mobile' : ''}`}>
			<div onClick={closeMenuMobile} className={`right-menu ${openMenuMobile ? 'right-menu-active' : ''}`} />

			<div className="menu-parent">
				<div className="menu-parent-logo" />

				<div className="menu-parent-body">
					<ul className="list-menu">
						{parentMenu.map((item, index) => {
							const isActive = mainActivated == item.Key

							return (
								<li key={`menu-${index}`} className={`mt-[8px] relative ${isActive ? 'active' : ''} ${isOpen ? 'open-menu' : ''}`}>
									<b className={`${isActive ? '' : 'd-none'} ${isHover.status && 'bg-white'}`} />
									<b className={`${isActive ? '' : 'd-none'} ${isHover.status && 'bg-white'}`} />

									{!isActive && <div className="main-menu-mark" />}

									<a
										onClick={changeTabsClick}
										onMouseEnter={changeTabs}
										data-tabs={item?.Key}
										className={`${mainActivated == item.Key && isHover.status && 'bg-white'}`}
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
								selectedKeys={[pathname == '/' ? '/dashboard' : pathname]}
								openKeys={[subMenuActive]}
								mode="inline"
								theme="light"
								style={{ display: mainActivated == menu.Parent ? 'block' : 'none' }}
							>
								<Menu.ItemGroup key={menu.MenuKey} title={menu.MenuTitle !== 'xx69x' ? menu.MenuTitle : ''}>
									{menu.MenuItem?.map((item) =>
										item.ItemType !== 'sub-menu' ? (
											<Menu.Item key={item.Key} icon={null}>
												<Link href={item.Route}>
													<a>
														<div style={{ width: '100%', height: '100%', display: 'flex', paddingLeft: 10, alignItems: 'center' }}>
															{item?.Icon}
															<div className="" style={{ fontWeight: 500 }}>
																{item.Text}
															</div>
														</div>
													</a>
												</Link>
											</Menu.Item>
										) : (
											<SubMenu
												className={`${openKeys && item.Key == openKeys[openKeys?.length - 1] ? 'is-open' : ''}`}
												key={item.Key}
												icon={typeof item.Icon == 'string' ? ReactHtmlParser(item.Icon) : item.Icon}
												title={item.TitleSub}
											>
												{item?.SubMenuList.map((subitem) => {
													const isActive = subitem?.Route == pathname
													return (
														<Menu.Item
															className={`${isActive ? '!text-[#1b73e8] bg-[#ecf2fd]' : ''}`}
															key={`sub-menu-${subitem?.Key}`}
															icon={typeof subitem.Icon == 'string' ? ReactHtmlParser(subitem.Icon) : subitem.Icon}
														>
															<Link contextMenu="fica" href={subitem.Route}>
																<a>
																	<div style={{ paddingLeft: 16, fontWeight: 500 }}>{subitem.Text}</div>
																</a>
															</Link>
														</Menu.Item>
													)
												})}
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
