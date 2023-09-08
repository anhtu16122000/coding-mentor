import React from 'react'
import htmlParser from '~/common/components/HtmlParser'

const MindMapAnswer = ({ answer, index }) => {
	return (
		<div className={`ex-mind-ans ${index != 0 ? 'ex-mind-ans-border' : ''}`}>
			<div className="ex-mind-ans-content">{htmlParser(answer?.Content || answer?.IeltsAnswerContent)}</div>
		</div>
	)
}

export default MindMapAnswer
