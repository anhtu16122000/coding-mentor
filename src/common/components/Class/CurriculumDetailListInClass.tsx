import { Checkbox, Collapse, Popconfirm, Switch, Upload } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { classApi } from '~/api/class'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { getFileIcons } from '~/common/utils/main-function'
import { RootState } from '~/store'
import IconButton from '../Primary/IconButton'
import ModalCurriculumOfClassCRUD from './ModalCurriculumOfClass'

export interface ICurriculumDetailListInClassProps {
	item: ICurriculumDetail
	onRendering: Function
}

export default function CurriculumDetailListInClass(props: ICurriculumDetailListInClassProps) {
	const { item, onRendering } = props
	const initialParams = { pageIndex: 1, pageSize: PAGE_SIZE, CurriculumDetailId: null }
	const [dataSource, setDataSource] = useState<ICurriculumDetail[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [todoApi, setTodoApi] = useState(initialParams)
	const [isUploadFile, setIsUploadFile] = useState(false)
	const [isChangePosition, setIsChangePosition] = useState(false)
	const [isLoadingChangePosition, setIsLoadingChangePosition] = useState(false)
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
	const userInformation = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		if (item) {
			setTodoApi({ ...todoApi, CurriculumDetailId: item.Id })
		}
	}, [item])

	async function getData() {
		setIsLoading(true)
		try {
			const response = await classApi.getFileCurriculumOfClass({ CurriculumDetailInClassId: todoApi.CurriculumDetailId })
			if (response.status === 200) {
				setDataSource(response.data.data)
			} else {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	async function getDataNoLoading() {
		try {
			const response = await classApi.getFileCurriculumOfClass({ CurriculumDetailInClassId: todoApi.CurriculumDetailId })
			if (response.status === 200) {
				setDataSource(response.data.data)
			} else {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
		}
	}

	async function uploadFile(params) {
		setIsUploadFile(true)
		try {
			const formData = new FormData()
			formData.append('file', params)
			const response = await classApi.addFileCurriculumDetailInClass(item.Id, formData)
			if (response.status == 200) {
				getDataNoLoading()
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsUploadFile(false)
		}
	}

	const handleDeleteCurriculumDetail = async (data) => {
		setIsLoading(true)
		try {
			const response = await classApi.deleteCurriculumDetailOfClass(item.Id)
			if (response.status === 200) {
				onRendering && onRendering()
				return response
			}
			if (response.status === 204) {
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleHideCurriculumDetailInClass = async (name, Id) => {
		if (name === 'Chude') {
			try {
				setIsLoading(true)
				const response = await classApi.hideCurriculumDetailInClass(Id)
				if (response.status === 200) {
					onRendering && onRendering()
					getData()
					ShowNoti('success', response.data.message)
					return response
				}
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoading(false)
			}
		} else {
			try {
				setIsLoading(true)
				const response = await classApi.hideFileCurriculumInClass(Id)
				if (response.status === 200) {
					onRendering && onRendering()
					ShowNoti('success', response.data.message)
					getData()
					return response
				}
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoading(false)
			}
		}
	}

	const onChangeCheckCompleteCurriculumInClass = async () => {
		try {
			const response = await classApi.checkCompleteCurriculumInClass(item.Id)
			if (response.status === 200) {
				onRendering && onRendering()
				ShowNoti('success', response.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
		}
	}

	const genExtra = (item) => {
		return (
			<div className="flex justify-end items-center">
				<div className="exchange-button">
					<IconButton
						type="button"
						icon="exchange"
						color="yellow"
						onClick={() => setIsChangePosition(!isChangePosition)}
						tooltip="Đổi vị trí file"
					/>
				</div>
				<div className="antd-custom-wrap">
					<IconButton
						type="button"
						icon="hide"
						color={item.IsHide ? 'disabled' : 'green'}
						onClick={() => {
							handleHideCurriculumDetailInClass('Chude', item?.Id)
						}}
						tooltip={`${item.IsHide ? 'Hiện' : 'Ẩn'} chủ đề`}
					/>
				</div>
				<Upload name="file" multiple={true} customRequest={(event) => uploadFile(event.file)} showUploadList={false}>
					<IconButton type="button" icon="upload" color="blue" tooltip="Thêm file" />
				</Upload>
				<ModalCurriculumOfClassCRUD mode="delete" onSubmit={handleDeleteCurriculumDetail} isLoading={isLoading} />
				<Popconfirm
					title="Bạn có chắc muốn hoàn thành chủ đề này?"
					okText="Có"
					cancelText="Hủy"
					onConfirm={() => onChangeCheckCompleteCurriculumInClass()}
					disabled={item.IsComplete}
				>
					<IconButton
						type="button"
						icon="check"
						color={item.IsComplete ? 'green' : 'disabled'}
						className=""
						tooltip={`${item.IsComplete ? '' : 'Hoàn thành chủ đề này'}`}
					/>
				</Popconfirm>
			</div>
		)
	}

	const handleChangePosition = (index, mode: 'down' | 'up') => {
		let tempDataSource = [...dataSource]
		const [reorderedItem] = tempDataSource.splice(index, 1)
		mode == 'up' ? tempDataSource.splice(index - 1, 0, reorderedItem) : tempDataSource.splice(index + 1, 0, reorderedItem)
		let tempSubmit = []
		tempDataSource.forEach((item, index) => tempSubmit.push({ Index: index + 1, Id: item.Id }))
		handleUpdateIndexCurriculumDetailFile(tempSubmit)
	}

	function formatFileName(fileName) {
		const res = fileName.replace('.png', '').replace('.jpg', '').replace('.jpeg', '').replace('.pdf', '').replace('.png', '')
		const ress = res.replace('.webp', '').replace('.mp4', '').replace('.avi', '').replace('.pptx', '').replace('.ppt', '')
		const resss = ress.replace('.docs', '').replace('.doc', '').replace('.xls', '').replace('.xlsx', '').replace('.mp3', '')
		return resss.replace('.zip', '').replace('.rar', '').replace('.json', '').replace('.xml', '')
	}

	const handleUpdateIndexCurriculumDetailFile = async (data) => {
		setIsLoadingChangePosition(true)
		try {
			const response = await classApi.updateIndexFileCurriculumDetailOfClass(data)
			if (response.status === 200) {
				ShowNoti('success', response.data.message)
				getDataNoLoading()
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoadingChangePosition(false)
		}
	}

	const handleDragEnd = (result) => {
		if (!result.destination) return
		const newItems = Array.from(dataSource)
		const [reorderedItem] = newItems.splice(result.source.index, 1)
		newItems.splice(result.destination.index, 0, reorderedItem)
		setDataSource(newItems)

		let temp = []
		newItems.forEach((item, index) => temp.push({ Index: index + 1, Id: item.Id }))
		handleUpdateIndexCurriculumDetailFile(temp)
	}

	const handleChangeCollapse = (data) => {
		if (data[1]) {
			getData()
		}
	}

	const handleDeleteFile = async (data) => {
		setIsLoadingSubmit(true)
		try {
			const response = await classApi.deleteFileCurriculumDetailOfClass(data.Id)
			if (response.status === 200) {
				getDataNoLoading()
			}
			if (response.status === 204) {
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoadingSubmit(false)
		}
	}

	const onChangeCheckCompleteFile = async (data) => {
		try {
			const response = await classApi.checkCompleteFileInClass(data.Id, item.Id)
			if (response.status === 200) {
				getDataNoLoading()
				ShowNoti('success', response.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
		}
	}

	return (
		<div className="curriculum-collapse-wrap">
			<div className="wrap-not-mobile">
				<Collapse defaultActiveKey={['1']} onChange={handleChangeCollapse} collapsible="header">
					<Collapse.Panel
						header={<p className="title-item-collapse">{item.Name}</p>}
						key={`CurriculumDetail${item.Id}`}
						extra={
							userInformation &&
							(userInformation?.RoleId == '1' ||
								userInformation?.RoleId == '2' ||
								userInformation?.RoleId == '4' ||
								userInformation?.RoleId == '7') &&
							genExtra(item)
						}
					>
						<DragDropContext onDragEnd={handleDragEnd}>
							<Droppable droppableId={`CurriculumDetail${item.Id}`}>
								{(provided) => {
									return (
										<div className="curriculum-filename-contain" {...provided.droppableProps} ref={provided.innerRef}>
											{dataSource.map((item, index) => (
												<Draggable key={item.Id} draggableId={`ItemCurriculumDetail${item.Id}`} index={index}>
													{(providedDrag, snip) => {
														return (
															<div
																className="item"
																{...providedDrag.draggableProps}
																{...providedDrag.dragHandleProps}
																ref={providedDrag.innerRef}
															>
																<div className="left">
																	{getFileIcons(item.FileType, item.FileUrl)}
																	<div className="texts">
																		<p>{formatFileName(item.FileName)}</p>
																		<p className="time">{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>
																	</div>
																</div>
																<div className="right">
																	<p className="time">{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>
																	<div className="buttons flex items-center">
																		{userInformation?.RoleId == '1' ||
																		userInformation?.RoleId == '2' ||
																		userInformation?.RoleId == '4' ||
																		userInformation?.RoleId == '7' ? (
																			<div className="antd-custom-wrap ml-2">
																				<IconButton
																					type="button"
																					icon="hide"
																					color={item.IsHide ? 'disabled' : 'green'}
																					onClick={() => {
																						handleHideCurriculumDetailInClass('Tailieu', item?.Id)
																					}}
																					tooltip={`${item.IsHide ? 'Hiện' : 'Ẩn'} chủ đề`}
																				/>
																			</div>
																		) : (
																			''
																		)}

																		<IconButton
																			type="button"
																			icon="download"
																			color="blue"
																			onClick={() => {
																				window.open(item.FileUrl)
																			}}
																			className=""
																			tooltip="Tải tài liệu này"
																		/>
																		{userInformation &&
																			(userInformation?.RoleId == '1' ||
																				userInformation?.RoleId == '2' ||
																				userInformation?.RoleId == '4' ||
																				userInformation?.RoleId == '7') && (
																				<>
																					<Popconfirm
																						title="Bạn có chắc muốn xóa tài liệu này?"
																						okText="Có"
																						cancelText="Hủy"
																						onConfirm={() => handleDeleteFile(item)}
																					>
																						<IconButton
																							type="button"
																							icon="remove"
																							color="red"
																							onClick={() => {}}
																							className=""
																							tooltip="Xóa tài liệu này"
																						/>
																					</Popconfirm>
																					<Popconfirm
																						title="Bạn có chắc muốn hoàn thành tài liệu này?"
																						okText="Có"
																						cancelText="Hủy"
																						onConfirm={() => onChangeCheckCompleteFile(item)}
																						disabled={item.IsComplete}
																					>
																						<IconButton
																							type="button"
																							icon="check"
																							color={item.IsComplete ? 'green' : 'disabled'}
																							className=""
																							tooltip={`${item.IsComplete ? '' : 'Hoàn thành chủ đề này'}`}
																						/>
																					</Popconfirm>
																				</>
																			)}
																	</div>
																</div>
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
						<>{isUploadFile && <div className="line-loading-file"></div>}</>
					</Collapse.Panel>
				</Collapse>
			</div>

			<div className="wrap-for-mobile">
				<Collapse defaultActiveKey={['1']} onChange={handleChangeCollapse} collapsible="header">
					<Collapse.Panel
						header={
							<div className="flex items-center mt-[-5px] w-[calc(100vw-100px)] w768:w-[calc(100vw-360px)]">
								<div className="w-[calc(100%-80px)]">{item.Name}</div>

								{userInformation &&
									(userInformation?.RoleId == '1' ||
										userInformation?.RoleId == '2' ||
										userInformation?.RoleId == '4' ||
										userInformation?.RoleId == '7') &&
									genExtra(item)}
							</div>
						}
						key={`CurriculumDetail${item.Id}`}
					>
						<div className="curriculum-filename-contain">
							{dataSource.map((item, index) => {
								let lastItem = dataSource.slice(-1)[0]
								let firstItem = dataSource[0]
								return (
									<div className="item">
										<div className="left">
											{getFileIcons(item.FileType, item.FileUrl)}
											<div className="texts">
												<p>{formatFileName(item.FileName)}</p>
												<p className="time">{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>
											</div>
										</div>
										<div className="right">
											<p className="time">{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>
											<div className="buttons">
												{isChangePosition ? (
													<>
														{lastItem.Id != item.Id && (
															<IconButton
																type="button"
																icon="down-arrow"
																color={isLoadingChangePosition ? 'disabled' : 'red'}
																className=""
																disabled={isLoadingChangePosition}
																onClick={() => {
																	handleChangePosition(index, 'down')
																}}
															/>
														)}
														{firstItem.Id != item.Id && (
															<IconButton
																disabled={isLoadingChangePosition}
																type="button"
																color={isLoadingChangePosition ? 'disabled' : 'green'}
																icon="up-arrow"
																className=""
																onClick={() => {
																	handleChangePosition(index, 'up')
																}}
															/>
														)}
													</>
												) : (
													<>
														{userInformation?.RoleId == '1' ||
														userInformation?.RoleId == '2' ||
														userInformation?.RoleId == '4' ||
														userInformation?.RoleId == '7' ? (
															<div className="antd-custom-wrap ml-2">
																<IconButton
																	type="button"
																	icon="hide"
																	color={item.IsHide ? 'disabled' : 'green'}
																	onClick={() => {
																		handleHideCurriculumDetailInClass('Tailieu', item?.Id)
																	}}
																	tooltip={`${item.IsHide ? 'HIện' : 'Ẩn'} chủ đề`}
																/>
															</div>
														) : (
															''
														)}
														<IconButton
															type="button"
															icon="download"
															color="blue"
															onClick={() => {
																window.open(item.FileUrl)
															}}
															className=""
															tooltip="Tải tài liệu này"
														/>
														{userInformation &&
															(userInformation?.RoleId == '1' ||
																userInformation?.RoleId == '2' ||
																userInformation?.RoleId == '4' ||
																userInformation?.RoleId == '7') && (
																<>
																	<Popconfirm
																		title="Bạn có chắc muốn xóa file này?"
																		okText="Có"
																		cancelText="Hủy"
																		onConfirm={() => handleDeleteFile(item)}
																	>
																		<IconButton
																			type="button"
																			icon="remove"
																			color="red"
																			onClick={() => {}}
																			className=""
																			tooltip="Xóa tài liệu này"
																		/>
																	</Popconfirm>

																	<Popconfirm
																		title="Bạn có chắc muốn hoàn thành tài liệu này?"
																		okText="Có"
																		cancelText="Hủy"
																		onConfirm={() => onChangeCheckCompleteFile(item)}
																		disabled={item.IsComplete}
																	>
																		<IconButton
																			type="button"
																			icon="check"
																			color={item.IsComplete ? 'green' : 'disabled'}
																			className=""
																			tooltip={`${item.IsComplete ? '' : 'Hoàn thành chủ đề này'}`}
																		/>
																	</Popconfirm>
																</>
															)}
													</>
												)}
											</div>
										</div>
									</div>
								)
							})}
						</div>
						<>{isUploadFile && <div className="line-loading-file"></div>}</>
					</Collapse.Panel>
				</Collapse>
			</div>
		</div>
	)
}
