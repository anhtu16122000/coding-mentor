import Router from 'next/router'
import React, { FC } from 'react'
import { TbFileCertificate } from 'react-icons/tb'
import htmlParser from '~/common/components/HtmlParser'

type TGroupContent = {
	is: any
	curGroup: any
	questionsInSection?: any
	className?: string
}

const GroupContent: FC<TGroupContent> = (props) => {
	const { is, curGroup, questionsInSection, className } = props

	if (!curGroup?.Content) {
		return <></>
	}

	function getQuestIndex(Id) {
		if (Router.asPath.includes('questions')) {
			return
		}

		const theIndex = questionsInSection.findIndex((question) => question?.IeltsQuestionId == Id)

		if (theIndex !== -1) {
			return questionsInSection[theIndex]?.Index
		}

		return ''
	}

	function getTotalPoint() {
		let total = 0

		if (!curGroup?.IeltsQuestions) {
			return 0
		}

		for (let i = 0; i < curGroup?.IeltsQuestions.length; i++) {
			total += curGroup?.IeltsQuestions[i]?.Point || 0
		}

		return total
	}

	const RealQuestIndex = () => {
		return (
			<div className="pb-[16px]">
				<div className="pb-[8px]">
					<em className="font-[600] text-[18px] text-[#0A89FF]">
						Question: {getQuestIndex(curGroup?.IeltsQuestions[0]?.Id)} -{' '}
						{getQuestIndex(curGroup?.IeltsQuestions[curGroup?.IeltsQuestions.length - 1]?.Id)}
					</em>
				</div>

				<div className="cc-choice-point !ml-0">
					<TbFileCertificate size={12} className="mr-1" />
					<div className="mt-[1px]">Total Point: {getTotalPoint()}</div>
				</div>
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

export default GroupContent
