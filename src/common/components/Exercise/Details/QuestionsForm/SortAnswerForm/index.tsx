import React, { useRef } from 'react'
import DraggableList from 'react-draggable-list'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import Choice from './Question'
import cx from 'classnames'
import { setCurrentExerciseForm } from '~/store/globalState'
import QestDragMenu from '../QuestDragMenu'
import QuestionInputForm from './Form'
import { QUESTION_TYPES } from '~/common/libs'
import SortAnswerForm from './Form'

const SortAnswerContainer = () => {
	const questRef = useRef()

	const dispatch = useDispatch()
	const exercises = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	function changeQuestions(newList) {
		let newIndexList = []
		newList.forEach((item, index) => {
			newIndexList.push({ ...item, Index: index + 1 })
		})
		dispatch(setCurrentExerciseForm(newIndexList))
	}

	function formatData(param) {
		let temp = []
		let count = 1 // Renew Index
		param.forEach((item) => {
			if (item.Enable !== false) {
				temp.push({ ...item, Index: count })
			}
			count++
		})
		return temp
	}

	return (
		<div className="drag-list">
			<div className="drag-section">
				{exercises.map((ex) => {
					return (
						<>
							<div className={cx('cc-quest-wrapper')} style={{ borderWidth: 1, borderStyle: 'solid' }}>
								<div className="dragHandle mt-[10px] ml-2" />

								<div className="cc-form-group-header">
									<div className="cc-form-gr-number mt-2">
										Câu {ex.Index}
										<span className="text-[#000000] font-[600] ml-2">({ex?.Point} điểm)</span>
									</div>

									<div className="!inline-flex">
										<QestDragMenu item={ex} isQuest questionType={QUESTION_TYPES.MultipleChoice} />
									</div>
								</div>
							</div>
						</>
					)
				})}

				{/* <Choice data={item} type="edit" /> */}
			</div>

			<SortAnswerForm />
		</div>
	)
}

export default SortAnswerContainer
