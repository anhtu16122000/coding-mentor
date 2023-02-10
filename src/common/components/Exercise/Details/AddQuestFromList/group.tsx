import React, { useState } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import ReactHtmlParser from 'react-html-parser'
import Questions from '../Questions'
import { Checkbox } from 'antd'

const Group = (props) => {
	const { group, groupIndex, onChange } = props

	const [visible, setVisible] = useState(false)

	return (
		<>
			<div className="none-selection bg-[#f5f5f5] hover:bg-[#e3e3e3] h-[44px] flex items-center border-b-[1.5px] border-[#dbdbdb] text-[grey]">
				<div
					onClick={() => setVisible(!visible)}
					className="bg-[#e8e8e8] hover:bg-[#c6c6c6] w-[44px] h-[43px] mr-[15px] flex items-center justify-center cursor-pointer"
				>
					<MdOutlineKeyboardArrowRight className={`duration-300 ${visible && 'rotate-90'}`} size={28} />
				</div>
				<span className="font-[600] text-[#000] flex-1">Nhóm: {groupIndex + 1}</span>
				<Checkbox
					className="mr-3 question-checkbox"
					onChange={(event) => {
						!!onChange && onChange(event.target.checked, group)
					}}
				/>
			</div>

			{visible && (
				<div className={`p-3 duration-500`}>
					{group?.LevelName && <div className="font-[600]">Cấp độ: {group?.LevelName}</div>}
					{group?.Content && <div className="mt-2">{ReactHtmlParser(group?.Content)}</div>}
					{group?.Paragraph && <div className="mt-2">{ReactHtmlParser(group?.Paragraph)}</div>}

					<div className="ml-[-30px] mt-3">
						<Questions data={group?.Exercises} type="edit" />
					</div>
				</div>
			)}
		</>
	)
}

export default Group
