import { Divider, Popconfirm } from 'antd'
import React, { useState } from 'react'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import CreateExam from './exam-form'
import { RiArrowLeftSLine } from 'react-icons/ri'
import { FaRegCalendarAlt, FaUserEdit, FaUserPlus } from 'react-icons/fa'
import { MdDateRange, MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { parseDateTime } from '~/common/utils/main-function'
import CountUp from 'react-countup'
import { ieltsExamApi } from '~/api/IeltsExam'

const ExamInfo = (params) => {
	const { data, onRefresh, onClose } = params

	const [loading, setLoading] = useState(false)

	async function deleteExercise() {
		setLoading(true)
		try {
			const response = await ieltsExamApi.delete(data?.Id)
			if (response.status == 200) {
				onRefresh()
				!!onClose && onClose()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [showALL, setShowAll] = useState<boolean>(false)

	return (
		<>
			<div className="!flex mb-[8px]">
				<div className="cc-exam-item-code">Mã đề: {data?.Code}</div>
			</div>

			<div className="cc-exam-item-name">{data?.Name}</div>

			<Divider className="ant-divider-16" />

			<div className="grid grid-cols-2 gap-3">
				<div className="cc-xem-info-quest-container">
					<div className="font-[500]">Tổng số câu</div>
					<CountUp end={data?.QuestionsAmount} className="font-[600] text-[20px]" />
				</div>

				<div className="cc-xem-info-quest-container">
					<div className="font-[500]">Câu dễ</div>
					<CountUp end={data?.QuestionsEasy} className="font-[600] text-[20px]" />
				</div>

				<div className="cc-xem-info-quest-container">
					<div className="font-[500]">Câu thường</div>
					<CountUp end={data?.QuestionsNormal} className="font-[600] text-[20px]" />
				</div>

				<div className="cc-xem-info-quest-container">
					<div className="font-[500]">Câu khó</div>
					<CountUp end={data?.QuestionsDifficult} className="font-[600] text-[20px]" />
				</div>
			</div>

			<Divider className="ant-divider-16" />

			<div className="text-[#1b73e8]">
				<strong>Mô tả</strong>
			</div>

			<div className="whitespace-pre-wrap">{data?.Description || 'Không có mô tả'}</div>

			<Divider className="ant-divider-16" />

			<div onClick={() => setShowAll(!showALL)} className="flex items-center cursor-pointer  no-select hover:text-[#1b73e8]">
				<div>{showALL ? 'Ẩn bớt' : 'Hiện thêm'}</div>
				<MdOutlineKeyboardArrowDown size={20} className={`ml-[4px] rotate-${showALL ? '180' : 0} duration-200`} />
			</div>

			{showALL && (
				<div className="mt-[16px]">
					<div className="flex items-center">
						<div className="cc-exam-info-item-icon">
							<MdDateRange size={19} />
						</div>
						<div>
							<strong>Ngày tạo:</strong> {parseDateTime(data?.CreatedOn)}
						</div>
					</div>

					<div className="flex items-center mt-[8px]">
						<div className="cc-exam-info-item-icon">
							<FaUserPlus size={18} />
						</div>
						<div>
							<strong>Người tạo:</strong> {data?.CreatedBy}
						</div>
					</div>

					<div className="flex items-center mt-[8px]">
						<div className="cc-exam-info-item-icon">
							<FaRegCalendarAlt size={16} />
						</div>
						<div>
							<strong>Ngày cập nhật:</strong> {parseDateTime(data?.ModifiedOn)}
						</div>
					</div>

					<div className="flex items-center mt-[8px]">
						<div className="cc-exam-info-item-icon">
							<FaUserEdit size={18} />
						</div>
						<div>
							<strong>Người cập nhật:</strong> {data?.ModifiedBy}
						</div>
					</div>
				</div>
			)}

			<Divider className="ant-divider-16" />

			<div className="flex items-center none-selection">
				<div className="flex items-center flex-1">
					<Popconfirm title="Xoá đề này?" placement="top" onConfirm={deleteExercise}>
						<PrimaryButton loading={loading} className="mr-[8px]" type="button" background="red" icon="remove">
							Xoá
						</PrimaryButton>
					</Popconfirm>
					<CreateExam onRefresh={onRefresh} isEdit defaultData={data} />
				</div>
				<div className="btn-exam-detail">
					<div>Chi tiết</div>
					<RiArrowLeftSLine size={20} className="btn-exam-icon rotate-180" />
				</div>
			</div>
		</>
	)
}

export default ExamInfo
