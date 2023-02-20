import { Modal, Tabs, Tooltip } from 'antd'
import React, { useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import PrimaryButton from '../Primary/Button'
import ListShowAllProgram from './ListShowAllProgram'
import ListShowProgramSelected from './ListShowProgramSeleted'

const ModalAddProgram = (props) => {
	const { programs, programsSelected, setProgramsSelected, setPrograms } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	let items = [
		{
			label: (
				<div>
					Tất cả - <span>{programs.length}</span>
				</div>
			),
			key: 'item-1',
			children: (
				<ListShowAllProgram
					programsSelected={programsSelected}
					setProgramsSelected={setProgramsSelected}
					programs={programs}
					setPrograms={setPrograms}
				/>
			)
		},
		{
			label: (
				<div>
					Đã chọn - <span>{programsSelected.length}</span>
				</div>
			),
			key: 'item-2',
			children: (
				<ListShowProgramSelected setProgramsSelected={setProgramsSelected} programsSelected={programsSelected} setPrograms={setPrograms} />
			)
		}
	]
	return (
		<>
			<Tooltip title="Thêm chương trình">
				<button type="button" onClick={() => setIsModalOpen(true)} className="text-tw-primary">
					<AiOutlinePlusCircle size={18} />
				</button>
			</Tooltip>
			<Modal
				centered
				title="Thêm chương trình"
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

export default ModalAddProgram
