import { List } from 'antd'
import React, { useState } from 'react'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import { RootState } from '~/store'
import SectionNavigator from './group'
import ModalSubmit from './modal-submit'

const Navigator = () => {
	const sections = useSelector((state: RootState) => state.globalState.currentPackage)

	const listQuestionID = useSelector((state: RootState) => state.testingState.listQuestionID)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const [submitVisible, setSubmitVisible] = useState(false)

	return (
		<>
			<List
				className="px-[16px] py-[16px]"
				pagination={false}
				dataSource={[...sections]}
				renderItem={(sectionItem, index) => (
					<div key={`key-sec-${sectionItem.Id}`} className="inline-flex flex-col w-full">
						<SectionNavigator section={sectionItem} index={index} />
					</div>
				)}
			/>

			<div className="flex-1"></div>

			<div className="cc-right-nav-footer">
				<span className="text-[16px] font-[700] flex-1">
					Câu:
					<span className="ml-2 text-[#26ad60] mr-1">{answered.length}</span>/
					<span className="text-[#000] ml-1">{listQuestionID.length}</span>
				</span>
				<PrimaryButton onClick={() => setSubmitVisible(true)} className="submit-botton" type="button" background="blue">
					<IoPaperPlaneOutline size={18} className="mr-2" /> Nộp bài
				</PrimaryButton>
			</div>

			<ModalSubmit visible={submitVisible} setVisible={setSubmitVisible} />
		</>
	)
}

export default Navigator
