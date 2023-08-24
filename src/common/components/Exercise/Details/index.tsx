import React, { useEffect, useState } from 'react'
import { Card, Divider, Drawer, Empty, Skeleton, Switch } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import { useRouter } from 'next/router'
import { RootState } from '~/store'
import PrimaryButton from '../../Primary/Button'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { ieltsExamApi } from '~/api/IeltsExam'
import { decode, wait } from '~/common/utils/common'
import { ShowNostis, log } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import CreateExamSkill from './ExamSkillNext/exam-skill-form'
import ExamSkillItem from './ExamSkillNext/exam-skill-item'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import ExamSectionItem from './ExamSkillNext/exam-section-item'
import CreateExamSection from './ExamSkillSection/exam-section-form'
import ButtonQuestion from './ButtonQuestion'
import { MdArrowForwardIos, MdSettings } from 'react-icons/md'
import { BsFillGrid3X2GapFill } from 'react-icons/bs'
import htmlParser from '../../HtmlParser'
import { ieltsGroupApi } from '~/api/IeltsExam/ieltsGroup'
import TestingQuestions from '../Testing/Questions'
import ChoiceInputForm from './QuestionsForm/MultipleChoiceForm/Form'
import { setNewCurrentGroup } from '~/store/newExamReducer'
import GroupForm from './Group/form-group'

