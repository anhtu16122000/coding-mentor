import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { gradesColTemplatesApi } from '~/api/configs/score-column-templates'
import { Button, Dropdown, Modal, Space } from 'antd'
import { CloseOutlined, DownOutlined, EditOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons'
import { ShowNostis, ShowNoti } from '~/common/utils'
import ModalEditCol from '../../Configs/GradesTemplates/ModalEditCol'
import PrimaryButton from '../../Primary/Button'
import { scoreColumnApi } from '~/api/configs/score-column'
import ModalAddNewCol from '../../Configs/GradesTemplates/ModalAddNewCol'
import { scoreApi } from '~/api/configs/score'

type SingleColType = {
	Id: number
}

const ModalDraggableTableColumn = (props) => {
	let { data = [], setData, transcriptId, classId, handleRefresh } = props

	const [isEditOrderCol, setIsEditOrderCol] = useState(false)

	data.sort((a, b) => a?.Index - b?.Index) // sort Index từ bé đến lớn

	const [items] = useState([
		{
			label: (
				<div className="flex justify-center gap-1 items-center">
					<CloseOutlined style={{ color: 'red' }} />
					<span>Xóa</span>
				</div>
			),
			key: 'delete'
		},
		{
			label: (
				<div className="flex justify-center gap-1 items-center">
					<EditOutlined style={{ color: 'orange' }} />
					<span>Cập nhật</span>
				</div>
			),
			key: 'update'
		}
	])

	const [dragOver, setDragOver] = useState('')
	const [isDragging, setIsDragging] = useState(false)
	const [isShowAddCol, setShowAddCol] = useState(false)
	const [sideInsert, setSideInsert] = useState('right')
	const [isShowUpdateCol, setIsShowUpdateCol] = useState(false)
	const [dataSingleCol, setDataSingleCol] = useState<SingleColType>({ Id: 0 })

	const calMediumScores = useCallback(async (classId, transcriptId) => {
		try {
			const res = await scoreApi.calcMediumScore({
				ClassId: Number(classId),
				TranscriptId: Number(transcriptId)
			})
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}, [])

	const draggedId = useRef(0)
	const prevData = useRef(data || [])
	const styleBorder = sideInsert === 'right' ? styles.borderRight : styles.borderLeft

	const handleMenuClick = ({ key }) => {
		if (key === 'delete') {
			const deleteCol = async () => {
				try {
					const res = await scoreColumnApi.delete(dataSingleCol?.Id)
					if (res?.status === 200) {
						ShowNoti('success', res?.data?.message)
						calMediumScores(classId, transcriptId).then(() => {
							handleRefresh()
						})
					}
				} catch (error) {
					ShowNoti('error', error?.message)
				}
			}
			deleteCol()
		}
		if (key === 'update') {
			setIsShowUpdateCol(true)
		}
	}
	const menuProps = {
		items,
		onClick: handleMenuClick
	}

	const handleDragStart = (e) => {
		const draggedIndex = e.target.getAttribute('data-index')
		draggedId.current = draggedIndex
		e.dataTransfer.setData('draggedIndex', draggedIndex)
	}
	const handleDragEnd = () => {
		setIsDragging(false)
		setDragOver('')
	}

	const handleDragOver = (e) => {
		e.preventDefault()
	}
	const handleDragEnter = (e) => {
		const { id } = e.target
		setIsDragging(true)
		const droppedIndex = e.target.getAttribute('data-index')
		setDragOver(id)
		setSideInsert(droppedIndex > draggedId.current ? 'right' : 'left')
	}

	const updateIndexCol = useCallback(async (dataCol) => {
		try {
			const res = await scoreColumnApi.put(dataCol)
			return res.data
		} catch (error) {
			ShowNoti('error', error?.message)
			return error
		}
	}, [])

	const handleOnDrop = (e) => {
		const droppedIndex = e.target.getAttribute('data-index')
		const draggedIndex = e.dataTransfer.getData('draggedIndex')

		const tempData = [...data]
		tempData.splice(draggedIndex, 1)
		tempData.splice(droppedIndex, 0, data[draggedIndex])
		const updatedIndexData = tempData.map((item, index) => {
			return {
				...item,
				Index: index + 1
			}
		})
		prevData.current = [...data]

		setData(updatedIndexData)
		const greaterIndex = Math.max(draggedIndex, droppedIndex)

		const updateIndexColsConcurrently = async () => {
			const promises = []
			for (let i = 0; i <= greaterIndex; i++) {
				promises.push(updateIndexCol(updatedIndexData[i]))
			}
			try {
				await Promise.all(promises)
			} catch (error) {
				setData(prevData.current)
			}
		}

		updateIndexColsConcurrently()
	}

	const createDragProperty = (col, index) => ({
		'data-index': index,
		'data-idCol': col?.Id,
		id: col?.Id,
		key: col?.Id,
		draggable: true,
		onDragEnd: handleDragEnd,
		onDragStart: handleDragStart,
		onDragOver: handleDragOver,
		onDrop: handleOnDrop,
		onDragEnter: handleDragEnter
	})

	return (
		<>
			<PrimaryButton background="orange" type="button" icon="edit" className="text-tw-white" onClick={() => setIsEditOrderCol(true)}>
				Chỉnh sửa
			</PrimaryButton>
			<Modal footer={null} title="Cấu hình bảng điểm chung" open={isEditOrderCol} onCancel={() => setIsEditOrderCol(false)} width={1300}>
				<div className="flex justify-end mb-4">
					<PrimaryButton className="" onClick={() => setShowAddCol(true)} background="green" icon="add" type="button">
						Thêm cột
					</PrimaryButton>
				</div>
				<ModalAddNewCol
					isShow={isShowAddCol}
					onCancel={() => {
						setShowAddCol(false)
					}}
					classId={classId}
					isClass
					handleRefresh={handleRefresh}
				/>
				<div className={styles.containerTable}>
					<table cellSpacing={0} className={` border ${styles.table}`}>
						<thead>
							<tr>
								<th className={`border-r border-b ${styles.stickyLeft}`}>Tên cột</th>
								{data.map((col, index) => {
									return (
										<th
											{...createDragProperty(col, index)}
											className={`border-r border-b min-w-100 ${styles.draggableCursor} ${
												col?.Id === Number(dragOver) ? styleBorder : ''
											}  `}
										>
											<div {...createDragProperty(col, index)} className="flex items-center justify-between">
												<span {...createDragProperty(col, index)} className={styles.draggableCursor}>
													{col?.Name}
												</span>
												{!(col?.Type == 2) && (
													<div onClick={() => setDataSingleCol(col)}>
														<Dropdown trigger={['click']} disabled={isDragging} className="cursor-pointer" menu={menuProps}>
															<MoreOutlined className={styles.moreOutlinedIcon} />
														</Dropdown>
													</div>
												)}
											</div>
										</th>
									)
								})}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className={`border-r border-b ${styles.stickyLeft}`}>Hệ số điểm</td>
								{data.map(({ Factor, Type, Id }) => (
									<td className={`border-r border-b text-right  ${Id === Number(dragOver) ? styleBorder : ''} `}>
										{Number(Type) === 1 && Factor}
									</td>
								))}
							</tr>
						</tbody>
					</table>
				</div>
				<ModalEditCol
					isShow={isShowUpdateCol}
					data={dataSingleCol}
					handleRefresh={() => {
						calMediumScores(classId, transcriptId)
						handleRefresh()
					}}
					onCancel={() => setIsShowUpdateCol(false)}
					isClass
				/>
			</Modal>
		</>
	)
}

export default ModalDraggableTableColumn
