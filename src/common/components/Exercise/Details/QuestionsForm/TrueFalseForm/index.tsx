import React, { FC, useRef } from 'react'
import DraggableList from 'react-draggable-list'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import TrueFalseQuestion from './Question'
import cx from 'classnames'
import { setCurrentExerciseForm } from '~/store/globalState'
import QestDragMenu from '../QuestDragMenu'
import InputTrueFalse from './Form'
import { QUESTION_TYPES } from '~/common/libs'

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
			<div
				className={cx('cc-quest-wrapper !pb-[3px]', { dragged })}
				style={{ transform: `scale(${scale})`, borderWidth: 1, borderStyle: 'solid' }}
			>
				<div className="dragHandle mt-[10px] ml-2" {...dragHandleProps} />

				<div className="cc-form-group-header">
					<div className="cc-form-gr-number mt-2">
						Câu {item.Index}
						<span className="text-[#000000] font-[600] ml-2">({item?.Point} điểm)</span>
					</div>

					<div className="!inline-flex">
						<QestDragMenu item={item} isQuest questionType={QUESTION_TYPES.TrueOrFalse} />
					</div>
				</div>

				<TrueFalseQuestion data={item} type="edit" />
			</div>
		)
	}
}

const TrueFalseForm = () => {
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

	console.log('--- TRUE OR FALSE Exercises: ', exercises)

	return (
		<div className="drag-list">
			<div className="drag-section">
				<div className="flex w-full">
					<div className="flex-1"></div>
					<div className="h-[30px] flex items-center ">
						<div className="w-[50px]">True</div>
						<div className="w-[50px]">False</div>
						<div className="w-[80px]">Not given</div>
					</div>
				</div>

				<DraggableList
					itemKey="Index"
					template={GroupItem}
					list={formatData(exercises)}
					onMoveEnd={(newList) => changeQuestions(newList)}
					container={() => questRef.current!}
				/>

				<InputTrueFalse />
			</div>
		</div>
	)
}

export default TrueFalseForm
