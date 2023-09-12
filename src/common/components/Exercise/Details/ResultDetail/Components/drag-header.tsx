import React from 'react'

const DragHeader = (props) => {
	const { answers, className } = props

	return (
		<div className={'drag-23-suggest' + ' ' + className}>
			<div className="text-18-600 no-select cursor-pointer mb-[16px] flex items-center">
				<div className="mr-[4px]">Danh sách đáp án</div>
			</div>

			<div className="grid grid-cols-2 w850:grid-cols-3 gap-3">
				{!!answers &&
					answers?.map((answer, answerIndex) => {
						return (
							<div key={`dr-23-ans-${answer?.Id}`} className="drag-23-ans-item">
								<div className="drag-23-ans-number flex-shrink-0">{answerIndex + 1}</div>
								<div>{answer?.IeltsAnswerContent}</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

export default DragHeader
