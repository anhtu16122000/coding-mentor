import { List, Segmented, Skeleton } from 'antd'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import appConfigs from '~/appConfig'
import CCSearch from '../CCSearch'
import CreateExam from './exam-form'
import ExamItem from './item'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getExams, getMoreExams } from './util'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import dynamic from 'next/dynamic'
import { FaQuestionCircle } from 'react-icons/fa'
import PrimaryTooltip from '../PrimaryTooltip'
import { isDesktop } from 'react-device-detect'
import FilterExam from './FilterExam'

const Tour = dynamic(() => import('reactour'), { ssr: false })

const initParameters = { search: '', pageIndex: 1, pageSize: 22 }

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

	// -----------------------------------------------------------------

	const [isTourOpen, setIsTourOpen] = useState(false)

	const accentColor = '#0a89ff'

	const disableBody = (target) => disableBodyScroll(target)
	const enableBody = (target) => enableBodyScroll(target)

	const closeTour: any = () => {
		setIsTourOpen(false)
	}

	const openTour = () => {
		setIsTourOpen(true)
	}

	// You might need to adjust this part depending on your use case.
	useEffect(() => {
		if (isTourOpen) {
			disableBody(document.querySelector('.helper'))
		} else {
			enableBody(document.querySelector('.helper'))
		}
	}, [isTourOpen])

	const tourConfig = [
		{
			selector: '[data-tut="reactour-create"]',
			content: `Tạo một đề mới thật dễ dàng bằng cách nhấn vào đây`
		},
		{
			selector: '[data-tut="reactour-search"]',
			content: `Tìm kiếm đề bằng cập nhập tên đề hoặc mã đề vào đây`
		},
		{
			selector: '[data-tut="reactour-switch"]',
			content: `Thay đổi phong cách hiển thị`
		},
		{
			selector: '[data-tut="reactour-information"]',
			content: `Bấm vào đây để xem và cập nhật thông tin đề`
		}
	]

	function handleReset() {
		setFilters(initParameters)
	}

	const [style, setStyle] = useState(1)

	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Quản lý đề</title>
			</Head>

			<Tour
				// @ts-ignore
				onRequestClose={closeTour}
				steps={tourConfig}
				isOpen={isTourOpen}
				maskClassName="react-tur-mask"
				className="helper"
				rounded={5}
				accentColor={accentColor}
				onAfterOpen={() => disableBody(document.querySelector('.helper'))}
				onBeforeClose={() => enableBody(document.querySelector('.helper'))}
			/>

			<div className="max-w-[2000px]">
				<div className="cc-exam-header">
					<div className="max-w-[350px] mr-[8px] flex items-center">
						<PrimaryTooltip id="exam-x" content="Hướng dẫn sử dụng" place="right">
							<div onClick={openTour} className="cc-exam-btn-tour">
								<FaQuestionCircle size={20} color="#1b73e8" />
							</div>
						</PrimaryTooltip>

						<div data-tut="reactour-switch">
							{/* @ts-ignore */}
							<Segmented
								style={{ height: 36 }}
								onChange={(e) => setStyle(e == 'Kanban' ? 1 : 2)}
								options={[
									{ value: 'Kanban', icon: <AppstoreOutlined /> },
									{ value: 'List', icon: <BarsOutlined /> }
								]}
							/>
						</div>

						{/* <FilterExam className="ml-[8px]" onReset={handleReset} onSubmit={(event) => setFilters(event)} /> */}
					</div>

					<div className="flex items-center">
						<div data-tut="reactour-search" className="mr-[8px]">
							<CCSearch data-tut="reactour-search" onSubmit={(value) => setFilters({ ...filters, pageIndex: 1, search: value })} />
						</div>
						<CreateExam onRefresh={onRefresh} />
					</div>
				</div>

				{(!loading || data.length > 0) && (
					<div>
						<div id="class-view" className="cc-exam-list-container" style={{ paddingRight: 8, marginRight: isDesktop ? -20 : -16 }}>
							<InfiniteScroll
								dataLength={data.length}
								next={loadMoreData}
								hasMore={data.length < totalItem}
								loader={<Skeleton />}
								endMessage=""
								scrollableTarget="class-view"
							>
								<List
									grid={style == 1 ? { gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 } : null}
									dataSource={data}
									renderItem={(item, index) => (
										<ExamItem style={style} key={`ex-it-${index}`} index={index} data={item} onRefresh={onRefresh} />
									)}
								/>
							</InfiniteScroll>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default ExamList
