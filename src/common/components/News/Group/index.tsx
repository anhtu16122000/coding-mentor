import { Empty, Skeleton } from 'antd'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import RestApi from '~/api/RestApi'
import { encode } from '~/common/utils/common'
import GroupForm from './form'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const GroupThumb = ({ uri }) => {
	const [thumb, setThumb] = useState('')
	return (
		<img
			onError={() => {
				setThumb('/images/default-thumb-group.jpg')
			}}
			src={thumb || uri || '/images/default-thumb-group.jpg'}
			className="w-[50px] h-[50px] object-cover shadow-md"
		/>
	)
}

function NewsGroup(props) {
	const { groups, totalRow, loading, onRefresh } = props

	// const [loading, setLoading] = useState(true)
	// const [groups, setGroups] = useState([])
	const [filter, setFilter] = useState({ pageSize: 8, pageIndex: 1 })
	// const [totalRow, setTotalRow] = useState(0)

	// useEffect(() => {
	// 	getData()
	// }, [])

	// async function getData() {
	// 	console.log('---- NewsFeedGroup ----')
	// 	console.log('-- filter: ', filter)

	// 	setLoading(true)
	// 	try {
	// 		const res = await RestApi.get<any>('NewsFeedGroup', filter)
	// 		if (res.status === 200) {
	// 			setGroups(res.data.data)
	// 			setTotalRow(res.data.totalRow)
	// 		}
	// 	} catch (error) {
	// 	} finally {
	// 		setLoading(false)
	// 	}
	// }

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation.RoleId == 1
	}

	function isTeacher() {
		return userInformation.RoleId == 2
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	function isStdent() {
		return userInformation.RoleId == 3
	}

	return (
		<div className="p-[16px] cc-news-group">
			<h4 className="font-semibold text-[16px]">Danh sách nhóm </h4>

			{(isAdmin() || isTeacher() || isManager() || isAcademic()) && (
				<>
					<GroupForm
						onRefresh={() => {
							onRefresh && onRefresh()
							setFilter((pre) => ({ ...pre }))
						}}
						isEdit={false}
						defaultData={null}
					/>
					<div className="cc-hr my-[16px]" />
				</>
			)}

			{!loading && !!groups && groups.length == 0 && <Empty description="Không có nhóm nào" className="py-[16px]" />}

			{!loading && !!groups && groups.length != 0 && (
				<>
					{groups.map((group, indexGroup) => {
						return (
							<div
								key={`the-group-${indexGroup}`}
								className={`cc-group-item`}
								onClick={() => Router.push({ pathname: '/news', query: { group: encode(group.Id) } })}
							>
								<GroupThumb uri={group?.BackGround} />
								<div className="cc-group-info">
									<h2>{group?.Name}</h2>
									<div className="text-[#959595]">{group?.Members == 0 ? 'Chưa có thành viên' : `${group?.Members} thành viên`}</div>
								</div>
							</div>
						)
					})}

					{totalRow > filter.pageSize && (
						<div className="cc-news-group-more" onClick={() => Router.push({ pathname: '/group' })}>
							Hiện tất cả
						</div>
					)}
				</>
			)}

			{loading && (
				<>
					{/* @ts-ignore */}
					{[...Array(totalRow === 0 ? 1 : totalRow).keys()].map((_, index) => (
						<div className={`cc-group-item`} key={index + Date.now().toLocaleString()}>
							<Skeleton.Image active={true} style={{ width: 50, height: 50 }} className="cc-news-group-skele-img" />
							<div className="flex flex-col justify-center cc-group-info">
								<Skeleton paragraph={false} className="w-[70%]" active />
								<Skeleton paragraph={false} className="w-[30%] mt-3" active />
							</div>
						</div>
					))}
				</>
			)}
		</div>
	)
}

export default NewsGroup
