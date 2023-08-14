import React, { useState } from 'react'
import { Collapse, Divider, Modal, Popconfirm, Spin } from 'antd'
import { ShowNoti } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import { FaInfo } from 'react-icons/fa'
import ExamSkillInfo from './exam-skill.info'
import { IoCloseSharp } from 'react-icons/io5'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import { MdHeadphones } from 'react-icons/md'
import CreateExamSkill from './exam-skill-form'
import ExamSection from '../ExamSkillSection'

const { Panel } = Collapse

function ExamSkillItem(props) {
	const { data, index, onClick, activeKey, onRefresh } = props

	const [detailVis, setDetailVis] = useState(false)

	function toggle() {
		setDetailVis(!detailVis)
	}

	const [deleting, setSeleting] = useState(false)

	async function handleDeleteSkill(event) {
		event?.stopPropagation()
		setSeleting(true)
		try {
			const response = await ieltsSkillApi.delete(data?.Id)
			if (response.status == 200) {
				onRefresh()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setSeleting(false)
		}
	}

	function TheMenu() {
		return (
			<div className="flex items-center">
				<PrimaryTooltip place="left" id={`tip-${index}`} content="Thông tin">
					<div
						onClick={(event) => {
							event.stopPropagation()
							toggle()
						}}
						className="w-[28px] h-[28px] cursor-pointer bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] rounded-full all-center"
					>
						<FaInfo size={12} className="text-[#fff]" />
					</div>
				</PrimaryTooltip>

				<PrimaryTooltip place="left" id={`del-s-${index}`} content="Xoá">
					<Popconfirm title="Xoá kỹ năng?" onConfirm={handleDeleteSkill} placement="left">
						<div
							onClick={(event) => event.stopPropagation()}
							className="ml-[8px] w-[28px] h-[28px] cursor-pointer bg-[#C94A4F] hover:bg-[#b43f43] focus:bg-[#9f3136] rounded-full all-center"
						>
							{deleting && <Spin className="loading-base !ml-0 !mt-0" />}
							{!deleting && <IoCloseSharp size={16} className="text-[#fff]" />}
						</div>
					</Popconfirm>
				</PrimaryTooltip>

				<PrimaryTooltip place="left" id={`ed-s-${index}`} content="Cập nhật">
					<CreateExamSkill onRefresh={onRefresh} isEdit defaultData={data} />
				</PrimaryTooltip>
			</div>
		)
	}

	const genExtra = () => (
		<div className="hidden w450:inline">
			<TheMenu />
		</div>
	)

	return (
		<>
			<div key={`sk-${index}`} className="mb-[16px]">
				<Collapse activeKey={[activeKey]} expandIconPosition="left">
					<Panel
						header={
							<div onClick={onClick}>
								<div className="font-[600] text-[#000] text-[16px]">{data?.Name}</div>
								<div className="font-[400] text-[#676767] text-[12px]">
									Thời gian: {data?.Time} phút • Tổng điểm: {data?.Point}{' '}
									{data?.Audio && (
										<div className="inline-flex items-center">
											<div className="mx-[3px] inline">•</div>
											<PrimaryTooltip id={`sk-au-tip-${index}`} place="right" content="Có file nghe">
												<MdHeadphones size={14} className="mt-[-2px] ml-[2px]" />
											</PrimaryTooltip>
										</div>
									)}
								</div>
								<div className="flex w450:hidden pt-[8px]">
									<TheMenu />
								</div>
							</div>
						}
						key={data?.Id}
						extra={genExtra()}
					>
						{data?.Audio && (
							<>
								<audio className="w-full max-w-[300px]" controls controlsList="nodownload noplaybackrate">
									<source src={data?.Audio} type="audio/mpeg" />
									Trình duyệt của bạn không hỗ trợ. Vui lòng sử dụng Chrome.
								</audio>
								<Divider className="ant-divider-16" />
							</>
						)}

						<ExamSection data={data} activated={activeKey == data?.Id} />
					</Panel>
				</Collapse>
			</div>

			<Modal width={500} open={detailVis} title={`Thông tin kỹ năng`} footer={null} onCancel={toggle}>
				<ExamSkillInfo {...props} onClose={toggle} />
			</Modal>
		</>
	)
}

export default ExamSkillItem
