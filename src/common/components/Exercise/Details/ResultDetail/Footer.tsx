import React from 'react'
import { MdArrowForwardIos } from 'react-icons/md'
import ButtonQuestion from '../ButtonQuestion'

const ERFooter = ({ visible, onToggle, questions, curQuest, onClickQuest, testInfo }) => {
	return (
		<>
			{visible && (
				<div className="exam-23-footer">
					<div className="flex flex-col flex-1 items-start">
						<div onClick={onToggle} className="ex-23-f-button">
							<MdArrowForwardIos className="rotate-90 mr-[8px]" />
							<div className="font-[500]">Câu hỏi ({questions.length})</div>
						</div>

						<div className="flex flex-wrap gap-y-[8px] items-center no-select">
							{questions.map((item, index) => {
								const activated = curQuest?.IeltsQuestionResultId == item?.IeltsQuestionResultId
								const thisKey = `quest-num-${index}`

								return <ButtonQuestion key={thisKey} isActivated={activated} data={item} onClick={() => onClickQuest(item)} />
							})}

							{questions.length == 0 && <div className="text-[red]">Chưa có câu hỏi</div>}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default ERFooter
