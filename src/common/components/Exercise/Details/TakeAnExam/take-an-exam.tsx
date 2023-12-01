import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import Router, { useRouter } from 'next/router'
import { RootState } from '~/store'
import { ieltsExamApi } from '~/api/IeltsExam'
import { wait } from '~/common/utils/common'
import { ShowNostis, log } from '~/common/utils'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import { BsFillGrid3X2GapFill } from 'react-icons/bs'
import htmlParser from '../../../HtmlParser'
import TestingQuestions from '../../Testing/Questions'
import { setNewCurrentGroup } from '~/store/newExamReducer'
import { useExamContext } from '~/common/providers/Exam'
import { QUESTION_TYPES } from '~/common/libs'
import DragHeader from '../Components/drag-header'
import GroupContent from '../Components/group-content'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { closeSubmitModal, setGlobalCurGroup, setSubmited, setTimeOut } from '~/store/take-an-exam'
import TakeAnExamHeader from './Header'
import TakeAnExamController from './Controller'
import { examResultApi } from '~/api/exam/result'
import MainAudioPlayer2 from '../AudioPlayer2'
import ModalBlocked from '../../Components/ModalBlocked'
import ModalTimeOut from './Modals/ModalTimeOut'
import ModalConfirmSubmit from './Modals/ModalConfirmSubmit'
import TAEFooter from './Footer'
import { RiFileList2Line } from 'react-icons/ri'
import { TbListDetails } from 'react-icons/tb'
import { formatInput, getOverview, handleClickQuest } from './utils'

import crypto from 'crypto'

let dragSelected = []

