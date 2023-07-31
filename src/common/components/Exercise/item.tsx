import { Card, Divider, Modal } from 'antd'
import React, { FC, useState } from 'react'
import Router from 'next/router'
import { encode } from '~/common/utils/super-functions'
import PrimaryTooltip from '../PrimaryTooltip'
import { RiArrowLeftSLine, RiFileList2Fill } from 'react-icons/ri'
import { IoInformationCircle } from 'react-icons/io5'
import ExamInfo from './exam-info'

const ExamItem: FC<IExerciseItem> = (props) => {
	const { data, index, style } = props

	const [visible, setVisible] = useState<boolean>(false)

	function _viewDetail() {
		const theQuery = { exam: encode(data?.Id) }
		Router.push({ pathname: `/exam/detail`, query: theQuery })
	}

	function toggle() {
		setVisible(!visible)
	}

	// File này 1 file hiển thị 2 style nên hơi rối
	// Sửa thì nhớ check, sửa cả 2 style
	// Bí quá thì hỏi ngài Chaos

	return (
		<>
			<Card className={`cc-exam-item !p-[4px] mb-[${style == 2 ? '8px' : '16px'}] mx-[8px] relative`}>
				<div className="items-start" style={{ display: style == 2 ? 'flex' : 'block' }}>
					<div className="flex items-start flex-1" style={{ marginBottom: style == 2 ? 0 : 8 }}>
						<div className="items-center">
							<div className="cc-exam-item-code">Mã đề: {data?.Code}</div>
						</div>

						{style == 2 && (
							<div onClick={_viewDetail} className="cc-exam-item-name !text-[16px] mx-[24px] flex-1 hidden w700:block">
								{data?.Name}
							</div>
						)}

						{style == 2 && (
							<div data-tut="reactour-total-quest" className="flex items-center mt-[2px] ml-[8px] text-[#686868]">
								<RiFileList2Fill size={16} />
								<div className="ml-[4px] font-[500]">{data?.QuestionsAmount} câu hỏi</div>
							</div>
						)}
					</div>

					{style == 1 && (
						<div onClick={_viewDetail} className="cc-exam-item-name">
							{data?.Name}
						</div>
					)}

					{style == 1 && (
						<div data-tut="reactour-total-quest" className="flex items-center mt-[8px] text-[#686868]">
							<RiFileList2Fill size={16} />
							<div className="ml-[4px] font-[500]">{data?.QuestionsAmount} câu hỏi</div>
						</div>
					)}

					{style == 1 && (
						<>
							<Divider className="ant-divider-16" />
							<div className="flex items-center justify-between none-selection">
								<PrimaryTooltip id={`ex-tip-${index}`} content="Thông tin" place="right">
									<div data-tut="reactour-information" onClick={toggle} className="btn-exam-info my-[-8px]">
										<IoInformationCircle className="btn-exam-info-icon" />
									</div>
								</PrimaryTooltip>
								<div onClick={_viewDetail} className="btn-exam-detail">
									<div>Chi tiết</div>
									<RiArrowLeftSLine size={20} className="btn-exam-icon rotate-180" />
								</div>
							</div>
						</>
					)}

					{style == 2 && (
						<>
							<div className="flex items-center justify-between none-selection ml-[32px] mt-[6px]">
								{style == 2 && (
									<PrimaryTooltip id={`ex-tip-${index}`} content="Thông tin" place="right">
										<div data-tut="reactour-information" onClick={toggle} className="btn-exam-info my-[-8px] mr-[8px]">
											<IoInformationCircle className="btn-exam-info-icon" size={26} />
										</div>
									</PrimaryTooltip>
								)}
								<div onClick={_viewDetail} className="btn-exam-detail">
									<div>Chi tiết</div>
									<RiArrowLeftSLine size={20} className="btn-exam-icon rotate-180" />
								</div>
							</div>
						</>
					)}
				</div>

				{style == 2 && (
					<div onClick={_viewDetail} className="cc-exam-item-name mr-[100px] mt-[4px] mb-[-8px] !text-[16px] block w700:hidden">
						{data?.Name + ' ' + data?.Name}
					</div>
				)}
			</Card>

			<Modal width={500} open={visible} title={`Thông tin đề: ${data?.Code}`} footer={null} onCancel={toggle}>
				<ExamInfo {...props} onClose={toggle} />
			</Modal>
		</>
	)
}

export default ExamItem
