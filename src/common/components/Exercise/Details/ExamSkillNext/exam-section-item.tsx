import React, { useRef } from 'react'
import { Popconfirm, Popover } from 'antd'
import { ShowNoti, log } from '~/common/utils'
import { FaHeadphonesAlt } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import { FiMoreVertical } from 'react-icons/fi'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import CreateExamSection from '../ExamSkillSection/exam-section-form'

function ExamSectionItem(props) {
	const { data, index, onRefresh, currentSection, setCurrentSection, createGroupComponent, onPlayAudio, hideController } = props

	const popref = useRef(null)

	async function handleDelete(event) {
		event?.stopPropagation()
		try {
			const response = await ieltsSectionApi.delete(data?.Id)
			if (response.status == 200) {
				onRefresh(data, index)
				closePopover()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	function closePopover() {
		if (popref?.current) {
			popref?.current?.close()
		}
	}

	const content = (
		<div className="cursor-pointer">
			<div onClick={closePopover}>{createGroupComponent}</div>

			<CreateExamSection onOpen={closePopover} onRefresh={onRefresh} isEdit defaultData={data} />

			<Popconfirm title="Xoá kỹ năng?" onConfirm={handleDelete} placement="left">
				<div className="cc-23-skill-menu-item">
					<IoCloseSharp size={20} className="text-[#F44336] ml-[-2px]" />
					<div className="ml-[8px] font-[500]">Xoá</div>
				</div>
			</Popconfirm>
		</div>
	)

	const activated = currentSection?.Id == data.Id

	const noneActiveClass = 'text-[#000] bg-[#e9e9e9] hover:bg-[#dad9d9]'
	const activeClass = 'text-[#fff] bg-[#1b73e8] hover:bg-[#1867cf]'

	const classApply = activated ? activeClass : noneActiveClass

	return (
		<>
			<div onClick={() => setCurrentSection(data)} className={`cc-23-skill flex-shrink-0 ${classApply}`}>
				<div>{data?.Name}</div>

				{data?.Audio && (
					<div
						onClick={(e) => {
							e.stopPropagation()
							onPlayAudio(data)
						}}
					>
						<PrimaryTooltip place="left" id={`au-sk-${index}`} content="Play audio">
							<div className={`cc-23-skill-info ml-[8px] ${activated ? 'bg-[#fff]' : 'bg-[#0A89FF]'}`}>
								<FaHeadphonesAlt size={12} className={activated ? 'text-[#000]' : 'text-[#fff]'} />
							</div>
						</PrimaryTooltip>
					</div>
				)}

				{!hideController && (
					<div onClick={(e) => e.stopPropagation()}>
						<PrimaryTooltip place="left" id={`tip-${index}`} content="Menu">
							<Popover
								ref={popref}
								placement="rightTop"
								title="Menu"
								content={content}
								trigger="click"
								overlayClassName="show-arrow exam-skill"
							>
								<div className={`cc-23-skill-info ml-[8px] ${activated ? 'bg-[#fff]' : 'bg-[#0A89FF]'}`}>
									<FiMoreVertical size={12} className={activated ? 'text-[#000]' : 'text-[#fff]'} />
								</div>
							</Popover>
						</PrimaryTooltip>
					</div>
				)}
			</div>
		</>
	)
}

export default ExamSectionItem
