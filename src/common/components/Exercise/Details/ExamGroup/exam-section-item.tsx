import React, { useEffect, useState } from 'react'
import { Card, Collapse, Divider, Modal, Popconfirm, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPackage, setGlobalBreadcrumbs, setTotalPoint } from '~/store/globalState'
import Router, { useRouter } from 'next/router'
import { RootState } from '~/store'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { ieltsExamApi } from '~/api/IeltsExam'
import { decode, wait } from '~/common/utils/common'
import { ShowNostis, ShowNoti, log } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import { FaInfo, FaSortDown, FaSortUp } from 'react-icons/fa'
import ExamSkillInfo from './exam-skill.info'
import { IoCloseSharp } from 'react-icons/io5'
import PrimaryButton from '~/common/components/Primary/Button'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import { MdHeadphones } from 'react-icons/md'
import CreateExamSkill from './exam-section-form'
import htmlParser from '~/common/components/HtmlParser'
import { IoIosArrowDown } from 'react-icons/io'

const { Panel } = Collapse

function ExamSectionItem(props) {
	const { data, index, onClick, activeKey, onRefresh, showEditIndex, sections, setSections } = props

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

	function onUp() {
		const itemIndex = sections.findIndex((sec) => sec.Id === data?.Id)

		if (itemIndex > 0 && itemIndex < sections.length) {
			const itemToMove = sections[itemIndex]
			sections.splice(itemIndex, 1) // Xóa item tại vị trí index
			sections.splice(itemIndex - 1, 0, itemToMove) // Chèn item vào vị trí trước index
		}

		setSections([...sections])
	}

	function onDown() {
		const itemIndex = sections.findIndex((sec) => sec.Id === data?.Id)

		if (itemIndex >= 0 && itemIndex < sections.length - 1) {
			const itemToMove = sections[itemIndex]
			sections.splice(itemIndex, 1) // Xóa item tại vị trí index
			sections.splice(itemIndex + 1, 0, itemToMove) // Chèn item vào vị trí trước index
		}

		setSections([...sections])
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

	// --------------------------------------------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------------------------------------------
	function IndexMenu() {
		return (
			<div className="flex items-center">
				<PrimaryTooltip place="left" id={`tip-sec-${data?.Id}`} content={index == 0 ? 'Đây đã là phần đầu tiên' : 'Chuyển lên'}>
					<div
						onClick={onUp}
						className="w-[28px] h-[28px] cursor-pointer bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] rounded-full all-center"
						style={{ background: index == 0 ? '#c7c7c7' : '' }}
					>
						<FaSortUp size={18} className="text-[#fff] mb-[-8px]" />
					</div>
				</PrimaryTooltip>

				<PrimaryTooltip
					place="left"
					id={`tip-sec-2-${data?.Id}`}
					content={sections?.length == 1 ? 'Đây đã là phần cuối cùng' : 'Chuyển xuống'}
				>
					<div
						onClick={onDown}
						className="ml-[8px] w-[28px] h-[28px] cursor-pointer bg-[#C94A4F] hover:bg-[#b43f43] focus:bg-[#9f3136] rounded-full all-center"
						style={{ background: index == sections?.length - 1 ? '#c7c7c7' : '' }}
					>
						<FaSortDown size={18} className="text-[#fff] mt-[-6px]" />
					</div>
				</PrimaryTooltip>
			</div>
		)
	}

	const genExtra = () => (
		<div className="hidden w450:inline">
			{!showEditIndex && <TheMenu />}
			{showEditIndex && <IndexMenu />}
		</div>
	)

	const [showReading, setShowReading] = useState<boolean>(true)

	return (
		<>
			<div key={`sk-${index}`} className="mb-[16px] no-padding-collapse">
				<Collapse activeKey={[activeKey]} expandIconPosition="left">
					<Panel
						header={
							<div onClick={onClick} className="h-full flex items-center py-[8px] rounded-[6px] mr-[8px]">
								<div className="px-[8px]">
									{data?.Id != activeKey && <IoIosArrowDown size={18} />}
									{data?.Id == activeKey && <IoIosArrowDown size={18} className="rotate-180" />}
								</div>

								<div className="font-[600] text-[#000] text-[16px]">{data?.Name}</div>

								<div className="font-[400] text-[#676767] text-[12px]">
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
						{!showEditIndex && (
							<>
								{data?.Audio && (
									<>
										<audio className="w-full max-w-[300px]" controls controlsList="nodownload noplaybackrate">
											<source src={data?.Audio} type="audio/mpeg" />
											Trình duyệt của bạn không hỗ trợ. Vui lòng sử dụng Chrome.
										</audio>
										<Divider className="ant-divider-16" />
									</>
								)}

								{!!data?.ReadingPassage && (
									<PrimaryButton
										type="button"
										background="yellow"
										onClick={() => setShowReading(!showReading)}
										className="!h-[30px] !px-[8px]"
									>
										{!showReading && <IoIosArrowDown size={18} className="mr-[4px]" />}
										{showReading && <IoIosArrowDown size={18} className="rotate-180 mr-[4px]" />}
										{!showReading ? 'Hiện bài đọc' : 'Ẩn bài đọc'}
									</PrimaryButton>
								)}

								{showReading && <div className="whitespace-pre-wrap">{htmlParser(data?.ReadingPassage)}</div>}
							</>
						)}
					</Panel>
				</Collapse>
			</div>

			<Modal width={500} open={detailVis} title={`Thông tin kỹ năng`} footer={null} onCancel={toggle}>
				<ExamSkillInfo {...props} onClose={toggle} />
			</Modal>
		</>
	)
}

export default ExamSectionItem
