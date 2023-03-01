import { Card } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { classApi } from '~/api/class'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import CurriculumDetailListInClass from './CurriculumDetailListInClass'
import ModalCurriculumOfClassCRUD from './ModalCurriculumOfClass'

export interface IDocumentsPageInClassProps {}

export default function DocumentsPageInClass(props: IDocumentsPageInClassProps) {
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)

	const [curriculumIdInClass, setCurriculumIdInClass] = useState(null)
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
	const [dataSource, setDataSource] = useState<{ option: { title: string; value: any }[]; list: ICurriculumDetail[] }>({
		option: [],
		list: []
	})

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	function isAccountant() {
		return userInformation?.RoleId == 6
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	const getCurriculumDetail = async (curriculumID) => {
		setIsLoading(true)
		try {
			const response = await classApi.getCurriculumDetailOfClass({ CurriculumIdInClassId: curriculumID ? curriculumID : 0 })
			if (response.status === 200) {
				let temp = []
				response.data.data.forEach((item) => temp.push({ title: item.Name, value: item.Id }))
				setDataSource({ list: response.data.data, option: temp })
			} else {
				setDataSource({ option: [], list: [] })
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}
	const getCurriculum = async () => {
		setIsLoading(true)
		try {
			const response = await classApi.getCurriculumOfClass(router.query.class)
			if (response.status === 200) {
				getCurriculumDetail(response.data.data[0].Id)
				setCurriculumIdInClass(response.data.data[0].Id)
			} else {
				getCurriculumDetail(null)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getCurriculumNoLoading = async () => {
		try {
			const response = await classApi.getCurriculumOfClass(router.query.class)
			if (response.status === 200) {
				getCurriculumDetail(response.data.data[0].Id)
				setCurriculumIdInClass(response.data.data[0].Id)
			} else {
				getCurriculumDetail(null)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
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
			const response = await classApi.addCurriculumOfClass({ Name: data.Name, CurriculumIdInClass: curriculumIdInClass })
			if (response.status === 200) {
				getCurriculumDetail(curriculumIdInClass)
				ShowNoti('success', response.data.message)
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
			const response = await classApi.updateIndexCurriculumDetailOfClass(data)
			if (response.status === 200) {
				getCurriculumNoLoading()
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

	return (
		<div className="curriculum-content-container">
			<Card
				title="Danh sách chủ đề"
				extra={
					<>
						{(isAdmin() || isManager() || isTeacher() || isAcademic()) && (
							<ModalCurriculumOfClassCRUD mode="add" onSubmit={handleAddCurriculumDetail} isLoading={isLoadingSubmit} />
						)}
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
													<div {...providedDrag.draggableProps} {...providedDrag.dragHandleProps} ref={providedDrag.innerRef}>
														<CurriculumDetailListInClass item={item} onRendering={getCurriculumNoLoading} />
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
