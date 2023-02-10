import { Modal, Tabs, Tooltip } from 'antd'
import React, { useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import PrimaryButton from '../Primary/Button'
import ListShowAllClass from './ListShowAllClass'
import ListShowClassSelected from './ListShowClassSeleted'

const ModalAddClass = (props) => {
	const { classes, classesSelected, setClassesSelected, setClasses, form } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	let items = [
		{
			label: (
				<div>
					Tất cả - <span>{classes.length}</span>
				</div>
			),
			key: 'item-1',
			children: (
				<ListShowAllClass
					setClassesSelected={setClassesSelected}
					classes={classes}
					setClasses={setClasses}
					form={form}
					classesSelected={classesSelected}
				/>
			)
		},
		{
			label: (
				<div>
					Đã chọn - <span>{classesSelected.length}</span>
				</div>
			),
			key: 'item-2',
			children: <ListShowClassSelected setClassesSelected={setClassesSelected} classesSelected={classesSelected} setClasses={setClasses} />
		}
	]
	return (
		<>
			<Tooltip title="Thêm lớp học">
				<button type="button" onClick={() => setIsModalOpen(true)} className="text-tw-primary">
					<AiOutlinePlusCircle size={18} />
				</button>
			</Tooltip>
			<Modal
				centered
				title="Thêm lớp học"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={
					<PrimaryButton background="primary" icon="cancel" type="button" onClick={() => setIsModalOpen(false)}>
						Đóng
					</PrimaryButton>
				}
			>
				<Tabs items={items} />
			</Modal>
		</>
	)
}

export default ModalAddClass
