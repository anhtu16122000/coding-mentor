import { Card, List, Skeleton } from 'antd'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import appConfigs from '~/appConfig'
import CCSearch from '../CCSearch'
import CreateExam from './exam-form'
import ExamItem from './item'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getExams, getMoreExams } from './util'
import LoadingExercise from '../Loading/Exercise'

const initParameters = { search: '', pageIndex: 1, pageSize: 8 }

function ExamList() {
	const [filters, setFilters] = useState(initParameters)

	const [data, setData] = useState([])
	const [totalItem, setTotalItem] = useState(0)

	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(true)

	useEffect(() => {
		if (filters.pageIndex == 1) {
			getExercises()
		} else {
			getMoreData()
		}
	}, [filters])

	async function getExercises() {
		await getExams(filters, (response) => {
			setData(response.data)
			setTotalItem(response.totalRow)
		}).finally(() => {
			setLoading(false)
			setLoadingMore(false)
		})
	}

	async function getMoreData() {
		await getMoreExams(filters, (response) => {
			setData([...data, ...response.data])
			setTotalItem(response.totalRow)
		}).finally(() => {
			setLoading(false)
			setLoadingMore(false)
		})
	}

	function loadMoreData() {
		if (!loading && !loadingMore && data.length !== 0) {
			setLoadingMore(true)
			setFilters({ ...filters, pageIndex: filters.pageIndex + 1 })
		}
	}

	function onRefresh() {
		setFilters({ ...filters, pageIndex: 1 })
	}
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Quản lý đề</title>
			</Head>

			<Card
				className="exercise-container"
				title={
					<div className="flex items-center w-full justify-between pr-[10px] w600:px-[16px]">
						<div className="flex-1 max-w-[350px] mr-[16px]">
							<CCSearch onSubmit={(value) => setFilters({ ...filters, search: value })} />
						</div>
						<CreateExam onRefresh={onRefresh} />
					</div>
				}
			>
				{loading && data.length == 0 && <LoadingExercise />}

				{(!loading || data.length > 0) && (
					<div>
						<div id="class-view" className="px-[0px] w600:px-[16px] mx-[-8px] py-3 h-[calc(100vh-220px)] scrollable">
							<InfiniteScroll
								dataLength={data.length}
								next={loadMoreData}
								hasMore={data.length < totalItem}
								loader={<Skeleton />}
								endMessage=""
								scrollableTarget="class-view"
							>
								<List
									grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
									dataSource={data}
									renderItem={(item, index) => <ExamItem key={`ex-it-${index}`} data={item} onRefresh={onRefresh} />}
								/>
							</InfiniteScroll>
						</div>
					</div>
				)}
			</Card>
		</>
	)
}

export default ExamList
