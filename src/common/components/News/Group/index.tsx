import { Empty, Skeleton } from 'antd'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import dirtyApi from '~/api/dirtyApi'
import { useGlobalContext } from '~/common/Providers/MainProvider'
import { useNewsContext } from '~/common/Providers/News'
import { encode, getPer, ShowNoti } from '~/common/utils'
import GroupForm from './form'

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
	const { isMobile } = props

	const { currentRole, user } = useGlobalContext()

	const [loading, setLoading] = useState(true)
	const [showAll, setShowAll] = useState(false)
	const [groups, setGroups] = useState([])

	const [filter, setFilter] = useState({ pageSize: 4, pageIndex: 1 })

	useEffect(() => {
		if (!!currentRole) {
			getPermission()
		}
	}, [currentRole])

	useEffect(() => {
		getData()
	}, [filter])

	async function getData() {
		setLoading(true)
		try {
			const res = await dirtyApi.get<TMajors>('NewsFeedGroup', filter)
			if (res.status === 200) {
				setGroups(res.data.data.items)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	const [permission, setPermission] = useState([])

	async function getPermission() {
		setLoading(true)
		try {
			const response = await dirtyApi.getPermission<any>(currentRole, 'NewsFeedGroup')
			if (response.data.resultCode == 200) {
				const theData: any = response?.data?.data
				setPermission(theData)
			} else {
				setPermission([])
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	const { currentGroup } = useNewsContext()

	return (
		<div className="p-[16px] cc-news-group">
			<div className="cc-news-group-title">Danh sách nhóm</div>

			{getPer(permission, 'NewsFeedGroup-AddItem') ? (
				<>
					<GroupForm onRefresh={getData} isEdit={false} />
					<div className="cc-hr my-[16px]" />
				</>
			) : (
				<div className="h-[16px]" />
			)}

			{!loading && groups.length == 0 && <Empty description="Không có nhóm nào" className="py-[16px]" />}

			{!loading && groups.length != 0 && (
				<>
					{groups.map((group, indexGroup) => {
						return (
							<div
								onClick={() => Router.push({ pathname: '/news', query: { group: encode(group.id) } })}
								key={`the-group-${indexGroup}`}
								className={`cc-group-item ${group.id == currentGroup ? 'group-activated ' : ''}`}
							>
								<GroupThumb uri={group?.background} />
								<div className="cc-group-info">
									<h2>{group?.name}</h2>
									<div className="text-[#959595]">
										{group?.membersAmount == 0 ? 'Chưa có thành viên' : `${group?.membersAmount} thành viên`}
									</div>
								</div>
							</div>
						)
					})}

					<div
						onClick={() => {
							if (filter.pageSize == 4) {
								setFilter({ ...filter, pageSize: 99999 })
							} else {
								setFilter({ ...filter, pageSize: 4 })
							}
						}}
						className="cc-news-group-more"
					>
						<div>{filter.pageSize == 4 ? 'Hiện tất cả' : 'Ẩn bớt'}</div>
						<MdOutlineKeyboardArrowDown size={18} className={`${filter.pageSize == 4 ? '' : 'rotate-180'} duration-300`} />
					</div>
				</>
			)}

			{loading && (
				<div key={`the-gr-155`} className={`cc-group-item`}>
					<Skeleton.Image active={true} style={{ width: 50, height: 50 }} className="cc-news-group-skele-img" />
					<div className="cc-group-info flex flex-col justify-center">
						<Skeleton paragraph={false} className="w-[70%]" active />
						<Skeleton paragraph={false} className="w-[30%] mt-3" active />
					</div>
				</div>
			)}
		</div>
	)
}

export default NewsGroup
