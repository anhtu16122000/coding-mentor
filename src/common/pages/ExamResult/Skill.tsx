import { Modal, Spin } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineEye } from 'react-icons/ai'
// import { renewExerciseApi } from '~/apiBase/renew-exercise'
// import TAEResult from '../Questions/WrapQuestion'
import HtmlParser from 'react-html-parser'
import { MdArrowForwardIos } from 'react-icons/md'

const colors = ['#FFE4E1', '#B0C4DE', '#D3D3D3', '#E6E6FA', '#F5DEB3', '#ADD8E6', '#FFDAB9', '#FFFACD', '#E0FFFF', '#FFFFE0']

const Skill = (props) => {
	const { data, index } = props

	const router = useRouter()

	const [loading, setLoading] = useState<boolean>(false)
	const [result, setResult] = useState<any>(null)

	async function onRefresh() {
		setLoading(true)
		try {
			// const res = await renewExerciseApi.getSectionDetail({
			// 	setPackageResultId: router.query?.slug,
			// 	examTopicSectionId: data?.ExamTopicSectionId
			// })
			// if (res.status == 200) {
			// 	setResult(res.data.data)
			// }
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	const [vis, setCurSkill] = useState<any>(null)

	const [visible, setVisible] = useState<boolean>(false)

	function toggle() {
		setVisible(!visible)
	}

	console.log('----- SKILL DATA: ', data)

	return (
		<div className="new-section">
			<div className="section-title">
				<div className="title">{data?.Name}</div>
				<div className="vir-h"></div>

				<div className="text-[#000]">Số câu tự luận: {data?.QuestionEssayAmount}</div>
				<div className="text-[#000]">Số câu trắc nghiệm: {data?.QuestionMultipleChoiceAmount}</div>

				<div className="mt-3" style={{ fontWeight: 500, color: '#004aad' }}>
					Thông tin trắc nghiệm
				</div>

				<div className="w-full" style={{ display: 'flex', marginTop: 8 }}>
					<div style={{ background: colors[index], width: 16, borderRadius: 6, height: '100%', minHeight: 36, marginRight: 8 }} />

					<div className="exam-section-item w-100" style={{ borderColor: colors[index], position: 'relative' }}>
						<div
							style={{
								top: 0,
								left: 0,
								position: 'absolute',
								background: colors[index],
								height: '100%',
								borderTopLeftRadius: 6,
								borderBottomLeftRadius: 6,
								width: `${data?.MultipleChoiceCorrectPercent}%`
							}}
						/>

						<span className="exam-section-item-title">Tỉ lệ đúng: {data?.MultipleChoiceCorrectPercent}%</span>

						<>
							<span className="ml-1 title-exam-correct-question" style={{ zIndex: 99 }}>
								<span style={{ color: '#00CA2C', marginLeft: 8 }}>{data.QuestionsMultipleChoiceCorrect}</span> /{' '}
								<span>{data.QuestionMultipleChoiceAmount}</span>
							</span>
						</>
					</div>
				</div>

				{/* <div onClick={toggle} className="btn btn-primary btn-view-detail">
					{!loading ? <AiOutlineEye size={20} /> : <Spin className="loading-base" style={{ marginBottom: -2, marginLeft: 0 }} />}
					<div>Xem chi tiết</div>
				</div> */}
			</div>

			<Modal footer={null} onCancel={toggle} width={500} open={visible} centered title={`Kỹ năng: ${data?.Name}`}>
				<div className="grid grid-cols-1 gap-[16px]">
					{data?.IeltsSectionResultOverviews.map((resultSection) => {
						return (
							<div className="bg-[#eeeeee] hover:bg-[#e6e6e6] active:bg-[#eeeeee] flex items-center cursor-pointer col-span-1 py-[16px] px-[16px] rounded-[8px]">
								<div className="flex-1 font-[600]">{resultSection?.Name}</div>
								<MdArrowForwardIos size={18} />
							</div>
						)
					})}
				</div>
			</Modal>
		</div>
	)
}

export default Skill
