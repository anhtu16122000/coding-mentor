import Router from 'next/router'
import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import { RootState } from '~/store'

type TAdminControl = {
	item?: any
}

const AdminControl: FC<TAdminControl> = (props) => {
	const { item } = props

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
		<>
			<PrimaryButton background="blue" type="button" disable={item.Disable} icon="eye" onClick={viewDetails}>
				Xem khóa học
			</PrimaryButton>
		</>
	)
}

export default AdminControl
