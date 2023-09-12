import React from 'react'
import { MdSettings } from 'react-icons/md'
import PrimaryButton from '~/common/components/Primary/Button'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'

const ResultDetailHeader = (props) => {
	const { overview, loading, setShowSetings, showSettings, skills, currentSkill } = props

	const globalState = useSelector((state: RootState) => state.takeAnExam)
	const indexOfSkill = skills.findIndex((skill) => skill?.Id == currentSkill?.Id)

	return (
		<div className="exam-23-header">
			<PrimaryTooltip id="fucking-home" content="Trang chủ" place="right">
				<a href="/">
					<div className="pl-[16px] hidden w600:block">
						<img src="/shot-logo.png" className="w-auto h-[46px]" />
					</div>
					<div className="pl-[16px] block w600:hidden">
						<img src="/mini-logo.png" className="w-auto h-[36px]" />
					</div>
				</a>
			</PrimaryTooltip>

			<div className="ml-[16px] flex-1 pr-2">
				<div className="cc-text-16-700 in-1-line">{overview?.Name}</div>
				<div className="cc-text-14-500-blue flex items-center mt-[2px]">
					<div className="all-center inline-flex cc-choice-point !ml-0">{overview?.QuestionsAmount} câu</div>
					<div className="cc-choice-correct-number">{overview?.Point} điểm</div>
					<div className="cc-choice-orange">
						Kỹ năng: {indexOfSkill + 1}/{skills.length}
					</div>
				</div>
			</div>

			{!globalState?.submited && (
				<div className="take-an-exam__right">
					<div className="take-an-exam__countdown">
						{loading && <>-- : -- : --</>}
						{!loading && (
							<>
								Thời gian: {overview?.TimeSpent > 1 ? overview?.TimeSpent : 1} / {overview?.Time} phút
							</>
						)}
					</div>
				</div>
			)}

			<PrimaryButton onClick={() => setShowSetings(!showSettings)} className="mx-[16px]" type="button" background="yellow">
				<MdSettings size={20} />
			</PrimaryButton>
		</div>
	)
}

export default ResultDetailHeader
