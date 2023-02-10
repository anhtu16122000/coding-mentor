import React, { FC, useEffect, useState } from 'react'
import { IoCloseSharp, IoPaperPlaneOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import { RootState } from '~/store'
import GroupStudentContainer from '../Group'
import ModalSubmit from '../Navigator/modal-submit'
import { RiFileList2Fill, RiHeadphoneFill } from 'react-icons/ri'
import ReactHtmlParser from 'react-html-parser'
import { useDispatch } from 'react-redux'
import { domMastersContent, viewContent } from '~/common/utils/main-function'
import { setCurrentSection } from '~/store/globalState'

type IDragContainer = {
	data?: Array<IPackage>
	setData?: Function
	onRefresh?: Function
}

const SectionItem = (props) => {
	const { item, index } = props

	const sections = useSelector((state: RootState) => state.globalState.currentPackage)

	const dispatch = useDispatch()
	const currentGroup = useSelector((state: RootState) => state.globalState.currentGroup)
	const currentSection = useSelector((state: RootState) => state.globalState.currentSection)

	useEffect(() => {
		domMastersContent(currentSection, currentGroup)
	}, [currentSection, currentGroup])

	function _clickXuka1() {
		if (currentSection?.Id != item.Id) {
			dispatch(setCurrentSection(item))
		} else {
			dispatch(setCurrentSection(null))
		}
	}

	const actived = currentSection?.Id == item?.Id

	return (
		<div id={'section-' + item.Id}>
			<div className="exam-section-name">{item?.Name}</div>

			<div className="exam-controller">
				{!!item?.Explanations && (
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

			{!!item?.Explanations && !actived && <div className="exam-explan mx-0">{ReactHtmlParser(item?.Explanations)}</div>}

			<GroupStudentContainer isFinal={index == sections.length - 1 ? true : false} section={item} data={item.ExerciseGroups} />
		</div>
	)
}

const SectionStudentContainer: FC<IDragContainer> = (props) => {
	const sections = useSelector((state: RootState) => state.globalState.currentPackage)

	const listQuestionID = useSelector((state: RootState) => state.testingState.listQuestionID)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const [submitVisible, setSubmitVisible] = useState(false)

	return (
		<div className="cc-te-ma-container flex-1">
			<div key="wrap-section" className="cc-te-ma-inner">
				{sections.map((item, index) => {
					return <SectionItem key={'section' + index} item={item} index={index} />
				})}

				<div className="block w800:!hidden">
					<hr className="mx-[-20px] border-[#a2a2a2]" />
					<div className="pb-4 pt-[30px] flex items-center px-3">
						<span className="text-[16px] font-[700] flex-1">
							Hoàn thành:
							<span className="ml-2 text-[#26ad60] mr-1">{answered.length}</span>/
							<span className="text-[#000] ml-1">{listQuestionID.length}</span>
						</span>
						<PrimaryButton onClick={() => setSubmitVisible(true)} type="button" background="blue">
							<IoPaperPlaneOutline size={18} className="mr-2" /> Nộp bài
						</PrimaryButton>
					</div>

					<ModalSubmit visible={submitVisible} setVisible={setSubmitVisible} />
				</div>
			</div>
		</div>
	)
}

export default SectionStudentContainer
