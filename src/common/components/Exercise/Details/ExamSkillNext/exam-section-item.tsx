import React, { useRef, useState } from 'react'
import { Collapse, Divider, Modal, Popconfirm, Popover, Spin } from 'antd'
import { ShowNoti } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import { FaInfo, FaInfoCircle } from 'react-icons/fa'
import ExamSkillInfo from './exam-skill.info'
import { IoCloseSharp } from 'react-icons/io5'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import { MdHeadphones } from 'react-icons/md'
import CreateExamSkill from './exam-skill-form'
import { FiMoreVertical } from 'react-icons/fi'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import CreateExamSection from '../ExamSkillSection/exam-section-form'

const { Panel } = Collapse

function ExamSectionItem(props) {
	const { data, index, onRefresh, currentSection, setCurrentSection, createGroupComponent } = props

	const popref = useRef(null)

	const [deleting, setDeleting] = useState(false)

	async function handleDeleteSkill(event) {
		event?.stopPropagation()
		setDeleting(true)
		try {
			const response = await ieltsSectionApi.delete(data?.Id)
			if (response.status == 200) {
				onRefresh()
				closePopover()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setDeleting(false)
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

			<Popconfirm title="Xoá kỹ năng?" onConfirm={handleDeleteSkill} placement="left">
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
			<div onClick={() => setCurrentSection(data)} className={`cc-23-skill ${classApply}`}>
				<div className="mr-[8px]">{data?.Name}</div>

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
							<div className={`cc-23-skill-info ${activated ? 'bg-[#fff]' : 'bg-[#0A89FF]'}`}>
								<FiMoreVertical size={12} className={activated ? 'text-[#0A89FF]' : 'text-[#fff]'} />
							</div>
						</Popover>
					</PrimaryTooltip>
				</div>
			</div>
		</>
	)
}

export default ExamSectionItem
