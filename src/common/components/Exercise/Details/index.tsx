import React, { useEffect, useState } from 'react'
import { Divider, Drawer, Empty, Modal, Skeleton, Switch } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import { useRouter } from 'next/router'
import { RootState } from '~/store'
import PrimaryButton from '../../Primary/Button'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { ieltsExamApi } from '~/api/IeltsExam'
import { decode, userIs, wait } from '~/common/utils/common'
import { ShowNostis, ShowNoti, log } from '~/common/utils'
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
import { setNewCurrentGroup } from '~/store/newExamReducer'
import GroupForm from './Group/form-group'
import ExamProvider, { useExamContext } from '../../../providers/Exam'
import { QUESTION_TYPES } from '~/common/libs'
import DragHeader from './Components/drag-header'
import GroupContent from './Components/group-content'
import CurrentGroupController from './Components/current-group-controller'
import PrimaryTooltip from '../../PrimaryTooltip'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import MainAudioPlayer from './AudioPlayer'
import { FaSort } from 'react-icons/fa'
import { RiSave2Fill } from 'react-icons/ri'

import Lottie from 'react-lottie-player'
import lottieFile from '~/common/components/json/animation_lludr9cs.json'
import DrawerSettings from '../Components/DrawerSettings'
import ModalBlocked from '../Components/ModalBlocked'
import ExamDetailFooter from './ExamGroup/ExamDetailFooter'
import { handleClickQuest } from './TakeAnExam/utils'

