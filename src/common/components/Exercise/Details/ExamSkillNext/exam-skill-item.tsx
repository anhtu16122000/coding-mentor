import React, { useRef, useState } from 'react'
import { Collapse, Divider, Modal, Popconfirm, Popover, Spin } from 'antd'
import { ShowNoti, wait } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import { FaInfo, FaInfoCircle } from 'react-icons/fa'
import ExamSkillInfo from './exam-skill.info'
import { IoCloseSharp } from 'react-icons/io5'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import { MdHeadphones } from 'react-icons/md'
import CreateExamSkill from './exam-skill-form'
import ExamSection from '../ExamSkillSection'
import { FiMoreVertical } from 'react-icons/fi'

const { Panel } = Collapse

function ExamSkillItem(props) {
	const { data, index, onRefresh, currentSkill, setCurrentSkill } = props

	const activated = currentSkill?.Id == data.Id

	const popref = useRef(null)

	const [detailVis, setDetailVis] = useState(false)

	function toggle() {
		setDetailVis(!detailVis)
	}

	const [deleting, setSeleting] = useState(false)

	async function handleDeleteSkill(event) {
		event?.stopPropagation()
		setSeleting(true)

		if (activated) {
			setCurrentSkill(null)
			await wait(100)
		}

		try {
			const response = await ieltsSkillApi.delete(data?.Id)
			if (response.status == 200) {
				onRefresh()
				closePopover()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setSeleting(false)
		}
	}

	function closePopover() {
		if (popref?.current) {
			popref?.current?.close()
		}
	}

	const content = (
		<div className="cursor-pointer">
			<div
				className="cc-23-skill-menu-item"
				onClick={(event) => {
					closePopover()
					event.stopPropagation()
					toggle()
				}}
			>
				<FaInfoCircle size={18} color="#1E88E5" />
				<div className="ml-[8px] font-[500]">Thông tin</div>
			</div>

			<CreateExamSkill onOpen={closePopover} onRefresh={onRefresh} isEdit defaultData={data} />

			<Popconfirm title="Xoá kỹ năng?" onConfirm={handleDeleteSkill} placement="left">
				<div className="cc-23-skill-menu-item">
					<IoCloseSharp size={20} className="text-[#F44336] ml-[-2px]" />
					<div className="ml-[8px] font-[500]">Xoá</div>
				</div>
			</Popconfirm>
		</div>
	)

	const noneActiveClass = 'text-[#000] bg-[#e9e9e9] hover:bg-[#dad9d9]'
	const activeClass = 'text-[#fff] bg-[#1b73e8] hover:bg-[#1867cf]'

	const classApply = activated ? activeClass : noneActiveClass

	return (
		<>
			<div onClick={() => setCurrentSkill(data)} className={`cc-23-skill ${classApply}`}>
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

			<Modal width={500} open={detailVis} title={`Thông tin kỹ năng`} footer={null} onCancel={toggle}>
				<ExamSkillInfo {...props} onClose={toggle} />
			</Modal>
		</>
	)
}

export default ExamSkillItem
