import { Modal, Tabs, Tooltip } from 'antd'
import React, { FC, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import PrimaryButton from '../Primary/Button'
import ListShowAllProgram from './ListShowAllProgram'
import ListShowProgramSelected from './ListShowProgramSeleted'
import PrimaryTooltip from '../PrimaryTooltip'

type TModalAddProgram = {
	programs?: Array<any>
	programsSelected?: Array<any>
	setProgramsSelected?: Function
	setPrograms?: Function
	type: 'default' | '1-1'
}

const ModalAddProgram: FC<TModalAddProgram> = (props) => {
	const { programs, programsSelected, setProgramsSelected, setPrograms, type } = props
	const [isModalOpen, setIsModalOpen] = useState(false)

	function onSelect(params) {
		setProgramsSelected(params)
		if (type == '1-1') {
			setIsModalOpen(false)
		}
	}

	const AllThis = {
		label: (
			<div>
				Tất cả - <span>{programs.length}</span>
			</div>
		),
		key: 'item-1',
		children: (
			<ListShowAllProgram
				programsSelected={programsSelected}
				setProgramsSelected={onSelect}
				programs={programs}
				setPrograms={setPrograms}
				type={type}
			/>
		)
	}

	const SelectedThis = {
		label: (
			<div>
				Đã chọn - <span>{programsSelected.length}</span>
			</div>
		),
		key: 'item-2',
		children: <ListShowProgramSelected setProgramsSelected={onSelect} programsSelected={programsSelected} setPrograms={setPrograms} />
	}

	let items = type == '1-1' ? [AllThis] : [AllThis, SelectedThis]

	return (
		<>
			<PrimaryTooltip id="add-pro" place="top" content="Thêm chương trình">
				<button type="button" onClick={() => setIsModalOpen(true)} className="text-tw-primary">
					<AiOutlinePlusCircle size={18} />
				</button>
			</PrimaryTooltip>

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
