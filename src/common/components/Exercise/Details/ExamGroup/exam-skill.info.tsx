import { Divider } from 'antd'
import { useState } from 'react'
import CountUp from 'react-countup'
import { FaRegCalendarAlt, FaUserEdit, FaUserPlus } from 'react-icons/fa'
import { MdDateRange, MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { parseDateTime } from '~/common/utils/main-function'

const ExamSkillInfo = (params) => {
	const { data } = params

	const [showALL, setShowAll] = useState<boolean>(false)

	return (
		<>
			<div className="cc-exam-item-name !mt-[-4px] text-center">{data?.Name}</div>

			<Divider className="ant-divider-16" />

			<div className="grid grid-cols-2 w400:grid-cols-2 gap-3">
				<div className="cc-xem-info-quest-container !text-[#D21320]">
					<div className="font-[500]">Tổng số câu</div>
					<CountUp end={data?.QuestionsAmount} className="font-[600] text-[20px]" />
				</div>

				<div className="cc-xem-info-quest-container !text-[#D21320]">
					<div className="font-[500]">Thời gian</div>
					<CountUp end={data?.Time} className="font-[600] text-[20px]" suffix=" phút" />
				</div>
			</div>

			<Divider className="ant-divider-16" />

			<div className="grid grid-cols-1 w400:grid-cols-3 gap-3">
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

			{data?.Audio && (
				<>
					<Divider className="ant-divider-16" />
					<div className="flex flex-col items-center">
						<div className="text-[#D21320]">
							<strong>Âm thanh</strong>
						</div>

						<div className="whitespace-pre-wrap">
							<div className="mt-[8px] flex items-center">
								<audio controls controlsList="nodownload noplaybackrate">
									<source src={data?.Audio} type="audio/mpeg" />
									Trình duyệt của bạn không hỗ trợ. Vui lòng sử dụng Chrome.
								</audio>
							</div>
						</div>
					</div>
				</>
			)}

			<Divider className="ant-divider-16" />

			<div onClick={() => setShowAll(!showALL)} className="all-center cursor-pointer text-center no-select hover:text-[#D21320]">
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
		</>
	)
}

export default ExamSkillInfo
