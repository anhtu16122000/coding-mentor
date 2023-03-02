import Router from 'next/router'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import { RootState } from '~/store'
import DonateVideo from './donate-video'
import DetailsModal from './details-modal'

type TAdminControl = {
	item?: any
	onRefresh?: Function
}

const AdminControl: FC<TAdminControl> = (props) => {
	const { item, onRefresh } = props

	const user = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function isTeacher() {
		return user?.RoleId == 2
	}

	function isManager() {
		return user?.RoleId == 4
	}

	function isAcademic() {
		return user?.RoleId == 7
	}

	function viewDetails() {
		Router.push({ pathname: '/course/videos/detail', query: { slug: item?.Id } })
	}

	if (!isManager() && !isAdmin() && !isAcademic() && !isTeacher()) {
		return <></>
	}

	return (
		<div className="flex flex-col items-center w-full">
			{(isManager() || isAdmin() || isAcademic() || isTeacher()) && (
				<>
					<PrimaryButton background="blue" type="button" disable={item.Disable} icon="eye" onClick={viewDetails}>
						Xem khóa học
					</PrimaryButton>
					<DetailsModal data={item} />
				</>
			)}

			{(isManager() || isAdmin() || isAcademic()) && <DonateVideo onRefresh={onRefresh} video={item} />}
		</div>
	)
}

export default AdminControl
