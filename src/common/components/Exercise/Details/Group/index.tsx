import cx from 'classnames'
import DraggableList from 'react-draggable-list'
import React, { FC, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setCurrentPackage } from '~/store/globalState'
import { ShowNoti } from '~/common/utils'
import { examGroupsApi } from '~/api/exam/group'
import DragMenu from '../DragMenu'
import ReactHtmlParser from 'react-html-parser'
import Questions from '../Questions'
import GroupForm from './form-group'
import { QUESTION_TYPES } from '~/common/libs'
import { BsAward, BsFillAwardFill } from 'react-icons/bs'
import { FaAward, FaShapes } from 'react-icons/fa'

type IDragContainer = {
	section: IPackage
	data: Array<IGroup>
	setData?: Function
	onRefresh?: Function
}

interface PlanetProps {
	item: IGroup
	itemSelected: number
	dragHandleProps: object
	commonProps?: any
}

interface PlanetState {
	value: number
}

const groupClass = 'item pl-[25px] rounded-[6px] pt-[5px] max-h-full bg-[#fff] overflow-hidden border-dotted'

class GroupItem extends React.Component<PlanetProps, PlanetState> {
	state = { value: 0 }

	getDragHeight() {
		return 36
	}

	render() {
		const { item, itemSelected, dragHandleProps, commonProps } = this.props

		const scale = itemSelected * 0.005 + 1
		const shadow = itemSelected * 1 + 0
		const dragged = itemSelected !== 0

		return (
			<div className={cx(groupClass, { dragged })} style={{ transform: `scale(${scale})`, borderWidth: shadow }}>
				<div className="dragHandle mt-[9px] ml-2" {...dragHandleProps} />

				<div className="iflex-full sec-header">
					<div className="text-16-600 mt-[2px] flex-1 flex">
						{item.SIndexInExam !== item.EIndexInExam && (
							// Example: Question 1 - 5
							<div>
								Câu {item.SIndexInExam} - {item.EIndexInExam}
							</div>
						)}

						{/* Example: Question 1 */}
						{item.SIndexInExam == item.EIndexInExam && !!item.SIndexInExam && <div>Câu {item.SIndexInExam}</div>}

						{!item.SIndexInExam && !item.EIndexInExam && <div>Chưa có câu hỏi</div>}
					</div>

					<div className={item.SIndexInExam !== item.EIndexInExam ? 'menu !cursor-pointer mr-2' : 'menu !cursor-pointer mr-2 mt-[-3px]'}>
						<DragMenu item={item} isGroup onRefresh={commonProps.onRefresh} questionType={QUESTION_TYPES.MultipleChoice} />
					</div>
				</div>

				{item?.LevelName && (
					<div className="flex items-center mt-[8px]">
						<div className="cc-question-level">
							<FaAward size={14} className="mr-[4px]" />
							<span>{item?.LevelName}</span>
						</div>

						<div className="cc-question-type ml-[8px]">
							<FaShapes size={14} className="mr-[4px]" />
							<span>{item?.TypeName}</span>
						</div>
					</div>
				)}

				{!!item?.Content && <div className="group-content none-selection ml-[4px]">{ReactHtmlParser(item.Content)}</div>}

				<div className="h-[10px]" />

				{item?.Exercises.length > 0 && (
					<div className="ml-[-25px]">
						<Questions data={item} type="edit" />
					</div>
				)}
			</div>
		)
	}
}

const GroupContainer: FC<IDragContainer> = (props) => {
	const { data, section, onRefresh } = props

	let groupRef = useRef()

	const dispatch = useDispatch()

	const sections = useSelector((state: RootState) => state.globalState.currentPackage)

	function _onChangeGroups(newList) {
		// Change index field
		let newIndexList = []
		newList.forEach((item, index) => {
			newIndexList.push({ ...item, Index: index + 1 })
		})

		// Handle groups data
		let cloneSections = []
		sections.forEach((element, index) => {
			if (element.Id !== section.Id) {
				cloneSections.push({ ...element })
			} else {
				cloneSections.push({ ...element, ExerciseGroups: [...newIndexList] })
			}
		})

		dispatch(setCurrentPackage([...cloneSections]))

		const indexTem = []
		newIndexList.forEach((item, index) => {
			indexTem.push({ Id: item.Id, Index: index + 1 })
		})

		putNewList({ Items: indexTem })
	}

	async function putNewList(params) {
		try {
			const response = await examGroupsApi.changeIndex(params)
			if (response.status === 200) {
				!!onRefresh && onRefresh()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	return (
		<div className="ex-de-gr-container">
			<div className="drag-section pb-3">
				<div className="mx-1" ref={groupRef}>
					<DraggableList
						autoScrollMaxSpeed={3000}
						itemKey="Index"
						template={GroupItem}
						list={data}
						commonProps={{ onRefresh: onRefresh }}
						onMoveEnd={(newList) => _onChangeGroups(newList)}
						container={() => groupRef.current!}
					/>
				</div>

				<div className="w-[150px]">
					<GroupForm section={section} onRefresh={onRefresh} />
				</div>
			</div>
		</div>
	)
}

export default GroupContainer
