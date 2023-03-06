import React, { useEffect, useState } from 'react'
import { Popover } from 'antd'
import Link from 'next/link'
import { LoginOutlined, FormOutlined } from '@ant-design/icons'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useRouter } from 'next/router'
import Notification from './notification'
import { parseSelectArray } from '~/common/utils/common'
import { areaApi } from '~/api/area'
import { ShowNoti } from '~/common/utils'
import { setArea } from '~/store/areaReducer'
import { permissionApi } from '~/api/permission'
import AvatarComponent from '../AvatarComponent'
import CartButton from '../Cart/button'
import { logOut } from '~/common/utils/token-handle'

let countOpen = 0

function Header({ isOpenMenu, isOpen, funcMenuMobile, openMenuMobile }: IHeader) {
	const router = useRouter()
	const { loading, data } = useSelector((state: RootState) => state.auth)
	const userInfo = useSelector((state: RootState) => state.user.information)
	const [roleStaff, setRoleStaff] = useState([])
	const dispatch = useDispatch()

	const moveToLogin = () => {
		logOut()
	}

	useEffect(() => {
		if (userInfo) {
			console.log('-- USER INFO', userInfo)
		}
	}, [userInfo])

	const user = useSelector((state: RootState) => state.user.information)
	const area = useSelector((state: RootState) => state.area)

	const getRoleStaff = async () => {
		try {
			const res = await permissionApi.getRoleStaff()
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				setRoleStaff(convertData)
			}
			if (res.status === 204) {
				setRoleStaff([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllArea = async () => {
		try {
			const response = await areaApi.getAll({ pageSize: 99999 })
			if (response.status === 200) {
				dispatch(setArea(response.data.data))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		getRoleStaff()
	}, [])

	useEffect(() => {
		if (area.Area.length == 0) {
			getAllArea()
		}
	}, [])

	const [userVisible, setUserVisible] = useState(false)

	const contentLogout = (
		<ul className="user-function">
			<li className="mb-1">
				{user?.RoleId == 3 && (
					<div
						className="inner-function"
						onClick={() => {
							router.push({ pathname: '/info-course/student/detail', query: { StudentID: userInfo.UserInformationId } })
						}}
					>
						<div className="icon">
							<img src="/icons/profile-circle.svg" />
						</div>
						<div className="function-name">Thông tin</div>
					</div>
				)}
				{user?.RoleId != 3 && (
					<div
						className="inner-function"
						onClick={() => {
							router.push({ pathname: '/users/info-detail', query: { UserID: userInfo.UserInformationId } })
						}}
					>
						<div className="icon">
							<img src="/icons/profile-circle.svg" />
						</div>
						<div className="function-name">Thông tin</div>
					</div>
				)}
			</li>
			<li className="mb-1">
				<Link href="/change-password">
					<div className="inner-function">
						<div className="icon">
							<img src="/icons/security-safe.svg" />
						</div>
						<div className="function-name">Đổi mật khẩu</div>
					</div>
				</Link>
			</li>
			<li>
				<div
					className="inner-function logout"
					onClick={() => {
						setUserVisible(false)
						moveToLogin()
					}}
				>
					<span className="icon">
						<img className="logout" src="/icons/logout.svg" />
					</span>
					<span className="function-name">Đăng xuất</span>
				</div>
			</li>
		</ul>
	)

	const contentLogin = (
		<ul className="user-function">
			<li>
				<a href="#" onClick={moveToLogin}>
					<span className="icon">
						<LoginOutlined />
					</span>
					<span className="function-name">Đăng nhập</span>
				</a>
			</li>
			<li>
				<a href="#">
					<span className="icon inbox">
						<FormOutlined />
					</span>
					<span className="function-name">Đăng ký</span>
				</a>
			</li>
		</ul>
	)

	let visibleUser: {
		visible: Boolean
	}

	visibleUser = {
		visible: false
	}

	if (!isOpen) {
		countOpen++
	}

	const userInformation = useSelector((state: RootState) => state.user.information)

	return (
		<header className={`app-header ${openMenuMobile ? 'mobile' : ''}`}>
			<div className={`app-header-logo ${!isOpen ? 'close-app' : countOpen > 0 ? 'open' : 'open-no-ani'}`}>
				<a href="/">
					<img className={isOpen ? 'logo-img' : 'logo-img-none'} src="/images/logo-2.jpg"></img>
				</a>
			</div>

			<div className={`app-header-inner ${!isOpen && 'close-app'}`}>
				<div className="right">
					<div className="box-menu desktop" onClick={() => isOpenMenu()}>
						<div className="icon-action">{!isOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
					</div>

					<div className="box-menu mobile" onClick={() => funcMenuMobile()}>
						<div className="icon-action">{!openMenuMobile ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
					</div>
				</div>

				<div className="header-menu">
					<div className="mr-[16px]">
						<CartButton />
					</div>

					<div className="mr-[16px]">
						<Notification />
					</div>

					<div className="h-10 my-auto border border-tw-gray"></div>

					<div className="ml-4 user">
						<Popover
							open={userVisible}
							onOpenChange={(event) => setUserVisible(event)}
							content={!data ? contentLogin : contentLogout}
							trigger="click"
							title=""
							overlayClassName="show-arrow"
						>
							<div className="user-wrap">
								{data ? (
									<div className="center-row">
										<div className="user-img">
											<AvatarComponent url={userInformation?.Avatar} type="user" />
										</div>

										<div className="user-info">
											<p className="user-name">{userInformation?.FullName}</p>
											<p className="user-position">{userInformation?.role}</p>
										</div>
									</div>
								) : (
									<p>Tài khoản</p>
								)}
							</div>
						</Popover>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
