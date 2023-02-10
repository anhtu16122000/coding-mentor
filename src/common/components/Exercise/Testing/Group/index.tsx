import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import TestingQuestions from '../Questions'
import { QUESTION_TYPES } from '~/common/libs'
import { RiFileList2Fill, RiHeadphoneFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { setCurrentGroup } from '~/store/globalState'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { IoCloseSharp } from 'react-icons/io5'

const GroupItem = (props) => {
	const { item, data, index, isFinal } = props

	const isFinalGroup = isFinal && index == data.length - 1

	function isTrueFalse() {
		return item?.Type == QUESTION_TYPES.TrueOrFalse
	}

	const dispatch = useDispatch()
	const currentGroup = useSelector((state: RootState) => state.globalState.currentGroup)

	function _clickXuka1() {
		if (currentGroup?.Id != item.Id) {
			dispatch(setCurrentGroup(item))
		} else {
			dispatch(setCurrentGroup(null))
		}
	}

	const actived = currentGroup?.Id == item?.Id

	return (
		<div id={'group-' + item.Id} className="mt-3" style={{}}>
			<div className="cc-testing-group-number">
				<div className="exam-group-number">
					{item.SIndexInExam !== item.EIndexInExam && `Câu ${item.SIndexInExam} - ${item.EIndexInExam}`}
				</div>
			</div>

			<div className="exam-controller">
				{!!item?.Content && (
					<div onClick={_clickXuka1} className={`xuka-button xuka-1 ${actived ? 'active' : ''}`}>
						{actived ? <IoCloseSharp size={20} /> : <RiFileList2Fill size={20} />}
						<div className="ex-ctr-text flex-shrink-0">Xem đoạn văn</div>
					</div>
				)}

				<div className="xuka-button xuka-2">
					<RiHeadphoneFill />
					<div className="ex-ctr-text flex-shrink-0">Phát audio</div>
				</div>
			</div>

			<div className={`${item.SIndexInExam == item.EIndexInExam && 'mt-[-35px]'}`}>
				{!!item?.Content && !actived && <div className="group-content none-selection">{ReactHtmlParser(item.Content)}</div>}

				<div className="mt-2">
					<TestingQuestions isFinal={isFinalGroup} data={item} type="edit" />
				</div>
			</div>

			{isTrueFalse() && <div className="w-full h-[1px] bg-[#00000016] hidden w500:block" />}
		</div>
	)
}

const GroupStudentContainer = (props) => {
	const { data, isFinal } = props

	return (
		<div className="mt-3">
			{data.map((item, index) => {
				return <GroupItem key={'group' + index} data={data} isFinal={isFinal} item={item} index={index} />
			})}
		</div>
	)
}

export default GroupStudentContainer
