import { Divider, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import RestApi from '~/api/RestApi'
import GroupItem from './item'

const ListGroup = () => {
	const [loading, setLoading] = useState(true)
	const [filter, setFilter] = useState({ pageSize: 30, pageIndex: 1 })
	const [groups, setGroups] = useState([])
	const [totalRow, setTotalRow] = useState(0)

	const getAllGroup = async () => {
		setLoading(true)
		try {
			const res = await RestApi.get<any>('NewsFeedGroup', filter)
			if (res.status === 200) {
				setGroups((pre) => [...pre, ...res.data.data])
				setTotalRow(res.data.totalRow)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getAllGroup()
	}, [filter])

	const loadMoreData = () => {
		console.log('--- loadMoreData')

		if (loading) {
			return
		}
		setLoading(true)
		setFilter({ ...filter, pageIndex: filter.pageIndex + 1 })
	}

	return (
		<>
			<div className="cc-list-group">
				<p className="cc-list-group--title">Tất cả các nhóm bạn đã tham gia ({totalRow || 0})</p>
			</div>
			<div
				className="scrollable h-[calc(100vh-65px)] pr-[8px] w1000:pr-[20px] mr-[-10px] mb-[-30px] pt-[16px] w1000:mr-[-20px] w1000:pt-[36px] mt-[-34px]"
				id="news-scroll-group"
			>
				<div className="cc-list-group">
					<InfiniteScroll
						dataLength={300}
						next={loadMoreData}
						hasMore={totalRow > groups?.length}
						loader={
							<>
								<Row gutter={[8, 8]} className="mt-2">
									<GroupItem.LoadingSkeleton />
									<GroupItem.LoadingSkeleton />
									<GroupItem.LoadingSkeleton />
									<GroupItem.LoadingSkeleton />
									<GroupItem.LoadingSkeleton />
									<GroupItem.LoadingSkeleton />
								</Row>
								<div className="h-[50px] "></div>
							</>
						}
						endMessage={<div className="h-[50px] "></div>}
						// endMessage={<div className="h-[36px]"></div>}
						scrollableTarget="news-scroll-group"
						// scrollableTarget="scrollableDiv"
						className="w-full"
					>
						<Row gutter={[8, 8]}>
							{/* @ts-ignore */}
							{loading && [...Array(18).keys()].map((item) => <GroupItem.LoadingSkeleton key={item || Date.now()} />)}
							{!loading && groups.map((item, idx) => <GroupItem groupData={item} key={idx} />)}
						</Row>
					</InfiniteScroll>
				</div>
			</div>
		</>
	)
}

export default ListGroup
