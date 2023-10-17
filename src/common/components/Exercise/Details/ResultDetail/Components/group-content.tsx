import Router from 'next/router'
import React, { FC } from 'react'
import { useExamContext } from '~/common/providers/Exam'
import htmlParser from '~/common/components/HtmlParser'

type TGroupContent = {
	is: any
	curGroup: any
	questionsInSection?: any
	className?: string
}

const ResultGroupContent: FC<TGroupContent> = (props) => {
	const { is, curGroup, className } = props

	const { questionsInSection } = useExamContext()

	if (!curGroup?.Content) {
		return <></>
	}

	function getQuestIndex(Id) {
		const theIndex = questionsInSection.findIndex((question) => question?.IeltsQuestionResultId == Id)

		if (theIndex !== -1) {
			return questionsInSection[theIndex]?.Index
		}

		return ''
	}

	const RealQuestIndex = () => {
		return (
			<div className="pb-[16px]">
				<em className="font-[600] text-[18px] text-[#0A89FF]">
					Question: {getQuestIndex(curGroup?.IeltsQuestionResults[0]?.Id)} -{' '}
					{getQuestIndex(curGroup?.IeltsQuestionResults[curGroup?.IeltsQuestionResults.length - 1]?.Id)}
				</em>
			</div>
		)
	}

	return (
		<>
			{!is.typing && !is.drag && (
				<div className={'mb-[16px] typing-drag-23-content' + ` ${className}`}>
					{!Router.asPath.includes('questions') && <RealQuestIndex />}
					{htmlParser(curGroup?.Content)}
				</div>
			)}

			{(is.drag || is.typing) && (
				<div className={'typing-drag-23-content' + ` ${className}`}>
					{!Router.asPath.includes('questions') && <RealQuestIndex />}
					<div className="mb-[16px]">{htmlParser(curGroup?.Content)}</div>
				</div>
			)}
		</>
	)
}

export default ResultGroupContent
