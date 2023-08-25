import { Empty } from 'antd'
import React, { FC } from 'react'
import htmlParser from '~/common/components/HtmlParser'

type TGroupContent = {
	is: any
	curGroup: any
	questionsInSection: any
}

const GroupContent: FC<TGroupContent> = (props) => {
	const { is, curGroup, questionsInSection } = props

	if (!curGroup?.Content) {
		return (
			<div className="all-center mt-[24px]">
				<Empty description="Chưa có câu hỏi" />
			</div>
		)
	}

	function getQuestIndex(Id) {
		const theIndex = questionsInSection.findIndex((question) => question?.IeltsQuestionId == Id)

		if (theIndex !== -1) {
			return questionsInSection[theIndex]?.Index
		}

		return ''
	}

	const RealQuestIndex = () => {
		return (
			<div className="pb-[16px]">
				<em className="font-[600] text-[18px] text-[#0A89FF]">
					Question: {getQuestIndex(curGroup?.IeltsQuestions[0]?.Id)} -{' '}
					{getQuestIndex(curGroup?.IeltsQuestions[curGroup?.IeltsQuestions.length - 1]?.Id)}
				</em>
			</div>
		)
	}

	return (
		<>
			{!is.typing && !is.drag && (
				<div className="mb-[16px] typing-drag-23-content">
					<RealQuestIndex />
					{htmlParser(curGroup?.Content)}
				</div>
			)}

			{(is.drag || is.typing) && (
				<div className="typing-drag-23-content">
					<RealQuestIndex />
					<div className="mb-[16px]">{htmlParser(curGroup?.Content)}</div>
				</div>
			)}
		</>
	)
}

export default GroupContent
