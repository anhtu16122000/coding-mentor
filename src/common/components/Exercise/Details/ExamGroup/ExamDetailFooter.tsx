import React from 'react'
import { MdArrowForwardIos } from 'react-icons/md'
import ButtonQuestion from '../ButtonQuestion'
import { useExamContext } from '~/common/providers/Exam'

const ExamDetailFooter = ({ toggleQuestions, currentQuestion, setCurrentQuestion, onClickQuest }) => {
	const { questionsInSection } = useExamContext()

	return (
		<div className="exam-23-footer">
			<div className="flex flex-col items-start">
				<div onClick={toggleQuestions} className="ex-23-f-button">
					<MdArrowForwardIos className="rotate-90 mr-[8px]" />
					<div className="font-[500]">Câu hỏi ({questionsInSection.length})</div>
				</div>

				<div className="flex items-center no-select">
					{questionsInSection.map((item, index) => {
						const activated = currentQuestion?.IeltsQuestionId == item?.IeltsQuestionId
						return <ButtonQuestion key={`quest-num-${index}`} isActivated={activated} data={item} onClick={() => onClickQuest(item)} />
					})}

					{questionsInSection.length == 0 && <div className="text-[red]">Chưa có câu hỏi</div>}
				</div>
			</div>
		</div>
	)
}

export default ExamDetailFooter
