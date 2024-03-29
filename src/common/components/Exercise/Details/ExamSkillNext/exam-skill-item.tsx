import { Modal, Popconfirm, Popover } from 'antd'
import { useRef, useState } from 'react'
import { FaHeadphonesAlt, FaInfoCircle } from 'react-icons/fa'
import { FiMoreVertical } from 'react-icons/fi'
import { IoCloseSharp } from 'react-icons/io5'
import { TiArrowSortedDown } from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import { ShowNoti, wait } from '~/common/utils'
import { userIs } from '~/common/utils/common'
import { RootState } from '~/store'
import CreateExamSkill from './exam-skill-form'
import ExamSkillInfo from './exam-skill.info'

function ExamSkillItem(props) {
	const { data, index, allSkills, onRefresh, onUp, onDown, showSort, currentSkill, setCurrentSkill, onPlayAudio, hideController } = props

	const activated = currentSkill?.Id == data.Id

	const popref = useRef(null)

	const [detailVis, setDetailVis] = useState(false)

	function toggle() {
		setDetailVis(!detailVis)
	}

	async function handleDeleteSkill(event) {
		event?.stopPropagation()

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

	const user = useSelector((state: RootState) => state.user.information)

	const noneActiveClass = 'text-[#000] bg-[#e9e9e9] hover:bg-[#dad9d9]'
	const activeClass = 'text-[#fff] bg-[#D21320] hover:bg-[#1867cf]'

	const classApply = activated ? activeClass : noneActiveClass

	return (
		<>
			<div onClick={() => !showSort && setCurrentSkill(data)} className={`cc-23-skill ${!!showSort ? noneActiveClass : classApply}`}>
				{index > 0 && !!showSort && (
					<div onClick={onUp} className="btn-sort-left">
						<TiArrowSortedDown size={16} className="rotate-90 ml-[-2px]" />
					</div>
				)}

				<div>{data?.Name}</div>

				{index < allSkills.length - 1 && !!showSort && (
					<div onClick={onDown} className="btn-sort-right">
						<TiArrowSortedDown size={16} className="-rotate-90 mr-[-2px]" />
					</div>
				)}

				{!showSort && (
					<>
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

						{(userIs(user).admin || userIs(user).manager) && !hideController && (
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
					</>
				)}
			</div>

			<Modal width={500} open={detailVis} title={`Thông tin kỹ năng`} footer={null} onCancel={toggle}>
				<ExamSkillInfo {...props} onClose={toggle} />
			</Modal>
		</>
	)
}

export default ExamSkillItem
