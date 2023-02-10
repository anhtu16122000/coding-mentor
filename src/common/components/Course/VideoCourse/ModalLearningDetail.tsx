import React, { useMemo, useState } from 'react'
import { Modal, Collapse } from 'antd'
import { VscPlayCircle } from 'react-icons/vsc'
import { ShowNoti } from '~/common/utils'

const ModalLearningDetail = (props) => {
	const { detailSections } = props
	const [isModalVisible, setIsModalVisible] = useState(false)

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}
	useMemo(() => {
		if (detailSections) {
			if (Object.keys(detailSections).length > 0) {
				showModal()
			} else {
				ShowNoti('error', 'Học viên chưa học bài nào')
			}
		}
	}, [detailSections])
	return (
		<Modal
			title={
				<span>
					Học viên: <span className="font-bold text-[#ab1d38]">{detailSections && detailSections.FullName}</span>
				</span>
			}
			visible={isModalVisible}
			onCancel={handleCancel}
			width={800}
			footer={null}
		>
			<div className="antd-custom-wrap">
				<h2 className="text-center font-semibold mb-3">Danh sách bài học đã học</h2>
				<Collapse defaultActiveKey={['0']} expandIconPosition={'end'}>
					{detailSections &&
						Object.keys(detailSections).length > 0 &&
						detailSections.Section.map((section, index) => {
							return (
								<Collapse.Panel
									header={
										<div className="flex mt-2">
											<span className="ml-2 font-bold text-tw-primary in-1-line">{section.SectionName}</span>
										</div>
									}
									key={index}
								>
									{section.LessonVideo.map((lesson) => {
										return (
											<div className="flex py-3">
												<span className="my-auto mr-2">
													<VscPlayCircle size={22} />
												</span>
												<span className="my-auto select-none line-clamp-1" key={lesson.LessonVideoId}>
													{lesson.LessonVideoName}
												</span>
											</div>
										)
									})}
								</Collapse.Panel>
							)
						})}
				</Collapse>
			</div>
		</Modal>
	)
}

export default ModalLearningDetail
