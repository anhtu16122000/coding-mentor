import { List, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getNews } from './utils'
import CreateNews from './Create'
import NewsItem from './item'
import NewsGroup from './Group'
import GroupHeader from './Group/header'
import { useNewsContext } from '~/common/providers/News'
import { log } from '~/common/utils'

const DEFAULT_FILTER = {
	newsFeedGroupId: null,
	accountLogin: null,
	role: null,
	pageIndex: 1,
	pageSize: 6,
	searchContent: '',
	orderBy: 0
}

function NewsLoading() {
	return (
		<div className="cc-news-item mx-[-16px]" id={`loading-32`}>
			<div className="flex">
				<Skeleton.Avatar active style={{ width: 40, height: 40 }} />
				<div className="flex-1 ml-[16px] max-w-[150px]">
					<Skeleton active paragraph={false} round className="w-[70%]" />
					<Skeleton active paragraph={false} round style={{ marginTop: 8 }} />
				</div>
			</div>

			<Skeleton active round paragraph={false} style={{ marginTop: 16 }} />
			<Skeleton active round paragraph={false} style={{ marginTop: 16, width: '30%' }} />
			<Skeleton active round paragraph={false} style={{ marginTop: 16, width: '70%' }} />

			<div className="cc-hr my-[8px] mx-[-6px] mt-[16px]" />

			<div className="flex">
				<div className="flex-1 all-center mt-[8px]">
					<Skeleton active round paragraph={false} style={{ width: 16, marginRight: 8 }} />
					<Skeleton active round paragraph={false} style={{ width: 70 }} />
				</div>
				<div className="flex-1 all-center mt-[8px]">
					<Skeleton active round paragraph={false} style={{ width: 16, marginRight: 8 }} />
					<Skeleton active round paragraph={false} style={{ width: 90 }} />
				</div>
			</div>
		</div>
	)
}

function NewsFeed() {
	const { loading, setLoading, currentGroup } = useNewsContext()

	const [filter, setFilter] = useState(DEFAULT_FILTER)
	const [data, setData] = useState<Array<TNews>>([])
	const [totalItem, setTotalItem] = useState(0)

	log.Red('NewsFeed data: ', data)

	useEffect(() => {
		if (!!currentGroup) {
			setFilter({ ...filter, newsFeedGroupId: currentGroup, pageIndex: 1 })
		} else {
			setFilter({ ...filter, newsFeedGroupId: null, pageIndex: 1 })
		}
	}, [currentGroup])

	useEffect(() => {
		if (!!filter) {
			getNews(filter, _setData, setTotalItem, data)
		}
	}, [filter])

	function _setData(params) {
		setData(params)
		setLoading(false)
	}

	const loadMoreData = () => {
		if (loading) {
			return
		}
		setLoading(true)
		setFilter({ ...filter, pageIndex: filter.pageIndex + 1 })
	}

	return (
		<>
			<div className="cc-news flex">
				<div className="min-w-[300px]" style={{ flex: 3 }}>
					{/* {!!currentGroup && (
						<div className="cc-news-container !mb-[16px]">
							<GroupHeader group={currentGroup} />
						</div>
					)} */}

					<div className="cc-news-container">
						<CreateNews onRefresh={() => setFilter({ ...filter, pageIndex: 1 })} />
					</div>

					{/* {!currentGroup && (
						<div className="cc-new-mobile-group">
							<div className="bg-[#fff] shadow-md w-full rounded-[6px]">
								<NewsGroup isMobile />
							</div>
						</div>
					)} */}

					{loading && data.length == 0 && (
						<div className="mx-[-10px] mt-[-16px]">
							<NewsLoading />
							<NewsLoading />
						</div>
					)}

					{(!loading || data.length > 0) && (
						<InfiniteScroll
							dataLength={data.length}
							next={loadMoreData}
							hasMore={data.length < totalItem}
							loader={
								<div className="w-full mt-[16px] mb-[32px]">
									<NewsLoading />
								</div>
							}
							endMessage={<div className="h-[36px]"></div>}
							scrollableTarget="news-scroll"
							className="mx-[-10px]"
						>
							<List
								dataSource={data}
								renderItem={(item, index) => (
									<NewsItem key={`new-item-${index}`} onRefresh={() => setFilter({ ...filter, pageIndex: 1 })} item={item} index={index} />
								)}
							/>
						</InfiniteScroll>
					)}
				</div>

				{/* <div className="min-w-[300px] ml-[16px] cc-new-desktop-group" style={{ flex: 1 }}>
					<div className="bg-[#fff] shadow-md w-full rounded-[6px]">{!currentGroup && <NewsGroup />}</div>
				</div> */}
			</div>
		</>
	)
}

export default NewsFeed