function ExamDetail() {
	const router = useRouter()
	const dispatch = useDispatch()

	const totalPoint = useSelector((state: RootState) => state.globalState.packageTotalPoint)

	const [examInfo, setExamInfo] = useState(null)
	const [loading, setLoading] = useState(true)
	const [currentSkill, setCurrentSkill] = useState(null)

	const [showSkills, setShowSkills] = useState<boolean>(true)
	const [showSections, setShowSections] = useState<boolean>(true)

	const [currentQuestion, setCurrentQuestion] = useState(null)
	const [showQuestions, setShowQuestions] = useState<boolean>(true)

	useEffect(() => {
		getHeight()

		dispatch(setGlobalBreadcrumbs([{ title: 'Quản lý đề', link: '/exam' }]))

		const handleRouteChange = async (url) => {
			dispatch(setGlobalBreadcrumbs([]))
		}

		// Đăng ký sự kiện lắng nghe sự thay đổi router
		router.events.on('routeChangeStart', handleRouteChange)

		// Hủy đăng ký sự kiện khi component bị unmount để tránh memory leak
		return () => {
			router.events.off('routeChangeStart', handleRouteChange)
		}
	}, [])

	useEffect(() => {
		if (!!router?.query?.exam) {
			getExanInfo()
			getExamSkill()
		}
	}, [router])

	async function getExanInfo() {
		try {
			const res = await ieltsExamApi.getByID(parseInt(decode(router?.query?.exam + '')))
			if (res.status == 200) {
				setExamInfo(res.data.data)

				dispatch(
					setGlobalBreadcrumbs([
						{ title: 'Quản lý đề', link: '/exam' },
						{ title: res.data.data?.Name, link: '' }
					])
				)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [skills, setSkills] = useState([])
	async function getExamSkill() {
		try {
			const res = await ieltsSkillApi.getAll({ pageSize: 99, pageIndex: 1, ieltsExamId: parseInt(decode(router?.query?.exam + '')) })
			if (res.status == 200) {
				setSkills(res.data.data)

				if (!currentSkill) {
					setCurrentSkill(res.data.data[0])
				} else {
					const theIndex = res.data.data.findIndex((skill) => skill?.Id == currentSkill?.Id)
					if (theIndex > -1) {
						setCurrentSkill(res.data.data[0])
					}
				}
			} else {
				setSkills([])
				setCurrentSkill(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [sections, setSections] = useState([])

	const [currentSection, setCurrentSection] = useState(null)

	// const [currentSection, setCurrentSection] = useState(null)

	async function getSections() {
		try {
			const res = await ieltsSectionApi.getAll({ pageSize: 99, pageIndex: 1, ieltsSkillId: currentSkill?.Id })
			if (res.status == 200) {
				setSections(res.data.data)
				if (!currentSection) {
					setCurrentSection(res.data.data[0])
				}
			} else {
				setSections([])
				setCurrentSection(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [questionsInSection, setQuestionsInSection] = useState([])

	async function getQuestions() {
		try {
			const res = await ieltsExamApi.getQuestions({ ieltsSectionId: currentSection?.Id })
			if (res.status == 200) {
				setQuestionsInSection(res.data.data)
			} else {
				setQuestionsInSection([])
				setCurGroup([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			heightChange()
			setLoading(false)
		}
	}

	// console.log('-------------------------------- questionsInSection: ', questionsInSection)

	const [curGroup, setCurGroup] = useState<any>(null)

	async function getQuestionsByGroup() {
		try {
			const res = await ieltsGroupApi.getByID(currentQuestion?.IeltsQuestionGroupId)
			if (res.status == 200) {
				dispatch(setNewCurrentGroup(res.data.data))
				setCurGroup(res.data.data)
			} else {
				setCurGroup(null)
				dispatch(setNewCurrentGroup(null))
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		// console.log('--- currentQuestion: ', currentQuestion)

		if (!!currentQuestion?.IeltsQuestionGroupId) {
			getQuestionsByGroup()
		}
	}, [currentQuestion?.IeltsQuestionGroupId])

	useEffect(() => {
		if (!!currentSkill?.Id) {
			getSections()
		}
	}, [currentSkill])

	useEffect(() => {
		if (!!currentSection?.Id) {
			getQuestions()
		} else {
			setQuestionsInSection([])
		}
	}, [currentSection])

	useEffect(() => {
		if (sections.length > 0) {
			setCurrentSection(sections[0])
		} else {
			setCurrentSection(null)
		}
	}, [sections])

	useEffect(() => {
		if (questionsInSection.length > 0) {
			setCurrentQuestion(questionsInSection[0])
		} else {
			setCurGroup(null)
			dispatch(setNewCurrentGroup(null))
			setCurrentQuestion(null)
		}
	}, [questionsInSection])

	const roleId = useSelector((state: RootState) => state.user.information?.RoleId)

	function showTestButton() {
		if (roleId == 1 || roleId == 2) {
			return true
		} else {
			return false
		}
	}

	const [visiblePreview, setVisiblePreview] = useState(false)

	function toggleQuestions() {
		setShowQuestions(!showQuestions)
	}

	const [showSettings, setShowSetings] = useState<boolean>(false)

	const [mainHeight, setMainHeight] = useState(0)
	const [showMain, setShowMain] = useState<boolean>(true)

	async function heightChange() {
		setMainHeight(300)
		setShowMain(false)
		await wait(50)
		setShowMain(true)
		await wait(50)
		getHeight()
	}

	useEffect(() => {
		heightChange()
	}, [showSections, showSkills, showQuestions])

	function getHeight() {
		const theFica = document.getElementById('the-fica-block')
		if (!!theFica) {
			setMainHeight(theFica.offsetHeight)
		}
	}

	log.Yellow('curGroup', curGroup)

	return (
		<div className="h-[100vh] w-[100%] relative flex flex-col bg-[#f3f3f3]">
			<div className="cc-exam-detail !w-full bg-[#fff]">
				<div className="py-[8px] w-full flex items-center relative">
					<div className="ml-[16px] flex-1 pr-2">
						<div className="cc-text-16-700 in-1-line">{examInfo?.Name}</div>
						<div className="cc-text-14-500-blue">Tổng điểm: {totalPoint}</div>
					</div>

					<div className="mr-[8px] flex-shrink-0">
						{showTestButton() && (
							<PrimaryButton onClick={() => setVisiblePreview(true)} background="blue" type="button">
								<HiOutlineBookOpen size={20} />
								<div className="ml-2 hidden w500:inline">Làm thử</div>
							</PrimaryButton>
						)}
					</div>
					<PrimaryButton onClick={() => setShowSetings(!showSettings)} className="mr-[16px]" type="button" background="yellow">
						<MdSettings size={20} />
					</PrimaryButton>
				</div>

				{(showSkills || showSections) && (
					<div className="mt-[-16px]">
						<Divider className="ant-divider-16" />
					</div>
				)}

				<div className="flex items-center px-[16px]">
					{loading && (
						<div className="flex items-center">
							<Skeleton active paragraph={false} style={{ width: '100px' }} />
							<Skeleton active paragraph={false} style={{ width: '50px', marginLeft: 8, marginRight: 8 }} />
							<Skeleton active paragraph={false} style={{ width: '70px' }} />
						</div>
					)}

					{showSkills && (
						<div className="flex items-center pb-[16px]">
							<CreateExamSkill onRefresh={getExamSkill} />

							{skills.map((sk, index) => {
								return <ExamSkillItem data={sk} currentSkill={currentSkill} setCurrentSkill={setCurrentSkill} onRefresh={getExamSkill} />
							})}
						</div>
					)}
				</div>

				{showSkills && showSections && (
					<div className="mt-[-16px]">
						<Divider className="ant-divider-16" />
					</div>
				)}

				<div className="flex items-center px-[16px] shadow-sm">
					{loading && (
						<div className="flex items-center">
							<Skeleton active paragraph={false} style={{ width: '100px' }} />
							<Skeleton active paragraph={false} style={{ width: '50px', marginLeft: 8, marginRight: 8 }} />
							<Skeleton active paragraph={false} style={{ width: '70px' }} />
						</div>
					)}

					{showSections && (
						<div className="flex items-center pb-[16px]">
							<CreateExamSection
								onRefresh={() => {
									getExamSkill()
									getQuestionsByGroup()
									getQuestions()
								}}
								skill={currentSkill}
							/>

							{sections.map((item, index) => {
								return (
									<ExamSectionItem
										key={`sec-e${index}`}
										data={item}
										currentSection={currentSection}
										setCurrentSection={setCurrentSection}
										onRefresh={getSections}
										createGroupComponent={
											<GroupForm
												section={currentSection}
												onRefresh={() => {
													getQuestionsByGroup()
													getQuestions()
												}}
											/>
										}
									/>
								)
							})}
						</div>
					)}
				</div>

				{!loading && skills.length == 0 && <Empty />}
			</div>

			<div className="flex-1 flex">
				<>
					{showMain && <div id="the-fica-block" className="w-[0.5px] bg-transparent" />}

					<div className="flex-1 p-[16px] scrollable" style={{ height: mainHeight }}>
						{/* <div className="font-[600] mb-[8px]">Bài đọc</div> */}
						{htmlParser(currentSection?.ReadingPassage || '')}
					</div>

					<div className="flex-1 p-[16px] scrollable" style={{ height: mainHeight }}>
						{questionsInSection.length > 0 && (
							<GroupForm
								isEdit
								section={currentSection}
								defaultData={curGroup}
								onRefresh={() => {
									getQuestionsByGroup()
									getQuestions()
								}}
							/>
						)}

						<div className="mb-[16px]">{htmlParser(curGroup?.Content)}</div>

						<TestingQuestions data={curGroup} questions={questionsInSection} />
					</div>
				</>
			</div>

			{showQuestions && (
				<div className="w-full bg-[#fff] py-[8px] flex px-[8px] min-h-[36px] border-t-[1px] border-t-[#ededed]">
					<div className="flex flex-col items-start">
						<div
							onClick={toggleQuestions}
							className="flex items-center mb-[8px] hover:bg-[#F0EEED] px-[4px] rounded-[4px] cursor-pointer no-select"
						>
							<MdArrowForwardIos className="rotate-90 mr-[8px]" />
							<div className="font-[500]">Câu hỏi ({questionsInSection.length})</div>
						</div>

						<div className="flex items-center no-select">
							{questionsInSection.map((item, index) => {
								const activated = currentQuestion?.IeltsQuestionId == item?.IeltsQuestionId
								return (
									<ButtonQuestion key={`quest-num-${index}`} isActivated={activated} data={item} onClick={() => setCurrentQuestion(item)} />
								)
							})}

							{questionsInSection.length == 0 && <div className="text-[red]">Chưa có câu hỏi</div>}
						</div>
					</div>
				</div>
			)}

			{!showQuestions && (
				<div onClick={toggleQuestions} className="cc-23-btn-quests all-center">
					<BsFillGrid3X2GapFill size={20} className="mt-[2px]" />
					<div>Câu hỏi ({questionsInSection.length})</div>
				</div>
			)}

			{!loading && (
				<Drawer
					open={showSettings}
					title="Tuỳ chỉnh"
					width={window?.innerWidth > 350 ? '300' : '90%'}
					onClose={() => setShowSetings(false)}
				>
					<div className="exercise-settings">
						<div className="flex items-center bg-[#F2F2F7] border-[#d4d4da] rounded-[6px] px-[8px] py-[8px]">
							<div className=""></div>
							<div className="flex-1 font-[500]">Hiển thị kỹ năng</div>
							<Switch checked={showSkills} onClick={() => setShowSkills(!showSkills)} />
						</div>

						<div className="flex items-center bg-[#F2F2F7] border-[#d4d4da] rounded-[6px] px-[8px] py-[8px] mt-[8px]">
							<div className=""></div>
							<div className="flex-1 font-[500]">Hiển thị section</div>
							<Switch checked={showSections} onClick={() => setShowSections(!showSections)} />
						</div>

						<div className="flex items-center bg-[#F2F2F7] border-[#d4d4da] rounded-[6px] px-[8px] py-[8px] mt-[8px]">
							<div className=""></div>
							<div className="flex-1 font-[500]">Hiển thị danh sách câu</div>
							<Switch checked={showQuestions} onClick={() => setShowQuestions(!showQuestions)} />
						</div>
					</div>
				</Drawer>
			)}
		</div>
	)
}

export default ExamDetail
