import { Divider } from 'antd'
import moment from 'moment'
import React from 'react'
import { BiCheckboxSquare } from 'react-icons/bi'
import { FaMicrophone, FaPen } from 'react-icons/fa'
import { HiPencilAlt, HiSelector } from 'react-icons/hi'
import { MdOutlineRadioButtonChecked } from 'react-icons/md'
import { QUESTION_TYPES } from '~/common/libs'
import DragHeader from '../Details/Components/drag-header'
import GroupContent from '../Details/Components/group-content'
import TestingQuestions from '../Testing/Questions'
import { TbListDetails } from 'react-icons/tb'

const QuestionBankRenderItem = ({ item, index, is, dragAns }) => {
	return (
		<div className="ml-[8px] mb-[16px] pb-[8px] bg-[#fff] rounded-[8px] shadow-sm border-[rgba(0,0,0,0)] hover:border-[#1b73e8] border-[1px] border-solid">
			<div className="font-[600] text-[#1b73e8] mt-[16px] mx-[16px] text-[16px]">Tên nhóm: {item?.Name}</div>

			<div className="flex items-center p-[16px] pt-[8px] pb-0">
				<div className="bg-[#d94da6] px-[8px] py-[2px] rounded-full flex items-center">
					{item?.Type == QUESTION_TYPES.DragDrop && <HiSelector size={18} color="#fff" className="ml-[-4px] mr-[2px]" />}

					{item?.Type == QUESTION_TYPES.MultipleChoice && (
						<MdOutlineRadioButtonChecked size={16} color="#fff" className="ml-[-2px] mr-[2px]" />
					)}

					{item?.Type == QUESTION_TYPES.Write && <HiPencilAlt size={16} color="#fff" className="ml-[-2px] mr-[2px]" />}
					{item?.Type == QUESTION_TYPES.TrueOrFalse && <BiCheckboxSquare size={20} color="#fff" className="ml-[-2px] mr-[2px]" />}
					{item?.Type == QUESTION_TYPES.Speak && <FaMicrophone size={16} color="#fff" className="ml-[-2px] mr-[2px]" />}
					{item?.Type == QUESTION_TYPES.FillInTheBlank && <FaPen size={12} color="#fff" className="mr-[4px]" />}

					<div className="text-[#fff] font-[600]">{item?.TypeName == 'Kéo thả' ? 'Chọn đáp án' : item?.TypeName}</div>
				</div>

				<div className="bg-[#5cc07e] px-[8px] py-[2px] rounded-full ml-[8px]">
					<div className="text-[#fff] font-[600] flex items-center">
						<div>Số câu: {item?.QuestionsAmount}</div>
					</div>
				</div>

				{!!item?.LevelName && (
					<div className="bg-[#23c2dc] hidden w600:flex px-[8px] py-[2px] rounded-full ml-[8px]">
						<div className="text-[#fff] font-[600]">Cấp độ: {item?.LevelName}</div>
					</div>
				)}

				{!!item?.CreatedOn && (
					<div className="bg-[#3380d4] hidden w600:flex px-[8px] py-[2px] rounded-full ml-[8px]">
						<div className="text-[#fff] font-[600]">{moment(item?.CreatedOn).format('DD/MM/YYYY')}</div>
					</div>
				)}
			</div>

			<div className="flex w600:hidden items-center p-[16px] pt-[8px] pb-0">
				{!!item?.LevelName && (
					<div className="bg-[#23c2dc] px-[8px] py-[2px] rounded-full">
						<div className="text-[#fff] font-[600]">Cấp độ: {item?.LevelName}</div>
					</div>
				)}

				{!!item?.CreatedOn && (
					<div className="bg-[#3380d4] px-[8px] py-[2px] rounded-full ml-[8px]">
						<div className="text-[#fff] font-[600]">{moment(item?.CreatedOn).format('DD/MM/YYYY')}</div>
					</div>
				)}
			</div>

			<Divider className="ant-divider-16 mx-[16px] !w-auto !min-w-fit" />

			{is.drag && <DragHeader className="shadow-none py-0" answers={dragAns} />}

			<GroupContent className="shadow-none rounded-none" is={is} curGroup={item} />

			<div className="mx-[16px] mt-[-8px]">
				<TestingQuestions key={`ex-it-${index}`} data={item} />
			</div>
		</div>
	)
}

export default QuestionBankRenderItem
