import { Popconfirm, Popover } from 'antd'
import React, { useRef } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setCurrentExerciseForm } from '~/store/globalState'
import { QUESTION_TYPES } from '~/common/libs'

import QuestionInputForm from './MultipleChoiceForm/Form'
import FormWriting from './WritingForm/form-writing'
import TrueFalseForm from './TrueFalseForm'
import TrueFalseQuestion from './TrueFalseForm/Question'
import InputTrueFalse from './TrueFalseForm/Form'

const QestDragMenu = (props) => {
	const { isQuest, questionType } = props

	const theRef = useRef(null)

	const answers = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	const dispatch = useDispatch()

	async function deleteQuestion() {
		let temp = []
		answers.forEach((answer) => {
			if (!!answer.Id) {
				if (answer.Id !== props.item.Id) {
					temp.push(answer)
				} else {
					temp.push({ ...answer, Enable: false })
				}
			} else {
				if (answer.ficaID !== props.item.ficaID) {
					temp.push(answer)
				}
			}
		})
		dispatch(setCurrentExerciseForm(temp))
	}

	return (
		<Popover
			ref={theRef}
			placement="left"
			content={
				<div className="max-w-[130px] none-selection exam-dropdown">
					{isQuest && questionType == QUESTION_TYPES.Write && (
						<FormWriting isWriting={true} isEdit defaultData={props.item} onOpen={() => theRef?.current?.close()} />
					)}

					{isQuest && questionType == QUESTION_TYPES.MultipleChoice && (
						<QuestionInputForm isEdit defaultData={props.item} onOpen={() => theRef?.current?.close()} />
					)}

					{isQuest && questionType == QUESTION_TYPES.TrueOrFalse && (
						<InputTrueFalse isEdit defaultData={props.item} onOpen={() => theRef?.current?.close()} />
					)}

					<Popconfirm placement="left" title="Xoá câu hỏi?" okText="Xóa" cancelText="Hủy" onConfirm={deleteQuestion}>
						<div className="button-delete-choice">
							<RiDeleteBin6Line size={18} className="mr-2 mt-[-2px]" />
							Xoá
						</div>
					</Popconfirm>
				</div>
			}
			trigger="click"
			title=""
		>
			<div className="cc-exercise-drag-menu">
				<FiMoreHorizontal size={18} color="#fff" />
			</div>
		</Popover>
	)
}

export default QestDragMenu
