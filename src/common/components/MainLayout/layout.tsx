import { Breadcrumb } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AdminMenu, AdminChildMenu } from '~/common/libs/routers/admin'
import { StudentChildMenu, StudentMenu } from '~/common/libs/routers/student'
import { TeacherChildMenu, TeacherMenu } from '~/common/libs/routers/teacher'
import { RootState } from '~/store'
import { setBreadcrumb } from '~/store/globalState'
import Header from '../Header'
import PrimaryMenu from './Menu'

function Layout({ children, home }: { children: React.ReactNode; home?: boolean }) {
	const [mainMenu, setMainMenu] = useState([])
	const [childrenMenu, setChildrenMenu] = useState([])
	const dispatch = useDispatch()

	const userInformation = useSelector((state: RootState) => state.user.information)
	const breadcrumb = useSelector((state: RootState) => state.globalState.breadcrumb)

	const router = useRouter()
	let path = router.pathname
	let pathString: string[] = path.split('/')

	pathString = pathString.filter((item) => {
		if (item == '' || item == '[slug]') {
			return false
		}
		return true
	})
	useEffect(() => {
		const getSlug = window.location.search.search('slug')
		if (getSlug === -1) {
			dispatch(setBreadcrumb({ group: null, name: null }))
		}
	}, [mainMenu, path])

	const [isOpen, setIsOpen] = useState(true)

	const [openMenuMobile, setOpenMenuMobile] = useState(false)

	const funcMenuMobile = () => {
		!openMenuMobile ? setOpenMenuMobile(true) : setOpenMenuMobile(false)
	}

	const resetMenuMobile = () => {
		setOpenMenuMobile(false)
	}

	const isOpenMenu = () => {
		if (isOpen) {
			setIsOpen(false)
		} else {
			setIsOpen(true)
		}
	}

	useEffect(() => {
		if (!!userInformation?.RoleId) {
			switch (parseInt(userInformation?.RoleId + '')) {
				case 1:
					setMainMenu(AdminMenu)
					setChildrenMenu(AdminChildMenu)
					break
				case 2:
					setMainMenu(TeacherMenu)
					setChildrenMenu(TeacherChildMenu)
					break
				case 3:
					setMainMenu(StudentMenu)
					setChildrenMenu(StudentChildMenu)
					break
				default:
					break
			}
		}
	}, [userInformation])

	const [breadcrumbs, setBreadcrumbs] = useState([])

	useEffect(() => {
		if (!!mainMenu && !!path) {
			const routers = router.pathname.replace('/', '').split('/')
			let temp = []
			for (let i = 0; i < routers.length; i++) {
				const element = routers[i]
				for (let j = 0; j < childrenMenu.length; j++) {
					if (element == childrenMenu[j]?.MenuKey?.replace('/', '')) {
						temp.push(childrenMenu[j].MenuTitle)
						for (let indexSub = 0; indexSub < childrenMenu[j]?.MenuItem.length; indexSub++) {
							if (childrenMenu[j]?.MenuItem[indexSub].SubMenuList) {
								for (let k = 0; k < childrenMenu[j]?.MenuItem[indexSub].SubMenuList.length; k++) {
									const current: any = childrenMenu[j]?.MenuItem[indexSub]?.SubMenuList[k]
									if (path.indexOf(current?.Route) === 0) {
										temp.push(current?.Text)
									}
								}
							} else {
								if (path.indexOf(childrenMenu[j]?.MenuItem[indexSub]?.Route) === 0) {
									temp.push(childrenMenu[j]?.MenuItem[indexSub]?.Text)
								}
								// if (childrenMenu[j]?.MenuItem[indexSub].Key === path) {
								// 	temp.push(childrenMenu[j]?.MenuItem[indexSub]?.Text)
								// }
							}
						}
					}
				}
			}
			setBreadcrumbs(temp)
		}
	}, [mainMenu, path])

	return (
		<div className="app">
			<Header isOpenMenu={isOpenMenu} isOpen={isOpen} funcMenuMobile={funcMenuMobile} openMenuMobile={openMenuMobile} />

			<PrimaryMenu
				resetMenuMobile={resetMenuMobile}
				isOpenMenu={isOpenMenu}
				isOpen={isOpen}
				openMenuMobile={openMenuMobile}
				funcMenuMobile={funcMenuMobile}
			/>

			<main className="app-main">
				<div className={`app-content ${!isOpen && 'close-app'}`}>
					<div className="container-fluid w-full container">
						<div className="breadcrumb ml-3">
							{breadcrumbs.length > 0 && (
								<Breadcrumb>
									{breadcrumbs?.map(
										(item, index) =>
											item !== 'xx69x' && (
												<Breadcrumb.Item key={index}>
													<a className="font-medium">{item}</a>
												</Breadcrumb.Item>
											)
									)}

									{!!router.query?.group ? (
										<Breadcrumb.Item key="name-router">
											<a className="font-medium">{router.query?.group}</a>
										</Breadcrumb.Item>
									) : !!breadcrumb.group ? (
										<Breadcrumb.Item key="name-router">
											<a className="font-medium">{breadcrumb.group}</a>
										</Breadcrumb.Item>
									) : (
										<></>
									)}

									{!!router.query?.name ? (
										<Breadcrumb.Item key="name-router">
											<a className="font-medium">{router.query?.name}</a>
										</Breadcrumb.Item>
									) : !!breadcrumb.name ? (
										<Breadcrumb.Item key="name-router">
											<a className="font-medium">{breadcrumb.name}</a>
										</Breadcrumb.Item>
									) : (
										<></>
									)}
								</Breadcrumb>
							)}
						</div>
					</div>
					<div className="container-fluid">{children}</div>
				</div>
			</main>
		</div>
	)
}

export default Layout
