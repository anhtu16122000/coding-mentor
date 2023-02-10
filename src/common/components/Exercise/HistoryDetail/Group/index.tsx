import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import ResultQuestion from '../Questions'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setCurrentGroup } from '~/store/globalState'
import { IoCloseSharp } from 'react-icons/io5'
import { RiFileList2Fill, RiHeadphoneFill } from 'react-icons/ri'

const GroupItem = (props) => {
	const { item } = props

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

	function showContent() {
		return !!item?.Content && !currentGroup
	}

	return (
		<div id={'group-' + item.Id} className="mt-3">
			<div className="iflex-full sec-header">
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
				{showContent() && <div className="group-content none-selection">{ReactHtmlParser(item.Content)}</div>}

				<div className="mt-[16px]">
					<ResultQuestion data={item} />
				</div>
			</div>
		</div>
	)
}

const GroupStudentContainer = (props) => {
	const { data } = props

	return (
		<div className="mt-3">
			{data.map((item, index) => {
				return <GroupItem key={'group-' + index} item={item} />
			})}
		</div>
	)
}

export default GroupStudentContainer