function ExamDetail() {
	const router = useRouter()
	const dispatch = useDispatch()

	const {
		curAudio,
		setCurAudio,
		loading,
		setLoading,
		getAllQuestions,
		questionsInSection,
		setQuestionsInSection,
		notSetCurrentQuest,
		setNotSetCurrentQuest,
		currentQuestion,
		setCurrentQuestion
	} = useExamContext()

	const user = useSelector((state: RootState) => state.user.information)

	const [examInfo, setExamInfo] = useState(null)
	// const [loading, setLoading] = useState(true)
	const [currentSkill, setCurrentSkill] = useState(null)

	const [showSkills, setShowSkills] = useState<boolean>(true)
	const [showSections, setShowSections] = useState<boolean>(true)

	// const [currentQuestion, setCurrentQuestion] = useState(null)
	const [showQuestions, setShowQuestions] = useState<boolean>(true)

	const [blocked, setBlocked] = useState('')
	const [showOver, setShowOver] = useState<boolean>(true)

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
		if (!!router?.query?.exam && !!user) {
			if (user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 2) {
				getExamInfo()
				getExamSkill()
			} else {
				setBlocked('Không có quyền truy cập')
			}
		}
	}, [router, user])

	async function getExamInfo() {
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
					if (theIndex == -1) {
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

	async function getSections(e?: any, oldIndex?: number) {
		try {
			const res = await ieltsSectionApi.getAll({ pageSize: 99, pageIndex: 1, ieltsSkillId: currentSkill?.Id })
			if (res.status == 200) {
				setSections(res.data.data)

				if (!currentSection || currentSkill?.Id != currentSection?.IeltsSkillId) {
					setCurrentSection(res.data.data[0])
				}

				if (!!e?.Id) {
					const theIndex = res.data.data.findIndex((sec) => sec?.Id == e?.Id)
					if (theIndex > -1) {
						setCurrentSection(res.data.data[theIndex])
					} else {
						// Trường hợp này là mới xoá item e xong
						if (currentSection?.Id == e?.Id) {
							if (oldIndex > 0) {
								setCurrentSection(res.data.data[oldIndex - 1])
							} else {
								setCurrentSection(res.data.data[0])
							}
						}
					}
				}
			} else {
				setGetingGroup(false)
				setSections([])
				setCurrentSection(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	// const [questionsInSection, setQuestionsInSection] = useState([])

	async function getQuestions() {
		getAllQuestions(currentSection, setCurGroup)
	}

	const [getingGroup, setGetingGroup] = useState<boolean>(false)
	const [curGroup, setCurGroup] = useState<any>(null)

	async function getQuestionsByGroup() {
		if (currentQuestion?.IeltsQuestionGroupId) {
			setGetingGroup(true)
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
				setGetingGroup(false)
				setLoading(false)
			}
		}
	}

	useEffect(() => {
		if (!!currentQuestion?.IeltsQuestionGroupId) {
			getQuestionsByGroup()
		}
	}, [currentQuestion?.IeltsQuestionGroupId])

	useEffect(() => {
		if (!!currentQuestion) {
			handleClickQuest(currentQuestion, setCurrentQuestion)
		}
	}, [currentQuestion])

	useEffect(() => {
		setCurGroup(null)

		if (!!currentSkill?.Id) {
			getSections()
			heightChange()
		}

		setCurAudio(null)
	}, [currentSkill])

	useEffect(() => {
		if (!!currentSection?.Id) {
			getQuestions()
		} else {
			// setQuestionsInSection([])
		}
	}, [currentSection])

	useEffect(() => {
		if (sections.length == 0) {
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

	function toggleQuestions() {
		setShowQuestions(!showQuestions)
	}

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
	}, [showSections, showSkills, showQuestions, questionsInSection])

	function getHeight() {
		const theFica = document.getElementById('the-fica-block')
		if (!!theFica) {
			setMainHeight(theFica.offsetHeight)
		}
	}

	useEffect(() => {
		log.Yellow('curGroup', curGroup)
		magicByChaos()
	}, [curGroup])

	function getQuestIndex(Id) {
		const theIndex = questionsInSection.findIndex((question) => question?.IeltsQuestionId == Id)

		if (theIndex !== -1) {
			return questionsInSection[theIndex]
		}

		return ''
	}

	function getRealID(Id) {
		const theIndex = curGroup?.IeltsQuestions.findIndex((question) => question?.InputId == Id)

		if (theIndex !== -1) {
			return curGroup?.IeltsQuestions[theIndex]?.Id
		}

		return ''
	}

	const [dragAns, setDragAns] = useState([])

	function formatInput() {
		const inputs: any = document.getElementsByClassName('b-in')
		const temp = [...inputs]

		if (temp.length > 0) {
			for (let i = 0; i < temp.length; i++) {
				const element = temp[i]
				const id = element.getAttribute('id')
				temp[i].setAttribute('placeholder', `(${getQuestIndex(getRealID(id)).Index})`)
			}
		}

		if (is.drag) {
			let tamp = []
			let count = 1

			for (let i = 0; i < curGroup?.IeltsQuestions.length; i++) {
				const element = curGroup?.IeltsQuestions[i]
				for (let j = 0; j < element?.IeltsAnswers.length; j++) {
					const ans = element?.IeltsAnswers[j]
					tamp.push({ ...ans, Question: { ...element } })
					count++
				}
			}

			setDragAns(tamp)
		}

		if (!is.drag) {
			setDragAns([])
		}
	}

	useEffect(() => {
		formatInput()
	}, [curGroup])

	const is = {
		typing: curGroup?.Type == QUESTION_TYPES.FillInTheBlank,
		drag: curGroup?.Type == QUESTION_TYPES.DragDrop
	}

	const [showAudioControl, setShowAudioControl] = useState<boolean>(false)
	// const [curAudio, setCurAudio] = useState(null)

	useEffect(() => {
		if (curAudio?.Audio) {
			ShowNostis.success(`Playing: ${curAudio?.Name}`)
		}
	}, [curAudio])

	const [creatingTest, setCreatingTest] = useState<boolean>(false)

	function gotoTest(params) {
		if (params?.Id) {
			window.open(`/take-an-exam/?exam=${params?.Id}`, '_blank')
		}
	}

	async function createDoingTest() {
		setCreatingTest(true)
		try {
			const res = await doingTestApi.post({ IeltsExamId: parseInt(decode(router?.query?.exam + '')), ValueId: 0, Type: 1 })
			if (res?.status == 200) {
				gotoTest(res.data?.data)
			}
		} catch (error) {
		} finally {
			setCreatingTest(false)
		}
	}

	const [sortSkill, setSortSkill] = useState<boolean>(false)

	function moveItemUpOnePosition(arr, item) {
		const index = arr.indexOf(item)

		if (index !== -1 && index !== 0) {
			// Sử dụng destructuring để hoán đổi phần tử và phần tử trước nó
			;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
		}

		setSkills([...arr])
	}

	function moveItemDownOnePosition(arr, item) {
		const index = arr.indexOf(item)

		if (index !== -1 && index !== arr.length - 1) {
			// Sử dụng destructuring để hoán đổi phần tử và phần tử trước nó
			;[arr[index + 1], arr[index]] = [arr[index], arr[index + 1]]
		}

		setSkills([...arr])
	}

	async function saveNewSkillsPosition() {
		// CÁI SAVE NÀY API CHƯA LƯU --> GET LẠI NÓ RA CÁI CŨ
		let temp = []

		for (let i = 0; i < skills.length; i++) {
			temp.push({ Id: skills[i]?.Id, Index: i + 1 })
		}

		try {
			const res = await ieltsSkillApi.saveIndex({ Items: temp })
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	const [showRead, setShowRead] = useState<boolean>(false)

	async function magicByChaos() {
		setShowOver(false)
		await wait(100)
		setShowOver(true)
		await wait(100)

		// console.log('-- currentQuestion: ', currentQuestion)

		handleClickQuest(currentQuestion, setCurrentQuestion)
	}

	return (
		<div className="exam-23-container">
			{getingGroup && (
				<div className="bg-[rgba(0,0,0,0.1)] z-[9999] all-center rounded-[6px] absolute top-0 left-0 w-full h-full">
					<div className="text-[#000] font-[500]">Đang xử lý...</div>
				</div>
			)}

			<div className="cc-exam-detail z-10 !w-full bg-[#fff]">
				<div className="exam-23-header">
					<PrimaryTooltip id="fucking-home" content="Trang chủ" place="right">
						<a href="/">
							<div className="pl-[16px] hidden w600:block">
								<img src="/shot-logo.png" className="w-auto h-[46px]" />
							</div>
							<div className="pl-[16px] block w600:hidden">
								<img src="/mini-logo.png" className="w-auto h-[36px]" />
							</div>
						</a>
					</PrimaryTooltip>

					{!loading && (
						<div className="ml-[16px] flex-1 pr-2">
							<div className="cc-text-16-700 in-1-line">{examInfo?.Name}</div>
							<div className="cc-text-14-500-blue flex items-center mt-[2px]">
								<div className="all-center inline-flex cc-choice-point !ml-0">{examInfo?.QuestionsAmount} câu</div>
								<div className="cc-choice-correct-number">{examInfo?.Point} điểm</div>
							</div>
						</div>
					)}

					<div className="mr-[8px] flex-shrink-0">
						{!loading && showTestButton() && (
							<PrimaryButton loading={creatingTest} onClick={createDoingTest} background="blue" type="button">
								{!creatingTest && <HiOutlineBookOpen size={20} />}
								<div className="ml-2 hidden w500:inline">Làm thử</div>
							</PrimaryButton>
						)}
					</div>

					{!loading && (
						<DrawerSettings
							showSkills={showSkills}
							showSections={showSections}
							showQuestions={showQuestions}
							setShowSkills={setShowSkills}
							setShowQuestions={setShowQuestions}
							setShowSections={setShowSections}
						/>
					)}
				</div>

				{(showSkills || showSections) && (
					<div className="mt-[-16px]">
						<Divider className="ant-divider-16" />
					</div>
				)}

				<div className="exam-23-skills">
					{loading && (
						<div className="flex items-center">
							<Skeleton active paragraph={false} style={{ width: '100px' }} />
							<Skeleton active paragraph={false} style={{ width: '50px', marginLeft: 8, marginRight: 8 }} />
							<Skeleton active paragraph={false} style={{ width: '70px' }} />
						</div>
					)}

					{showSkills && (
						<div className="flex items-center pb-[16px] scroll-h">
							{!loading && <CreateExamSkill onRefresh={getExamSkill} />}

							{!loading && skills.length > 1 && (
								<>
									{(userIs(user).admin || userIs(user).manager) && !sortSkill && (
										<div
											onClick={() => setSortSkill(true)}
											className={`cc-23-skill bg-[#FFBA0A] hover:bg-[#e7ab11] focus:bg-[#d19b10] text-[#000]`}
										>
											<FaSort size={16} className="ml-[-2px]" />
											<div className="ml-[4px]">Sắp xếp</div>
										</div>
									)}

									{sortSkill && (
										<div
											onClick={() => {
												saveNewSkillsPosition()
												setSortSkill(false)
											}}
											className={`cc-23-skill bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] text-[#fff]`}
										>
											<RiSave2Fill size={16} className="ml-[-2px]" />
											<div className="ml-[4px]">Lưu</div>
										</div>
									)}
								</>
							)}

							{skills.map((sk, index) => {
								return (
									<ExamSkillItem
										index={index}
										allSkills={skills}
										onUp={() => moveItemUpOnePosition(skills, sk)}
										onDown={() => moveItemDownOnePosition(skills, sk)}
										onPlayAudio={(e) => setCurAudio(e || '')}
										data={sk}
										showSort={sortSkill}
										currentSkill={currentSkill}
										setCurrentSkill={setCurrentSkill}
										onRefresh={getExamSkill}
									/>
								)
							})}
						</div>
					)}
				</div>

				{showSkills && !!currentSkill && showSections && (
					<div className="mt-[-16px]">
						<Divider className="ant-divider-16" />
					</div>
				)}

				<div className="exam-23-sections">
					{loading && (
						<div className="flex items-center">
							<Skeleton active paragraph={false} style={{ width: '100px' }} />
							<Skeleton active paragraph={false} style={{ width: '50px', marginLeft: 8, marginRight: 8 }} />
							<Skeleton active paragraph={false} style={{ width: '70px' }} />
						</div>
					)}

					{showSections && !!currentSkill && (
						<div className="flex items-center pb-[16px] scroll-h">
							<CreateExamSection onRefresh={(e) => getSections(e || null)} skill={currentSkill} />

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
			</div>

			<div className="flex-1 flex relative">
				<MainAudioPlayer
					showAudioControl={showAudioControl}
					setShowAudioControl={setShowAudioControl}
					curSection={currentSection}
					curSkill={currentSkill}
				/>

				<>
					{showMain && <div id="the-fica-block" className="w-[0.5px] bg-transparent" />}

					{!!currentSection?.ReadingPassage && showRead && (
						<div className="flex-1 p-[16px] bg-[#fff] scrollable block w750:hidden" style={{ height: mainHeight }}>
							{showRead && (
								<div className="flex justify-start">
									<div
										onClick={() => setShowRead(false)}
										className="block w750:hidden mb-[16px] bg-[#0A89FF] px-[8px] text-[#fff] rounded-[4px] font-[600] py-[4px]"
									>
										Xem câu hỏi
									</div>
								</div>
							)}

							{htmlParser(currentSection?.ReadingPassage || '')}
						</div>
					)}

					{!!currentSection?.ReadingPassage && (
						<div className="flex-1 p-[16px] bg-[#fff] scrollable hidden w750:block" style={{ height: mainHeight }}>
							{htmlParser(currentSection?.ReadingPassage || '')}
						</div>
					)}

					{/* ----------------------------------------------------------------------------------- */}

					{/* RIGHT OF SCREEN */}
					{showOver && (
						<>
							{!showRead && (
								<div className="flex-1 p-[16px] scrollable max-w-[1200px] mx-auto block w750:hidden" style={{ height: mainHeight }}>
									{(userIs(user).admin || userIs(user).manager) && questionsInSection.length > 0 && (
										<CurrentGroupController
											key={`gr-ctr-${curGroup?.Id}`}
											currentSection={currentSection}
											curGroup={curGroup}
											getQuestions={getQuestions}
											onRefresh={() => {
												getQuestionsByGroup()
												getQuestions()
											}}
										/>
									)}

									{!!window && window?.innerWidth < 750 && <>{is.drag && <DragHeader answers={dragAns} />}</>}

									{!showRead && !!currentSection?.ReadingPassage && (
										<div className="flex justify-start">
											<div
												onClick={() => setShowRead(true)}
												className="block w750:hidden mb-[16px] bg-[#0A89FF] px-[8px] text-[#fff] rounded-[4px] font-[600] py-[4px]"
											>
												Xem bài đọc
											</div>
										</div>
									)}

									{!!window && window?.innerWidth < 750 && <GroupContent is={is} curGroup={curGroup} />}

									{!!window && window?.innerWidth < 750 && <TestingQuestions setCurrentQuestion={setCurrentQuestion} data={curGroup} />}

									{curAudio?.Audio && <div className="h-[200px]" />}
									<div className="h-[100px]" />
								</div>
							)}
						</>
					)}

					{/* RIGHT OF SCREEN */}
					<div id="scroll-tag" className="exam-detail-right" style={{ height: mainHeight }}>
						<div id={`cauhoi-0-2`} />

						{(userIs(user).admin || userIs(user).manager) && questionsInSection.length > 0 && (
							<CurrentGroupController
								key={`gr-ctr-${curGroup?.Id}`}
								currentSection={currentSection}
								curGroup={curGroup}
								getQuestions={getQuestions}
								onRefresh={() => {
									getQuestionsByGroup()
									getQuestions()
								}}
							/>
						)}

						{is.drag && <DragHeader answers={dragAns} />}

						<GroupContent is={is} curGroup={curGroup} />

						<TestingQuestions data={curGroup} />

						{curAudio?.Audio && <div className="h-[200px]" />}

						<div className="h-[100px]" />
					</div>
				</>
			</div>

			{showQuestions && (
				<ExamDetailFooter
					key="exam-detail-footer"
					currentQuestion={currentQuestion}
					setCurrentQuestion={setCurrentQuestion}
					toggleQuestions={toggleQuestions}
					onClickQuest={(e) => handleClickQuest(e, setCurrentQuestion)}
				/>
			)}

			{!showQuestions && (
				<div onClick={toggleQuestions} className="cc-23-btn-quests all-center">
					<BsFillGrid3X2GapFill size={20} className="mt-[2px]" />
					<div>Câu hỏi ({questionsInSection.length})</div>
				</div>
			)}

			<ModalBlocked content={blocked} />
		</div>
	)
}

export default ExamDetail
