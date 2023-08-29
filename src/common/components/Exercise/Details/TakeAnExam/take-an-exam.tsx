import React, { useEffect, useState } from 'react'
import { Card, Divider, Drawer, Empty, Modal, Popconfirm, Skeleton, Switch } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import Router, { useRouter } from 'next/router'
import { RootState } from '~/store'
import PrimaryButton from '../../../Primary/Button'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { ieltsExamApi } from '~/api/IeltsExam'
import { decode, wait } from '~/common/utils/common'
import { ShowNostis, log } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import CreateExamSkill from '../ExamSkillNext/exam-skill-form'
import ExamSkillItem from '../ExamSkillNext/exam-skill-item'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import ExamSectionItem from '../ExamSkillNext/exam-section-item'
import CreateExamSection from '../ExamSkillSection/exam-section-form'
import ButtonQuestion from '../ButtonQuestion'
import { MdArrowForwardIos, MdSettings } from 'react-icons/md'
import { BsFillGrid3X2GapFill } from 'react-icons/bs'
import htmlParser from '../../../HtmlParser'
import { ieltsGroupApi } from '~/api/IeltsExam/ieltsGroup'
import TestingQuestions from '../../Testing/Questions'
import ChoiceInputForm from '../QuestionsForm/MultipleChoiceForm/Form'
import { setNewCurrentGroup } from '~/store/newExamReducer'
import GroupForm from '../Group/form-group'
import ExamProvider from '../../../Auth/Provider/exam'
import { QUESTION_TYPES } from '~/common/libs'
import DragHeader from '../Components/drag-header'
import GroupContent from '../Components/group-content'
import { IoClose, IoCloseSharp } from 'react-icons/io5'
import CurrentGroupController from '../Components/current-group-controller'

import { AiFillControl } from 'react-icons/ai'
import { VscSettings } from 'react-icons/vsc'
import PrimaryTooltip from '../../../PrimaryTooltip'
import { doingTestApi } from '~/api/IeltsExam/doing-test'

import Lottie from 'react-lottie-player'
import lottieFile from '~/common/components/json/animation_lludr9cs.json'
import timer from '~/common/components/json/131525-timer.json'
import CountdownTimer from '../Countdown'
import { setSuperOverview } from '~/store/take-an-exam'
import TakeAnExamHeader from './Header'
import TakeAnExamController from './Controller'
import AudioPlayer from '../AudioPlayer'
import MainAudioPlayer from '../AudioPlayer'

