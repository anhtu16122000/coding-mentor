import React, { useEffect, useState } from 'react'
import { getMoreQuestionsBank, getQuestionsBank } from './util'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BackTop, List, Select, Skeleton } from 'antd'
import { QUESTION_TYPES } from '~/common/libs'
import QuestionBankRenderItem from './RenderItem'
import Router, { useRouter } from 'next/router'
import { BiSolidArrowToTop } from 'react-icons/bi'

const initParameters = {
	search: '',
	pageIndex: 1,
	pageSize: 10,
	SourceId: 1,
	types: '',
	levels: ''
}

const QuestionsBank = () => {
	const [filters, setFilters] = useState(initParameters)

	const [data, setData] = useState([])
	const [totalItem, setTotalItem] = useState(0)

	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(true)

	useEffect(() => {
		if (filters.pageIndex == 1) {
			if (filters.levels != '' && filters.types != '') {
				getExercises()
			}
		} else {
			getMoreData()
		}
	}, [filters])

	async function getExercises() {
		await getQuestionsBank(filters, (response, query) => {
			setData(response.data)
			setTotalItem(response.totalRow)
		}).finally(() => {
			setLoading(false)
			setLoadingMore(false)
		})
	}

	async function getMoreData() {
		await getMoreQuestionsBank(filters, (response) => {
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

	const router = useRouter()

	useEffect(() => {
		if (router.query) {
			const types = !router.query?.types ? null : router.query?.types + ''
			const levels: any = !router.query?.levels ? null : router.query?.levels

			console.log('00000 - levels: ', levels)
			console.log('00000 - types: ', types)

			setFilters({
				...filters,
				types: !types ? null : types,
				levels: !levels ? null : levels,
				pageIndex: 1
			})
		}
	}, [router])

	const [showBackTop, setShotBackTop] = useState<boolean>(false)

	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Ngân hàng câu hỏi</title>
			</Head>

			<div className="max-w-[2000px]">
				<div className="cc-exam-header">
					<div className="flex items-center">
						<Select
							placeholder="Loại"
							mode="multiple"
							className="primary-input w-[200px]"
							allowClear
							// @ts-ignore
							value={!Router?.query?.types ? [] : Router?.query?.types.split(',').map(Number)}
							onChange={(event) => {
								const types = !event.join(',') ? null : event.join(',')
								Router.push({ query: { ...router?.query, types: types } })
							}}
						>
							<Select.Option value={QUESTION_TYPES.MultipleChoice}>Trắc nghiệm</Select.Option>
							<Select.Option value={QUESTION_TYPES.FillInTheBlank}>Điền từ</Select.Option>
							<Select.Option value={QUESTION_TYPES.Write}>Viết</Select.Option>
							<Select.Option value={QUESTION_TYPES.TrueOrFalse}>True or False</Select.Option>
							<Select.Option value={QUESTION_TYPES.Speak}>Nói</Select.Option>
						</Select>

						<Select
							placeholder="Cấp độ"
							onChange={(event) => Router.push({ query: { ...router?.query, levels: event } })}
							className="primary-input w-[120px] ml-[8px]"
						>
							<Select.Option value={null}>Tất cả</Select.Option>
							<Select.Option value={1}>Dễ</Select.Option>
							<Select.Option value={2}>Trung bình</Select.Option>
							<Select.Option value={3}>Khó</Select.Option>
						</Select>
					</div>
				</div>

				{(!loading || data.length > 0) && (
					<div>
						<div
							id="class-view"
							onScroll={(e) => {
								if (filters.pageIndex > 1) setShotBackTop(true)
							}}
							className="cc-exam-list-container !h-[calc(100vh-168px)] !mr-[-14px]"
							style={{ paddingRight: 8 }}
						>
							<div id="top-of-scroll" />
							<InfiniteScroll
								dataLength={data.length}
								next={loadMoreData}
								hasMore={data.length < totalItem}
								loader={<Skeleton className="ml-[8px]" />}
								endMessage=""
								scrollableTarget="class-view"
							>
								<List
									dataSource={data}
									renderItem={(item, index) => {
										const is = {
											typing: item?.Type == QUESTION_TYPES.FillInTheBlank,
											drag: item?.Type == QUESTION_TYPES.DragDrop
										}

										let dragAns = []

										for (let i = 0; i < item?.IeltsQuestions.length; i++) {
											const element = item?.IeltsQuestions[i]
											for (let j = 0; j < element?.IeltsAnswers.length; j++) {
												const ans = element?.IeltsAnswers[j]
												dragAns.push({ ...ans, Question: { ...element } })
											}
										}

										return (
											<QuestionBankRenderItem key={`the-fucking-quest-${item?.Id}`} dragAns={dragAns} index={index} item={item} is={is} />
										)
									}}
								/>
							</InfiniteScroll>
						</div>
					</div>
				)}

				{(!!loading || data.length == 0) && (
					<>
						<Skeleton active />
					</>
				)}
			</div>

			<div
				onClick={() => {
					const classIndex = document.getElementById(`top-of-scroll`)
					if (!!classIndex) {
						classIndex.scrollIntoView({ behavior: 'smooth', block: 'center' })
					}
				}}
				className="fixed rounded-full cursor-pointer z-50 bottom-[16px] right-[16px] p-[8px] bg-[#e6e6e6] hover:bg-[#dbdbdb]"
			>
				<BiSolidArrowToTop size={22} color="#000" />
			</div>
		</>
	)
}

export default QuestionsBank
