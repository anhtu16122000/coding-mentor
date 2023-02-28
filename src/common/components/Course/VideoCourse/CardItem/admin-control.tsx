import Router from 'next/router'
import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import { RootState } from '~/store'
import DonateVideo from './donate-video'

type TAdminControl = {
	item?: any
	onRefresh?: Function
}

const AdminControl: FC<TAdminControl> = (props) => {
	const { item, onRefresh } = props

	const dispatch = useDispatch()

	const user = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function viewDetails() {
		Router.push({ pathname: '/course/videos/detail', query: { slug: item?.Id } })
	}

	if (!isAdmin()) return <></>

	return (
		<div className="flex flex-col items-center w-full">
			<PrimaryButton background="blue" type="button" disable={item.Disable} icon="eye" onClick={viewDetails}>
				Xem khóa học
			</PrimaryButton>

			<DonateVideo onRefresh={onRefresh} video={item} />
		</div>
	)
}

export default AdminControl
