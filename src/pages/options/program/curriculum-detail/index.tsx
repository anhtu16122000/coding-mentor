import { Card, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { curriculumDetailApi } from '~/api/learn/curriculum-detail'
import CurriculumDetailList from '~/common/components/CurriculumDetail/CurriculumDetailList'
import ModalCurriculumDetailCRUD from '~/common/components/CurriculumDetail/ModalCurriculumDetailCRUD'
import MainLayout from '~/common/components/MainLayout'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const initialParams = { pageIndex: 1, pageSize: PAGE_SIZE, CurriculumId: null }

const CurriculumDetail = () => {
	const [dataSource, setDataSource] = useState({ option: [], list: [] })
	const [isLoading, setIsLoading] = useState(false)
	const [todoApi, setTodoApi] = useState(initialParams)
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

	const router = useRouter()

	useEffect(() => {
		if (router.query?.name) {
			setTodoApi({ ...todoApi, CurriculumId: Number(router.query?.curriculum) })
		}
	}, [router.query])

	const getCurriculum = async () => {
		setIsLoading(true)
		try {
			const response = await curriculumDetailApi.getAll(todoApi)
			if (response.status === 200) {
				let temp = []
				response.data.data.forEach((item) => temp.push({ title: item.Name, value: item.Id }))
				setDataSource({ list: response.data.data, option: temp })
			}
			if (response.status === 204) {
				setDataSource({
					option: [],
					list: []
				})
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getCurriculumNoLoading = async () => {
		try {
			const response = await curriculumDetailApi.getAll(todoApi)
			if (response.status === 200) {
				let temp = []
				response.data.data.forEach((item) => temp.push({ title: item.Name, value: item.Id }))
				setDataSource({ list: response.data.data, option: temp })
			}
			if (response.status === 204) {
				setDataSource({
					option: [],
					list: []
				})
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
		}
	}

	useEffect(() => {
		getCurriculum()
	}, [todoApi])

	const handleAddCurriculumDetail = async (data) => {
		setIsLoadingSubmit(true)
		try {
			const response = await curriculumDetailApi.add({ Name: data?.Name, CurriculumId: Number(router.query?.curriculum) })
			if (response.status == 200) {
				getCurriculumNoLoading()
				return response
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoadingSubmit(false)
		}
	}

	const handleUpdateIndexCurriculumDetail = async (data) => {
		try {
			const response = await curriculumDetailApi.updateIndexCurriculumDetail(data)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
		}
	}

	const handleDragEnd = (result) => {
		if (!result.destination) return
		const newItems = Array.from(dataSource.list)
		const [reorderedItem] = newItems.splice(result.source.index, 1)
		newItems.splice(result.destination.index, 0, reorderedItem)
		setDataSource({ ...dataSource, list: newItems })

		let temp = []
		newItems.forEach((item, index) => temp.push({ Name: item.Name, Index: index + 1, Id: item.Id }))
		handleUpdateIndexCurriculumDetail(temp)
	}

	if (isLoading) {
		return <Skeleton active />
	}

	return (
		<div className="curriculum-content-container">
			<Card
				title="Danh sách chủ đề"
				extra={<ModalCurriculumDetailCRUD mode="add" onSubmit={handleAddCurriculumDetail} isLoading={isLoadingSubmit} />}
			>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId={`CurriculumID-${router.query.name}`}>
						{(provided) => {
							return (
								<div className="" {...provided.droppableProps} ref={provided.innerRef}>
									{dataSource.list.map((item, index) => (
										<Draggable key={item.Id} draggableId={`ItemCurriculum${item.Id}`} index={index}>
											{(providedDrag, snip) => {
												return (
													<div className="" {...providedDrag.draggableProps} {...providedDrag.dragHandleProps} ref={providedDrag.innerRef}>
														<CurriculumDetailList item={item} onRendering={getCurriculumNoLoading} />
													</div>
												)
											}}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)
						}}
					</Droppable>
				</DragDropContext>
			</Card>
		</div>
	)
}

CurriculumDetail.Layout = MainLayout
export default CurriculumDetail
