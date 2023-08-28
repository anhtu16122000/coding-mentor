import { Divider, Skeleton } from 'antd'
import React from 'react'
import CreateExamSkill from '../ExamSkillNext/exam-skill-form'
import ExamSkillItem from '../ExamSkillNext/exam-skill-item'
import ExamSectionItem from '../ExamGroup/exam-section-item'

function SkillLoading({ loading }) {
	if (loading) {
		return (
			<div className="flex items-center">
				<Skeleton active paragraph={false} style={{ width: '100px' }} />
				<Skeleton active paragraph={false} style={{ width: '50px', marginLeft: 8, marginRight: 8 }} />
				<Skeleton active paragraph={false} style={{ width: '70px' }} />
			</div>
		)
	}
	return <></>
}

const TakeAnExamController = (props) => {
	const { showSkills, showSections, loading, skills, setCurAudio, currentSkill, setCurrentSkill, onRefreshSkill, sections } = props

	const { currentSection, setCurrentSection, getSections } = props

	return (
		<>
			{(showSkills || showSections) && (
				<div className="mt-[-16px]">
					<Divider className="ant-divider-16" />
				</div>
			)}

			<div className="exam-23-skills">
				<SkillLoading loading={loading} />

				{showSkills && (
					<div className="flex items-center pb-[16px] scroll-h">
						{skills.map((sk, index) => {
							return (
								<ExamSkillItem
									onPlayAudio={(e) => setCurAudio(e || '')}
									data={sk}
									currentSkill={currentSkill}
									setCurrentSkill={setCurrentSkill}
									onRefresh={onRefreshSkill}
									hideController
								/>
							)
						})}
					</div>
				)}
			</div>

			{skills.length != 0 && !!currentSkill?.Id && (
				<>
					{showSkills && showSections && (
						<div className="mt-[-16px]">
							<Divider className="ant-divider-16" />
						</div>
					)}

					<div className="exam-23-sections">
						<SkillLoading loading={loading} />

						{showSections && !!currentSkill && (
							<div className="flex items-center pb-[16px] scroll-h">
								{sections.map((item, index) => {
									return (
										<ExamSectionItem
											key={`sec-e${index}`}
											index={index}
											data={item}
											currentSection={currentSection}
											setCurrentSection={setCurrentSection}
											onRefresh={getSections}
											onPlayAudio={(e) => setCurAudio(e || '')}
											createGroupComponent={<></>}
										/>
									)
								})}
							</div>
						)}
					</div>
				</>
			)}
		</>
	)
}

export default TakeAnExamController