function TakeAnExamDetail() {
	const router = useRouter()
	const dispatch = useDispatch()

	// useEffect(() => {
	// 	log.Yellow('--- dragSelected: ', dragSelected)
	// }, [dragSelected])

	const {
		curAudio,
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

	// log.Yellow('---currentQuestion', currentQuestion)

	const user = useSelector((state: RootState) => state.user.information)

	const [testInfo, setTestInfo] = useState(null)
	const [loadingGroup, setLoadingGroup] = useState(true)
	const [currentSkill, setCurrentSkill] = useState(null)

	const [showSkills, setShowSkills] = useState<boolean>(true)
	const [showSections, setShowSections] = useState<boolean>(true)

	// const [currentQuestion, setCurrentQuestion] = useState(null)
	const [showQuestions, setShowQuestions] = useState<boolean>(true)

	const [blocked, setBlocked] = useState('')
	const [showOver, setShowOver] = useState<boolean>(true)

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

					const examId = res?.data?.data?.IeltsExamId
					getOverview(examId, dispatch, setOverview, setSkills, setCurrentSkill, setBlocked, setLoading)
				}
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function getDoingQuestionGroup() {
		setLoadingGroup(true)
		try {
			const res = await doingTestApi.getQuestionGroup({
				ieltsQuestionGroupId: currentQuestion?.IeltsQuestionGroupId,
				doingTestId: parseInt(router?.query?.exam + '')
			})
			if (res.status == 200) {
				setCurGroup(res.data.data)
			} else {
				setCurGroup(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoadingGroup(false)
			setLoading(false)
		}
	}

	const [skills, setSkills] = useState([])

	const [sections, setSections] = useState([])
	const [currentSection, setCurrentSection] = useState(null)

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

	// const [questionsInSection, setQuestionsInSection] = useState([])

	async function getQuestions() {
		getAllQuestions(currentSection, setCurGroup)
		// // GET questions in navigation
		// if (currentSection?.Id) {
		// 	try {
		// 		const res = await ieltsExamApi.getQuestions({ ieltsSectionId: currentSection?.Id, doingTestId: parseInt(router?.query?.exam + '') })
		// 		if (res.status == 200) {
		// 			setQuestionsInSection(res.data.data)
		// 		} else {
		// 			setQuestionsInSection([])
		// 			setCurGroup([])
		// 		}
		// 	} catch (error) {
		// 		ShowNostis.error(error?.message)
		// 		setQuestionsInSection([])
		// 		setCurGroup([])
		// 	} finally {
		// 		setLoading(false)
		// 	}
		// }
	}

	const [curGroup, setCurGroup] = useState<any>(null)

	useEffect(() => {
		if (!!currentQuestion?.IeltsQuestionGroupId) {
			getDoingQuestionGroup()
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
		}
	}, [sections])

	// const [notSetCurrentQuest, setNotSetCurrentQuest] = useState<boolean>(false)

	async function makeSomeNoise() {
		if (!notSetCurrentQuest) {
			if (questionsInSection.length > 0) {
				setCurrentQuestion(questionsInSection[0])
			} else {
				setCurGroup(null)
				dispatch(setNewCurrentGroup(null))
				setCurrentQuestion(null)
			}
			heightChange()
		}

		setNotSetCurrentQuest(false)
	}

	useEffect(() => {
		makeSomeNoise()
	}, [questionsInSection])

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
	}, [showSections, showSkills, showQuestions, curAudio])

	function getHeight() {
		const theFica = document.getElementById('the-fica-block')
		if (!!theFica) {
			setMainHeight(theFica.offsetHeight)
		}
	}

	function generateShortHash(input) {
		const hash = crypto.createHash('md5').update(input.toString()).digest('hex')
		return hash.substring(0, 6) // Lấy 6 ký tự đầu của giá trị hash
	}

	// Magic
	async function handleChangedGroup() {
		if (curGroup?.Type != QUESTION_TYPES.Mindmap) {
			setShowOver(false)
			await wait(100)
			setShowOver(true)
			await wait(100)

			// --- Từ đây trở lên là bí thuật nha, xoá là nó đi bụi đó

			dragSelected = []

			// console.log('------------------------------ ---------------------------------- handleChangedGroup ----------')

			if (curGroup?.Type == QUESTION_TYPES.DragDrop && curGroup?.IeltsQuestions.length > 0) {
				curGroup?.IeltsQuestions.forEach((element, indexQuest) => {
					if (!!curGroup?.IeltsQuestions[indexQuest]?.DoingTestDetails) {
						curGroup?.IeltsQuestions[indexQuest]?.DoingTestDetails.forEach((det, indexDetail) => {
							if (!!curGroup?.IeltsQuestions[indexQuest]?.DoingTestDetails[indexDetail]?.IeltsAnswerId) {
								const thisId = curGroup?.IeltsQuestions[indexQuest]?.Id

								dragSelected.push({
									timeStamp: generateShortHash(new Date().getTime()) + '-' + indexQuest + '-' + indexDetail,
									quest: thisId,
									ans: curGroup?.IeltsQuestions[indexQuest]?.DoingTestDetails[indexDetail]?.IeltsAnswerId
								})
							}
						})
					}
				})
			}

			// ----
			await formatInput(
				questionsInSection,
				curGroup,
				currentQuestion,
				setCurrentQuestion,
				handleAnswerTyping,
				getDoingQuestionGroup,
				setDragAns,
				setTimeStamp,
				setNotSetCurrentQuest,
				getQuestions,
				dragSelected
			)
		}

		await wait(100)
		handleClickQuest(currentQuestion, setCurrentQuestion)
	}

	useEffect(() => {
		if (curGroup) {
			dispatch(setGlobalCurGroup(curGroup))
			handleChangedGroup()
		}
	}, [curGroup?.Id])

	useEffect(() => {
		if (!!currentQuestion) {
			// console.log('------- currentQuestion changed ' + currentQuestion)

			// await wait(200)

			handleClickQuest(currentQuestion, setCurrentQuestion)
		}
	}, [currentQuestion])

	async function insertDetails(data, answer) {
		let items = []

		if (!!data?.DoingTestDetails) {
			items.push({ ...data?.DoingTestDetails[0], Enable: false })
		}

		items.push({ Id: 0, IeltsAnswerId: 0, IeltsAnswerContent: answer, Type: 0, Index: 0, Enable: true })

		if (!!Router?.query?.exam) {
			console.log('-------- insertDetails PUT items: ', items)

			try {
				await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: data.Id,
					Items: [...items]
				})
			} catch (error) {
			} finally {
				setNotSetCurrentQuest(true)
				getQuestions()
			}
		}
	}

	function handleAnswerTyping(id, text) {
		if (!!id) {
			console.log('Got answer typing: ', { id: id, text: text })
			const indexInGroup = curGroup?.IeltsQuestions.findIndex((quest) => quest?.Id == id)
			if (indexInGroup > -1) {
				insertDetails(curGroup?.IeltsQuestions[indexInGroup], text)
			}
		}
	}

	const [dragAns, setDragAns] = useState([])
	const [timeStamp, setTimeStamp] = useState(0)

	useEffect(() => {
		const theIndex = document.getElementById(`cauhoi-0`)
		if (!!theIndex) {
			theIndex.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}, [curGroup?.Id])

	const is = {
		typing: curGroup?.Type == QUESTION_TYPES.FillInTheBlank,
		drag: curGroup?.Type == QUESTION_TYPES.DragDrop
	}

	useEffect(() => {
		if (curAudio?.Audio) {
			ShowNostis.success(`Playing: ${curAudio?.Name}`)
		}
	}, [curAudio])

	const [overview, setOverview] = useState(null)

	function handleChangeSkill(params) {
		setCurrentSection(null)
		setCurrentSkill(params)
	}

	const [submiting, setSubmiting] = useState<boolean>(false)
	const [submitData, setSubmitData] = useState<any>(null)
	const [successModal, setSuccessModal] = useState<boolean>(false)

	async function submitAll() {
		if (!submiting) {
			console.time('Gọi api nộp bài hết')
			setSubmiting(true)
			try {
				const res = await examResultApi.post({ DoingTestId: parseInt(router.query?.exam + '') })
				if (res.status == 200) {
					setSubmitData(res.data?.data)
					dispatch(closeSubmitModal())
					dispatch(setSubmited(true))
					dispatch(setTimeOut(false))
					setSuccessModal(true)
				}
			} catch (error) {
				setBlocked('Bài tập đã nộp')
			} finally {
				setSubmiting(false)
				console.timeEnd('Gọi api nộp bài hết')
			}
		}
	}

	const [showRead, setShowRead] = useState<boolean>(false)

	useEffect(() => {
		if (!showRead) {
			handleChangedGroup()
		}
	}, [showRead])

	function refreshNav() {
		setNotSetCurrentQuest(true)
		getQuestions()
	}

	// console.log('---------------------------- showOver: ', showOver)

	return (
		<>
			<div className="exam-23-container relative">
				<div className="cc-exam-detail z-10 !w-full bg-[#fff]">
					<TakeAnExamHeader
						testInfo={testInfo}
						overview={overview}
						skills={skills}
						currentSkill={currentSkill}
						showSkills={showSkills}
						showSections={showSections}
						showQuestions={showQuestions}
						setShowSkills={setShowSkills}
						setShowQuestions={setShowQuestions}
						setShowSections={setShowSections}
						onSubmit={submitAll}
					/>
					<TakeAnExamController
						showSkills={showSkills}
						showSections={showSections}
						loading={loading}
						skills={skills}
						currentSkill={currentSkill}
						setCurrentSkill={handleChangeSkill}
						sections={sections}
						currentSection={currentSection}
						setCurrentSection={setCurrentSection}
						getSections={getSections}
					>
						{!!window && window?.innerWidth > 749 && <MainAudioPlayer2 />}
					</TakeAnExamController>
				</div>

				<div className="flex-1 flex relative">
					<>
						{showMain && <div id="the-fica-block" className="w-[0.5px] bg-transparent" />}

						{!!currentSection?.ReadingPassage && showRead && (
							<div className="flex-1 p-[16px] bg-[#fff] scrollable block w750:hidden" style={{ height: mainHeight }}>
								{showRead && (
									<div className="flex justify-start">
										<div onClick={() => setShowRead(false)} className="btn-view-quest">
											<TbListDetails size={16} className="mr-[4px]" />
											<div>Câu hỏi</div>
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

						{/* ------------------------------ */}
						{/* RIGHT OF SCREEN */}

						{showOver && (
							<>
								{!showRead && (
									<div className="tae-right-mobile" style={{ height: mainHeight }}>
										<div id={`cauhoi-0`} />

										{!!window && window?.innerWidth < 750 && (
											<div className="mobile-audio full-s-audio">
												<MainAudioPlayer2 />
											</div>
										)}

										{is.drag && <DragHeader answers={dragAns} />}

										{!!currentSection?.ReadingPassage && (
											<div className="flex justify-start pt-[4px]">
												<div onClick={() => setShowRead(true)} className="btn-view-passage">
													<RiFileList2Line size={14} className="mr-[4px]" />
													<div>Bài đọc</div>
												</div>
											</div>
										)}

										{!!window && window?.innerWidth < 750 && (
											<GroupContent key={`m-gc-${curGroup?.Id}`} is={is} curGroup={curGroup} questionsInSection={questionsInSection} />
										)}

										{!!window && window?.innerWidth < 750 && (
											<TestingQuestions
												key={`t-m-gr-${curGroup?.Id}`}
												data={curGroup}
												onRefreshNav={refreshNav}
												setCurGroup={setCurGroup}
											/>
										)}

										{curAudio?.Audio && <div className="h-[200px]" />}
									</div>
								)}

								<div id="scroll-tag" className="tae-right-desktop" style={{ height: mainHeight }}>
									<div id={`cauhoi-0-2`} />

									{is.drag && <DragHeader answers={dragAns} />}

									<GroupContent key={`d-gc-${curGroup?.Id}`} is={is} curGroup={curGroup} questionsInSection={questionsInSection} />

									<TestingQuestions key={`t-d-gr-${curGroup?.Id}`} data={curGroup} onRefreshNav={refreshNav} setCurGroup={setCurGroup} />

									{curAudio?.Audio && <div className="h-[200px]" />}
								</div>
							</>
						)}
					</>
				</div>

				<TAEFooter
					key="take-an-exam-footer"
					visible={showQuestions}
					testInfo={testInfo}
					questions={questionsInSection}
					onToggle={toggleQuestions}
					curQuest={currentQuestion}
					onClickQuest={(e) => handleClickQuest(e, setCurrentQuestion)}
				/>

				{!showQuestions && (
					<div onClick={toggleQuestions} className="cc-23-btn-quests all-center" style={{ zIndex: 99999 }}>
						<BsFillGrid3X2GapFill size={20} className="mt-[2px]" />
						<div>Câu hỏi ({questionsInSection.length})</div>
					</div>
				)}

				{loadingGroup && (
					<div className="bg-[rgba(0,0,0,0.1)] all-center rounded-[6px] absolute top-0 left-0 w-full h-full">
						<div className="text-[#000] font-[500]">Đang xử lý...</div>
					</div>
				)}

				<ModalBlocked content={blocked} />
				<ModalConfirmSubmit submiting={submiting} onSubmit={submitAll} />
				<ModalTimeOut visible={successModal} submitedData={submitData} />
			</div>
		</>
	)
}

export default TakeAnExamDetail
