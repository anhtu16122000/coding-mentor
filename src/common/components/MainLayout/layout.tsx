import { Breadcrumb } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getMenuByRole } from '~/common/libs/routers'
import { findPathUrl } from '~/common/libs/routers/func'
import { MANAGEMENT_ROLES, NORMAL_ROLES } from '~/constants/common'
import { RootState } from '~/store'
import Header from '../Header'
import MyLink from '../MyLink'
import SideBarOne from './SideBarOne'
import SideBarTwo from './SideBarTwo'
import { AdminMenu, AdminChildMenu } from '~/common/libs/routers/admin'
import { StudentChildMenu, StudentMenu } from '~/common/libs/routers/student'
import { TeacherChildMenu, TeacherMenu } from '~/common/libs/routers/teacher'
import { ManagerChildMenu, ManagerMenu } from '~/common/libs/routers/manager'
import { SalerChildMenu, SalerMenu } from '~/common/libs/routers/saler'
import { AccountantChildMenu, AccountantMenu } from '~/common/libs/routers/accountant'
import { AcademicChildMenu, AcademicMenu } from '~/common/libs/routers/academic'
import { ParentStudentChildMenu, ParentStudentMenu } from '~/common/libs/routers/parent'
import SimpleMenu from './SimpleMenu'

function Layout({ children, home }: { children: React.ReactNode; home?: boolean }) {
	const [isOpen, setIsOpen] = useState(true)
	const user = useSelector((state: RootState) => state.user.information)
	const router = useRouter()
	const { pathname } = router
	const CURRENT_MENU = getMenuByRole(Number(user?.RoleId))
	const pathUrls = findPathUrl(pathname, CURRENT_MENU) || []

	const [openMenuMobile, setOpenMenuMobile] = useState(false)

	const funcMenuMobile = () => {
		!openMenuMobile ? setOpenMenuMobile(true) : setOpenMenuMobile(false)
	}

	const isOpenMenu = () => {
		if (isOpen) {
			setIsOpen(false)
		} else {
			setIsOpen(true)
		}
	}

	const closeMenuMobile = (e) => {
		e.preventDefault()
		funcMenuMobile()
	}

	return (
		<div className={`app`}>
			<Header isOpenMenu={isOpenMenu} isOpen={isOpen} funcMenuMobile={funcMenuMobile} openMenuMobile={openMenuMobile} />
			{MANAGEMENT_ROLES.includes(Number(user?.RoleId)) && (
				<SideBarOne
					pathUrlKeys={pathUrls.map(({ key }) => key)}
					menus={CURRENT_MENU}
					isOpen={isOpen}
					closeMenuMobile={closeMenuMobile}
					openMenuMobile={openMenuMobile}
				/>
			)}
			{NORMAL_ROLES.includes(Number(user?.RoleId)) && (
				<SideBarTwo
					pathUrlKeys={pathUrls.map(({ key }) => key)}
					menus={CURRENT_MENU}
					isOpen={isOpen}
					closeMenuMobile={closeMenuMobile}
					openMenuMobile={openMenuMobile}
				/>
			)}
			<main className="app-main">
				<div id="the-super-scroll" className={`app-content ${!isOpen && 'close-app'}`}>
					<div className="container w-full container-fluid">
						<div className="breadcrumb">
							<Breadcrumb>
								{pathUrls?.map(({ key, label, type }) => {
									return (
										<Breadcrumb.Item>
											<MyLink href={key} disable={type !== 'link'} DisplayComponent={label} />
										</Breadcrumb.Item>
									)
								})}
							</Breadcrumb>
						</div>
					</div>
					<div className="container-fluid">{children}</div>
				</div>
			</main>
		</div>
	)
}

export default Layout
