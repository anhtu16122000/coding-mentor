import React from 'react'
import htmlParser from '~/common/components/HtmlParser'

const QuestionContent = ({ Index, Content }) => {
	return (
		<div className={`the-fucking-mind border-t-[1px] px-[8px] border-[#ffffff] h-[46px] flex items-center bg-[#f2f2f2] min-w-[110px]`}>
			<div>
				<div className="inline mr-[4px] font-[600] text-[#0A89FF]">Câu {Index}:</div>
				{htmlParser(Content)}
			</div>
		</div>
	)
}

export default QuestionContent
