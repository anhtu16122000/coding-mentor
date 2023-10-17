import Router from 'next/router'
import React from 'react'
import htmlParser from '~/common/components/HtmlParser'

const QuestionContent = ({ Index, Content, question }) => {
	return (
		<div
			id={`cauhoi-${question.Id}`}
			className={`the-fucking-mind border-t-[1px] px-[8px] border-[#ffffff] h-[46px] flex items-center bg-[#f8f8f8] min-w-[110px]`}
		>
			<div>
				<div className="inline-flex items-center justify-center mr-[8px]">
					{!Router.asPath.includes('questions') && (
						<div id={`quest-num-${question.Id}`} className="ex-quest-tf">
							{Index}
						</div>
					)}

					<div className="bg-[#e9e9e9] h-[26px] px-[8px] rounded-full text-[14px] inline-flex items-center justify-center">
						<div>Point: {question?.Point || 0}</div>
					</div>
				</div>

				{htmlParser(Content)}
			</div>
		</div>
	)
}

export default QuestionContent
