import { Divider, Skeleton } from 'antd'
import React from 'react'
import ExamSectionItem from '../ExamSkillNext/exam-section-item'
import { MdArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md'
import { FaHeadphonesAlt } from 'react-icons/fa'

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

	const indexOfSkill = !skills ? 0 : skills.findIndex((skill) => skill?.Id == currentSkill?.Id)

	function handleChangeSkill(param) {
		if (param == 'up') {
			setCurrentSkill(skills[indexOfSkill + 1])
		}
		if (param == 'down') {
			setCurrentSkill(skills[indexOfSkill - 1])
		}
		setCurAudio('')
	}

	return (
		<>
			{(showSkills || showSections) && (
				<div className="mt-[-16px]">
					<Divider className="ant-divider-16" />
				</div>
			)}

			<div className="exam-23-skills">
				<SkillLoading loading={loading} />

				{!!skills && showSkills && (
					<div className="flex items-center pb-[16px] scroll-h w-full">
						<div className="flex-1 flex flex-col">
							<div>
								<div className="tae-skill-name">Skill: {!skills ? '' : skills[indexOfSkill]?.Name}</div>
								<div className="mt-[4px] flex items-center">
									{skills[indexOfSkill]?.Audio && (
										<div onClick={(e) => setCurAudio(skills[indexOfSkill])} className="ex-23-btn-play-audio">
											<FaHeadphonesAlt size={14} className="text-[#fff] mr-[4px]" />
											<div className="play-audio-text">Play audio</div>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="flex-1 flex justify-end">
							{!!skills[indexOfSkill - 1] && (
								<div onClick={() => handleChangeSkill('down')} className="ex-23-btn-change-skill">
									<MdArrowBackIos size={18} />
									<div className="ml-[4px]">{skills[indexOfSkill - 1]?.Name}</div>
								</div>
							)}

							{!!skills[indexOfSkill + 1] && (
								<div onClick={() => handleChangeSkill('up')} className="ex-23-btn-change-skill">
									<div className="mr-[4px]">{skills[indexOfSkill + 1]?.Name}</div>
									<MdOutlineArrowForwardIos size={18} />
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{!!skills && skills.length != 0 && !!currentSkill?.Id && (
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
