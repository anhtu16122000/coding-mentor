import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import DrawerSettings from '../../Components/DrawerSettings'

const ResultDetailHeader = (props) => {
	const { overview, loading, skills, currentSkill } = props
	const { showSkills, setShowSkills, showSections, setShowSections, showQuestions, setShowQuestions } = props

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
					<div className="all-center inline-flex cc-choice-point !ml-0">Question: {overview?.QuestionsAmount}</div>
					<div className="cc-choice-correct-number">Point: {overview?.Point}</div>
					<div className="cc-choice-orange">
						Skill: {indexOfSkill + 1}/{skills.length}
					</div>
				</div>
			</div>

			{!globalState?.submited && (
				<div className="take-an-exam__right mr-[8px]">
					<div className="take-an-exam__countdown">
						{loading && <>-- : -- : --</>}
						{!loading && (
							<>
								Time: {overview?.TimeSpent > 1 ? overview?.TimeSpent : 1} / {overview?.Time} minutes
							</>
						)}
					</div>
				</div>
			)}

			<DrawerSettings
				showSkills={showSkills}
				showSections={showSections}
				showQuestions={showQuestions}
				setShowSkills={setShowSkills}
				setShowQuestions={setShowQuestions}
				setShowSections={setShowSections}
			/>
		</div>
	)
}

export default ResultDetailHeader
