import { Card } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { classApi } from '~/api/class'
import { ShowNoti } from '~/common/utils'
import ModalCurriculumOfClassCRUD from './ModalCurriculumOfClass'

export interface IDocumentsPageInClassProps {}

export default function DocumentsPageInClass(props: IDocumentsPageInClassProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
	const [dataSource, setDataSource] = useState<{ option: { title: string; value: any }[]; list: ICurriculumDetail[] }>({
		option: [],
		list: []
	})

	const getCurriculum = async () => {
		setIsLoading(true)
		try {
			const response = await classApi.getCurriculumOfClass(router.query.slug)
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

	useEffect(() => {
		if (router.query) {
			getCurriculum()
		}
	}, [router])

	const handleAddCurriculumDetail = async (data) => {
		setIsLoadingSubmit(true)
		try {
			const response = await classApi.addCurriculumOfClass({ Name: data.Name, CurriculumId: Number(router.query.name) })
			if (response.status === 200) {
				return response
			}
			if (response.status === 204) {
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoadingSubmit(false)
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
	}

	return (
		<div className="curriculum-content-container">
			<Card
				title="Danh sách chủ đề"
				extra={
					<>
						<ModalCurriculumOfClassCRUD mode="add" onSubmit={handleAddCurriculumDetail} isLoading={isLoadingSubmit} />
					</>
				}
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
														{/* <CurriculumDetailList item={item} onRendering={getCurriculumNoLoading} /> */}
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
