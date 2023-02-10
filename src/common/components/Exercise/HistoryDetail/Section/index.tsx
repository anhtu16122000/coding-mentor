import React, { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import GroupStudentContainer from '../Group'
import { useDispatch } from 'react-redux'
import { domMastersContent } from '~/common/utils/main-function'
import { setCurrentSection } from '~/store/globalState'
import { IoCloseSharp } from 'react-icons/io5'
import { RiFileList2Fill, RiHeadphoneFill } from 'react-icons/ri'

type IDragContainer = {
	data?: Array<IPackage>
	setData?: Function
	onRefresh?: Function
}

const SectionItem = (props) => {
	const { item } = props

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

	function showExplan() {
		return !!item?.Explanations && !currentSection
	}

	return (
		<div id={'section-' + item.Id}>
			<div className="iflex-full">
				<div className="exam-section-name">{item?.Name}</div>
			</div>

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

			{showExplan() && <div className="exam-explan">{item?.Explanations}</div>}
			<GroupStudentContainer data={item.ExerciseResultGroups} />
		</div>
	)
}

const SectionStudentContainer: FC<IDragContainer> = (props) => {
	const sections = useSelector((state: RootState) => state.globalState.currentPackage)

	return (
		<div className="drag-list mt-3 ml-[-25px]">
			<div className="drag-section">
				<div id="scroll-main" key="wrap-section" className="mx-4 px-3 inner-testing scrollable chau-custom-scrollbar !mr-[-5px] !pr-[10px]">
					{sections.map((item, index) => {
						return <SectionItem key={'section' + index} item={item} />
					})}
				</div>
			</div>
		</div>
	)
}

export default SectionStudentContainer
