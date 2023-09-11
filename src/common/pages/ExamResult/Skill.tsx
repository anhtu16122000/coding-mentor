import React from 'react'

const colors = ['#FFE4E1', '#B0C4DE', '#D3D3D3', '#E6E6FA', '#F5DEB3', '#ADD8E6', '#FFDAB9', '#FFFACD', '#E0FFFF', '#FFFFE0']

const Skill = (props) => {
	const { data, index } = props

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

						<span className="ml-1 title-exam-correct-question" style={{ zIndex: 99 }}>
							<span style={{ color: '#00CA2C', marginLeft: 8 }}>{data.QuestionsMultipleChoiceCorrect}</span> /{' '}
							<span>{data.QuestionMultipleChoiceAmount}</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Skill
