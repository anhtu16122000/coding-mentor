import React, { FC, useRef } from 'react'
import DraggableList from 'react-draggable-list'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import ReactHTMLParser from 'react-html-parser'
import cx from 'classnames'
import { setCurrentExerciseForm } from '~/store/globalState'
import QestDragMenu from '../QuestDragMenu'
import { QUESTION_TYPES } from '~/common/libs'
import FormWriting from './form-writing'

class GroupItem extends React.Component<PlanetProps, PlanetState> {
	state = { value: 0 }

	getDragHeight() {
		return 36
	}

	render() {
		const { item, itemSelected, dragHandleProps } = this.props

		const scale = itemSelected * 0.005 + 1
		const shadow = itemSelected * 1 + 0
		const dragged = itemSelected !== 0

		return (
			<>
				<div className={cx('cc-quest-wrapper', { dragged })} style={{ transform: `scale(${scale})`, borderWidth: 1, borderStyle: 'solid' }}>
					<div className="dragHandle mt-[10px] ml-2" {...dragHandleProps} />

					<div className="cc-form-group-header">
						<div className="cc-form-gr-number">Câu {item.Index}</div>

						<div className="!inline-flex">
							<QestDragMenu item={item} isQuest questionType={QUESTION_TYPES.Write} />
						</div>
					</div>

					<div className="w-full pr-2">{ReactHTMLParser(item?.Content)}</div>
				</div>
			</>
		)
	}
}

const CreateWriting = () => {
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
				<DraggableList
					itemKey="Id"
					template={GroupItem}
					list={formatData(exercises)}
					onMoveEnd={(newList) => changeQuestions(newList)}
					container={() => questRef.current!}
				/>

				<FormWriting />
			</div>
		</div>
	)
}

export default CreateWriting