function TakeAnExamDetail() {
	const router = useRouter()
	const dispatch = useDispatch()

	const user = useSelector((state: RootState) => state.user.information)

	// const totalPoint = useSelector((state: RootState) => state.globalState.packageTotalPoint)

	const [testInfo, setTestInfo] = useState(null)
	const [loading, setLoading] = useState(true)
	const [currentSkill, setCurrentSkill] = useState(null)

	const [showSkills, setShowSkills] = useState<boolean>(true)
	const [showSections, setShowSections] = useState<boolean>(true)

	const [currentQuestion, setCurrentQuestion] = useState(null)
	const [showQuestions, setShowQuestions] = useState<boolean>(true)

	const [blocked, setBlocked] = useState('')

	useEffect(() => {
		getHeight()

		dispatch(setGlobalBreadcrumbs([{ title: 'Làm bài tập', link: '/exam' }]))

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
			getInfo()
		}
	}, [router, user])

	// GET thông tin của cái bài này
	async function getInfo() {
		try {
			const res = await doingTestApi.getByID(parseInt(router?.query?.exam + ''))
			if (res.status == 200) {
				if (res.data?.data?.StudentId != user?.UserInformationId) {
					setBlocked('Không thể làm bài của người khác')
				} else {
					//  Mọi thứ phải bắt đầu từ khúc này. Nếu bị block thì không làm gì cả
					setTestInfo(res.data.data)
					// getExamInfo(res?.data?.data?.IeltsExamId)
					// getExamSkill(res?.data?.data?.IeltsExamId)
					getOverview(res?.data?.data?.IeltsExamId)
				}
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [examInfo, setExamInfo] = useState(null)

	// Lấy thông tin của đề được gắn dô bài này
	async function getExamInfo(id) {
		try {
			const res = await ieltsExamApi.getByID(id)
			if (res.status == 200) {
				setExamInfo(res.data.data)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [skills, setSkills] = useState([])
	async function getExamSkill(examId) {
		try {
			const res = await ieltsSkillApi.getAll({ pageSize: 999, pageIndex: 1, ieltsExamId: examId })
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

	// const [currentSection, setCurrentSection] = useState(null)

	async function getSections(e?: any, oldIndex?: number) {
		try {
			const res = await ieltsSectionApi.getAll({ pageSize: 99, pageIndex: 1, ieltsSkillId: currentSkill?.Id })
			if (res.status == 200) {
				setSections(res.data.data)

				if (!currentSection) {
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
		if (currentSection?.Id) {
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
				setQuestionsInSection([])
				setCurGroup([])
			} finally {
				heightChange()
				setLoading(false)
			}
		}
	}

	const [curGroup, setCurGroup] = useState<any>(null)

	async function getQuestionsByGroup() {
		if (currentQuestion?.IeltsQuestionGroupId) {
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
			heightChange()
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
		if (sections.length == 0) {
			setCurrentSection(null)
		} else {
			// setCurrentSection(sections[0])
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

	useEffect(() => {
		if (curGroup) {
			log.Yellow('curGroup', curGroup)
		}
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
	const [curAudio, setCurAudio] = useState(null)

	useEffect(() => {
		if (curAudio?.Audio) {
			ShowNostis.success(`Đang phát audio: ${curAudio?.Name}`)
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
				log.Green('Created test', res.data?.data)
				gotoTest(res.data?.data)
				// Make some noise...
			}
		} catch (error) {
		} finally {
			setCreatingTest(false)
		}
	}

	// ---------------------------------------

	const globalState = useSelector((state: RootState) => state.takeAnExam)

	const [overview, setOverview] = useState(null)

	async function getOverview(examId) {
		console.time('- Get Overview')
		try {
			const response: any = await ieltsExamApi.getOverview(examId)
			if (response.status == 200) {
				setOverview(response.data.data)
				setSkills(response.data.data?.IeltsSkills)

				dispatch(setSuperOverview(response.data.data))

				if (response.data.data?.IeltsSkills?.length > 0) {
					setCurrentSkill(response.data.data?.IeltsSkills[0])
				}
			} else {
				setOverview(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			console.timeEnd('- Get Overview')
			console.timeEnd('- Get All Exam Data')
			setLoading(false)
		}
	}

	function handleChangeSkill(params) {
		setCurrentSection(null)
		setCurrentSkill(params)
	}

	return (
		<ExamProvider>
			<div className="exam-23-container">
				<div className="cc-exam-detail z-10 !w-full bg-[#fff]">
					<TakeAnExamHeader
						loading={loading}
						testInfo={testInfo}
						overview={overview}
						showSettings={showSettings}
						setShowSetings={setShowSetings}
					/>

					<TakeAnExamController
						showSkills={showSkills}
						showSections={showSections}
						loading={loading}
						skills={skills}
						setCurAudio={setCurAudio}
						currentSkill={currentSkill}
						setCurrentSkill={handleChangeSkill}
						onRefreshSkill={getExamSkill}
						sections={sections}
						currentSection={currentSection}
						setCurrentSection={setCurrentSection}
						getSections={getSections}
					/>
				</div>

				<div className="flex-1 flex relative">
					<MainAudioPlayer
						curAudio={curAudio}
						showAudioControl={showAudioControl}
						setShowAudioControl={setShowAudioControl}
						curSection={currentSection}
						curSkill={currentSkill}
					/>

					<>
						{showMain && <div id="the-fica-block" className="w-[0.5px] bg-transparent" />}

						{!!currentSection?.ReadingPassage && (
							<div className="flex-1 p-[16px] bg-[#fff] scrollable" style={{ height: mainHeight }}>
								{htmlParser(currentSection?.ReadingPassage || '')}
							</div>
						)}

						{/* RIGHT OF SCREEN */}
						<div className="flex-1 p-[16px] scrollable max-w-[1200px] mx-auto" style={{ height: mainHeight }}>
							{questionsInSection.length > 0 && (
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

							<GroupContent is={is} curGroup={curGroup} questionsInSection={questionsInSection} />

							<TestingQuestions data={curGroup} questions={questionsInSection} />

							{curAudio?.Audio && <div className="h-[200px]" />}
						</div>
					</>
				</div>

				{showQuestions && (
					<div className="exam-23-footer">
						<div className="flex flex-col items-start">
							<div onClick={toggleQuestions} className="ex-23-f-button">
								<MdArrowForwardIos className="rotate-90 mr-[8px]" />
								<div className="font-[500]">Câu hỏi ({questionsInSection.length})</div>
							</div>

							<div className="flex items-center no-select">
								{questionsInSection.map((item, index) => {
									const activated = currentQuestion?.IeltsQuestionId == item?.IeltsQuestionId
									return (
										<ButtonQuestion
											key={`quest-num-${index}`}
											isActivated={activated}
											data={item}
											onClick={() => setCurrentQuestion(item)}
										/>
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

				<Modal centered closable={false} width={400} open={!!blocked} footer={null}>
					<div className="w-full flex flex-col items-center">
						<Lottie loop animationData={lottieFile} play className="w-[220px]" />
						<div className="text-[18px] font-[600] text-[red]">{blocked}</div>
					</div>
				</Modal>
			</div>
		</ExamProvider>
	)
}

export default TakeAnExamDetail
