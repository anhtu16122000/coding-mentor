import React from 'react'

const DragHeader = (props) => {
	const { answers } = props

	return (
		<div className="drag-23-suggest">
			<div className="text-18-600 mb-[16px]">Danh sách đáp án</div>

			<div className="grid grid-cols-3 gap-3">
				{answers?.map((answer, answerIndex) => {
					return (
						<div key={`dr-23-ans-${answer?.Id}`} className="drag-23-ans-item">
							<div className="drag-23-ans-number">{answerIndex + 1}</div>
							<div>{answer?.Content}</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default DragHeader
