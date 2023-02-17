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
				setGroups(res.data.data)
				setTotalRow(res.data.totalRow)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getAllGroup()
	}, [])

	const loadMoreData = () => {
		console.log('--- loadMoreData')

		if (loading) {
			return
		}
		// setLoading(true)
		// setFilter({ ...filter, pageIndex: filter.pageIndex + 1 })
	}

	return (
		<div className="cc-list-group h-[calc(100vh-65px)] w-full scrollable " id="news-scroll-group">
			<p className="cc-list-group--title">Tất cả các nhóm bạn đã tham gia ({totalRow})</p>

			<InfiniteScroll
				dataLength={300}
				next={loadMoreData}
				hasMore={true}
				loader={
					<Row gutter={[8, 8]} className="mt-2">
						<GroupItem.LoadingSkeleton />
						<GroupItem.LoadingSkeleton />
						<GroupItem.LoadingSkeleton />
					</Row>
				}
				endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
				// endMessage={<div className="h-[36px]"></div>}
				scrollableTarget="news-scroll-group"
				// scrollableTarget="scrollableDiv"
				className="mx-[-10px] w-full"
			>
				<Row gutter={[8, 8]}>
					{loading && [...Array(18).keys()].map((item) => <GroupItem.LoadingSkeleton key={item || Date.now()} />)}
					{!loading && groups.map((item, idx) => <GroupItem groupData={item} key={idx} />)}
					{!loading && groups.map((item, idx) => <GroupItem groupData={item} key={idx + 100} />)}
				</Row>
			</InfiniteScroll>
		</div>
	)
}

export default ListGroup
