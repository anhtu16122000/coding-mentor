import { Divider, Skeleton } from 'antd'
import React from 'react'
import CreateExamSkill from '../ExamSkillNext/exam-skill-form'
import ExamSkillItem from '../ExamSkillNext/exam-skill-item'
import ExamSectionItem from '../ExamSkillNext/exam-section-item'
import { MdArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md'
import { FaHeadphonesAlt } from 'react-icons/fa'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'

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

	const indexOfSkill = skills.findIndex((skill) => skill?.Id == currentSkill?.Id)

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
					<div className="flex items-center pb-[16px] scroll-h w-full">
						<div className="flex-1 flex justify-start">
							{!!skills[indexOfSkill - 1] && (
								<div
									onClick={() => {
										setCurrentSkill(skills[indexOfSkill - 1])
										setCurAudio('')
									}}
									className="cc-23-skill text-[#fff] bg-[#1b73e8] hover:bg-[#1867cf] flex items-center"
								>
									<MdArrowBackIos size={18} />
									<div className="ml-[4px]">{skills[indexOfSkill - 1]?.Name}</div>
								</div>
							)}
						</div>

						<div className="flex-1 all-center font-[600] text-[18px]">
							<div>Kỹ năng: {skills[indexOfSkill]?.Name}</div>

							{skills[indexOfSkill]?.Audio && (
								<div
									onClick={(e) => {
										e.stopPropagation()
										setCurAudio(skills[indexOfSkill])
									}}
								>
									<PrimaryTooltip place="right" id={`au-sk-${indexOfSkill}`} content="Phát âm thanh">
										<div
											className={`w-[24px] h-[24px] cursor-pointer flex-shrink-0 all-center shadow-sm rounded-full ml-[8px] bg-[#0A89FF]`}
										>
											<FaHeadphonesAlt size={14} className="text-[#fff]" />
										</div>
									</PrimaryTooltip>
								</div>
							)}
						</div>

						<div className="flex-1 flex justify-end">
							{!!skills[indexOfSkill + 1] && (
								<div
									onClick={() => {
										setCurrentSkill(skills[indexOfSkill + 1])
										setCurAudio('')
									}}
									className="cc-23-skill text-[#fff] bg-[#1b73e8] hover:bg-[#1867cf] flex items-center"
								>
									<div className="mr-[4px]">{skills[indexOfSkill + 1]?.Name}</div>
									<MdOutlineArrowForwardIos size={18} />
								</div>
							)}
						</div>
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
											hideController
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
