import { Breadcrumb } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getMenuByRole } from '~/common/libs/routers'
import { findPathUrl } from '~/common/libs/routers/func'
import { RootState } from '~/store'
import Header from '../Header'
import MyLink from '../MyLink'
import SideBarOne from './SideBarOne'

function Layout({ children, home }: { children: React.ReactNode; home?: boolean }) {
	const [isOpen, setIsOpen] = useState(true)
	const user = useSelector((state: RootState) => state.user.information)
	const router = useRouter()
	const { pathname } = router

	const CURRENT_MENU = getMenuByRole(Number(user?.RoleId))
	console.log('CURRENT_MENU', CURRENT_MENU)
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
			<SideBarOne
				pathUrlKeys={pathUrls.map(({ key }) => key)}
				menus={CURRENT_MENU}
				isOpen={isOpen}
				closeMenuMobile={closeMenuMobile}
				openMenuMobile={openMenuMobile}
			/>
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
