import { Empty } from 'antd'
import React from 'react'
import RenderItemProgram from './RenderItemProgram'

const ListProgramReview = (props) => {
	const { programsSelected, setProgramsSelected, setPrograms, type } = props

	const handleRemoveProgram = (data) => {
		const newProgramsSelected = programsSelected.filter((item) => item.Id !== data.Id)
		setProgramsSelected(newProgramsSelected)
		setPrograms((prev) => [{ ...data }, ...prev])
	}

	return (
		<div className="p-[8px] border-[1px] border-[#d9d9d9] rounded-[6px] gap-[8px] flex flex-col">
			{!!programsSelected && programsSelected.length == 0 && (
				<div className="p-[16px]">
					<Empty />
				</div>
			)}

			{programsSelected.map((item: any, index) => {
				function onChangeItem(params) {
					programsSelected[index] = params
					setProgramsSelected([...programsSelected])
				}

				return <RenderItemProgram item={item} type={type} onDelete={handleRemoveProgram} onChangeItem={onChangeItem} />
			})}
		</div>
	)
}

export default ListProgramReview
