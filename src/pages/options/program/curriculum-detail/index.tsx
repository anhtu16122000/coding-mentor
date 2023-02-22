import { Card, Collapse, Form, Skeleton, Upload, UploadProps } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { curriculumDetailApi } from '~/api/curriculum-detail'
import CurriculumDetailList from '~/common/components/CurriculumDetail/CurriculumDetailList'
import Lessons from '~/common/components/CurriculumDetail/Lessons'
import ModalCurriculumDetailCRUD from '~/common/components/CurriculumDetail/ModalCurriculumDetailCRUD'
import Units from '~/common/components/CurriculumDetail/Units'
import SelectField from '~/common/components/FormControl/SelectField'
import MainLayout from '~/common/components/MainLayout'
import PrimaryButton from '~/common/components/Primary/Button'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const CurriculumDetail = () => {
	// OLD VIEW, USE LATER
	// const router = useRouter()

	// const [curriculumId, setCurriculumId] = useState(null)
	// const [activatedUnit, setActivatedUnit] = useState(null)

	// useEffect(() => {
	// 	if (router.query?.name) {
	// 		setCurriculumId(router.query?.name)
	// 	}
	// }, [router.query])

	// return (
	// 	<Card
	// 		className="curriculum-detail-docs relative"
	// 		title={
	// 			<div className="curriculum-detail-card-title">
	// 				<div className="curriculum-detail-card-title left">Chi tiết giáo trình</div>
	// 			</div>
	// 		}
	// 	>
	// 		<div className="curriculum-detail-docs-container">
	// 			<div className="curriculum-detail-docs-units">
	// 				<Units curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
	// 			</div>
	// 			<div className="curriculum-detail-docs-lesson">
	// 				<Lessons curriculumId={curriculumId} activatedUnit={activatedUnit} setActivatedUnit={setActivatedUnit} />
	// 			</div>
	// 		</div>
	// 	</Card>
	// )

	const initialParams = { pageIndex: 1, pageSize: PAGE_SIZE, CurriculumId: null }
	const [dataSource, setDataSource] = useState<{ option: { title: string; value: any }[]; list: ICurriculumDetail[] }>({
		option: [],
		list: []
	})
	const [dataSelected, setDataSelected] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [todoApi, setTodoApi] = useState(initialParams)
	const [curriculumId, setCurriculumId] = useState(null)
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (router.query?.name) {
			setCurriculumId(router.query?.name)
			setTodoApi({ ...todoApi, CurriculumId: Number(router.query.name) })
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
				setDataSelected(response.data.data[0])
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
				setDataSelected(response.data.data[0])
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
			const response = await curriculumDetailApi.add({ Name: data.Name, CurriculumId: Number(router.query.name) })
			if (response.status === 200) {
				getCurriculumNoLoading()
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

	const handleUpdateIndexCurriculumDetail = async (data) => {
		try {
			const response = await curriculumDetailApi.updateIndexCurriculumDetail(data)
			if (response.status === 200) {
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
				extra={
					<>
						<ModalCurriculumDetailCRUD mode="add" onSubmit={handleAddCurriculumDetail} isLoading={isLoadingSubmit} />
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
