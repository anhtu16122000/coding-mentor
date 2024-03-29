import React from 'react'
import CountdownTimer from '../Countdown'
import Lottie from 'react-lottie-player'
import timer from '~/common/components/json/131525-timer.json'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import DrawerSettings from '../../Components/DrawerSettings'
import { useExamContext } from '~/common/providers/Exam'

const TakeAnExamHeader = (props) => {
	const { testInfo, overview, skills, currentSkill, onSubmit } = props
	const { showSkills, setShowSkills, showSections, setShowSections, showQuestions, setShowQuestions } = props

	const { loading } = useExamContext()

	const globalState = useSelector((state: RootState) => state.takeAnExam)

	function isEndTimeGreaterThanStartTime(startTime, endTime) {
		// Chuyển đổi chuỗi thời gian thành đối tượng Date
		const startTimeObj = new Date(startTime).getTime()
		const endTimeObj = new Date(endTime).getTime()

		// Tính khoảng thời gian giữa endTime và startTime (tính bằng milliseconds)
		const timeDifference = endTimeObj - startTimeObj

		// 1 phút = 60 giây = 60,000 milliseconds
		const oneMinuteInMilliseconds = 60000

		// So sánh khoảng thời gian với 1 phút (60,000 milliseconds)
		if (timeDifference >= oneMinuteInMilliseconds) {
			return true
		} else {
			return false
		}
	}

	function calculateEndTime(startTime, minutes) {
		// Tạo đối tượng Date từ thời gian bắt đầu
		const start = new Date(startTime)
		const nowTime = new Date()

		// Tính thời gian kết thúc bằng cách thêm số phút vào thời gian bắt đầu
		const end = new Date(start.getTime() + minutes * 60000)

		// Tính số phút còn lại bằng cách lấy thời gian kết thúc trừ đi thời gian bắt đầu, chia cho 60000 (mili giây) và làm tròn xuống
		const remainingMinutes = Math.floor((end.getTime() - nowTime.getTime()) / 60000)

		const tobeContinue = isEndTimeGreaterThanStartTime(start, end)

		if (tobeContinue) {
			// Trả về đối tượng JSON chứa thời gian kết thúc và số phút còn lại
			return remainingMinutes > -1 ? remainingMinutes : 0
		} else {
			return 0
		}
	}

	const indexOfSkill = !skills ? 0 : skills.findIndex((skill) => skill?.Id == currentSkill?.Id)

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
					<div className="all-center inline-flex cc-choice-point !ml-0">Questions: {overview?.QuestionsAmount}</div>
					<div className="cc-choice-correct-number">Point: {overview?.Point}</div>
					<div className="cc-choice-orange">
						Skill: {indexOfSkill + 1}/{!skills ? 0 : skills.length}
					</div>
				</div>
			</div>

			{!globalState?.submited && (
				<div className="take-an-exam__right mr-[8px]">
					<Lottie
						loop
						animationData={timer}
						play
						style={{ width: 47, height: 47, marginLeft: -14, marginRight: -8, marginTop: -6, marginBottom: -6 }}
					/>
					<div className="take-an-exam__countdown">
						{loading && <>-- : -- : --</>}
						{!loading && !!overview?.Time && !!overview && (
							<CountdownTimer onSubmit={onSubmit} minutes={calculateEndTime(testInfo?.StartTime, parseInt(overview?.Time.toString()))} />
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

export default TakeAnExamHeader
