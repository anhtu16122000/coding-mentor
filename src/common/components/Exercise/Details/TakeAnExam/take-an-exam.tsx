import React, { useEffect, useState } from 'react'
import { Drawer, Modal, Switch } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import Router, { useRouter } from 'next/router'
import { RootState } from '~/store'
import PrimaryButton from '../../../Primary/Button'
import { ieltsExamApi } from '~/api/IeltsExam'
import { wait } from '~/common/utils/common'
import { ShowNostis, log } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import ButtonQuestion from '../ButtonQuestion'
import { MdArrowForwardIos } from 'react-icons/md'
import { BsFillGrid3X2GapFill } from 'react-icons/bs'
import htmlParser from '../../../HtmlParser'
import TestingQuestions from '../../Testing/Questions'
import { setNewCurrentGroup } from '~/store/newExamReducer'
import ExamProvider from '../../../Auth/Provider/exam'
import { QUESTION_TYPES } from '~/common/libs'
import DragHeader from '../Components/drag-header'
import GroupContent from '../Components/group-content'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import Lottie from 'react-lottie-player'
import lottieFile from '~/common/components/json/animation_lludr9cs.json'
import { closeSubmitModal, openSubmitModal, setGlobalCurGroup, setSubmited, setSuperOverview, setTimeOut } from '~/store/take-an-exam'
import TakeAnExamHeader from './Header'
import TakeAnExamController from './Controller'
import MainAudioPlayer from '../AudioPlayer'
import { FaTelegramPlane } from 'react-icons/fa'

import submitAni from '~/common/components/json/110944-plane.json'
import successAni from '~/common/components/json/134369-sucess.json'
import { examResultApi } from '~/api/exam/result'

let curDragAnswers = []
let dragSelected = []

function TakeAnExamDetail() {
	const router = useRouter()
	const dispatch = useDispatch()

	const user = useSelector((state: RootState) => state.user.information)

	const [testInfo, setTestInfo] = useState(null)
	const [loading, setLoading] = useState(true)
	const [loadingGroup, setLoadingGroup] = useState(true)
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
					getOverview(res?.data?.data?.IeltsExamId)
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
		// GET questions in navigation
		if (currentSection?.Id) {
			try {
				const res = await ieltsExamApi.getQuestions({ ieltsSectionId: currentSection?.Id, doingTestId: parseInt(router?.query?.exam + '') })
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
				// console.log('--- notSetCurrentQuest: ', notSetCurrentQuest)

				setLoading(false)
			}
		}
	}

	const [curGroup, setCurGroup] = useState<any>(null)

	useEffect(() => {
		// console.log('--- currentQuestion: ', currentQuestion)

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
			// setCurrentSection(sections[0])
		}
	}, [sections])

	const [notSetCurrentQuest, setNotSetCurrentQuest] = useState<boolean>(false)

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
			dispatch(setGlobalCurGroup(curGroup))
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

	async function formatInput() {
		const inputs: any = document.getElementsByClassName('b-in')
		const temp = [...inputs]

		if (temp.length > 0) {
			for (let i = 0; i < temp.length; i++) {
				const element = temp[i]
				const id = element.getAttribute('id')

				const realId = getRealID(id) || ''
				const indexInGroup = curGroup?.IeltsQuestions.findIndex((quest) => quest?.Id == realId)

				if (!is.drag) {
					if (!!curGroup?.IeltsQuestions[indexInGroup]?.DoingTestDetails) {
						const contentAnswerd = curGroup?.IeltsQuestions[indexInGroup]?.DoingTestDetails[0]?.IeltsAnswerContent

						temp[i].value = contentAnswerd || null

						if (contentAnswerd.length > 4) {
							temp[i].style.maxWidth = 'unset'
							temp[i].style.width = contentAnswerd.length + 2 + 'ch'
						} else {
							temp[i].style.maxWidth = '80px'
							temp[i].style.width = '80px'
						}
					}

					temp[i].setAttribute('placeholder', `(${getQuestIndex(realId).Index})`)
					temp[i].disabled = false
					temp[i].classList.add(`cauhoi-${realId}`)
					temp[i].style.border = '1px solid #ebebeb'

					temp[i].addEventListener('keydown', (event) => {
						if (event.target.value.length > 4) {
							temp[i].style.maxWidth = 'unset'
							temp[i].style.width = event.target.value.length + 2 + 'ch'
						} else {
							temp[i].style.maxWidth = '80px'
							temp[i].style.width = '80px'
						}

						if (
							(event.key == 'Delete' || event.key == 'Backspace') &&
							temp[i].selectionStart == 0 &&
							temp[i].selectionEnd == temp[i].value.length
						) {
							temp[i].style.maxWidth = '80px'
							temp[i].style.width = '80px'
						}
					})

					temp[i].addEventListener('paste', function (event) {
						const pastedText = event.clipboardData.getData('text')
						if (pastedText.length > 4) {
							temp[i].style.maxWidth = 'unset'
							temp[i].style.width = pastedText.length + 2 + 'ch'
						} else {
							temp[i].style.maxWidth = '80px'
							temp[i].style.width = '80px'
						}
					})

					temp[i].addEventListener('focus', (event) => {
						event.target.style.border = '1px solid #1b73e8'
						setCurrentQuestion({ ...currentQuestion, IeltsQuestionId: realId })
					})

					temp[i].addEventListener('blur', (event) => {
						event.target.style.border = '1px solid #ebebeb'
						handleAnswerTyping(realId, event.target.value)
					})
				}
			}
		}

		if (is.drag) {
			let tamp = []

			for (let iQuest = 0; iQuest < curGroup?.IeltsQuestions.length; iQuest++) {
				const element = curGroup?.IeltsQuestions[iQuest]

				// for (let jAns = 0; jAns < element?.IeltsAnswers.length; jAns++) {
				// 	const newFuckingAns = { ...element?.IeltsAnswers[jAns], Question: { ...element } }

				// 	tamp.push({ aNum: jAns, ...newFuckingAns })
				// }

				// element?.IeltsAnswers.forEarch
				element?.IeltsAnswers.forEach((i, j) => {
					tamp.push({ aNum: j, ...{ ...element?.IeltsAnswers[j], Question: { ...element } } })
				})
			}

			console.log('---- tamp: ', tamp)

			curDragAnswers = tamp

			setDragAns(tamp)

			// -----------------------------------------------------

			for (let i = 0; i < temp.length; i++) {
				const element = temp[i]

				const id = element.getAttribute('id')
				const createSelect = document.createElement('select')

				const realId = getRealID(id) || ''
				const indexInGroup = curGroup?.IeltsQuestions.findIndex((quest) => quest?.Id == realId)

				createSelect.classList.add('b-in')

				createSelect.setAttribute('id', id)
				createSelect.classList.add(`cauhoi-${realId}`)

				const createOptionDefault = document.createElement('option')
				createOptionDefault.setAttribute('value', '0')
				createOptionDefault.textContent = 'Chọn đáp án'
				createSelect.appendChild(createOptionDefault)

				createSelect.style.maxWidth = 'unset'

				createSelect.addEventListener('click', (event) => {
					setCurrentQuestion({ ...currentQuestion, IeltsQuestionId: realId })
				})

				createSelect.addEventListener('change', async (e: any) => {
					const targetValue = e.target?.value as any

					let items = []

					const indexInGroup = curGroup?.IeltsQuestions.findIndex((x) => x.Id == realId)

					if (!!curGroup?.IeltsQuestions[indexInGroup]?.DoingTestDetails) {
						items.push({ ...curGroup?.IeltsQuestions[indexInGroup]?.DoingTestDetails[0], Enable: false })
					}

					if (!!targetValue) {
						items.push({
							Id: 0,
							IeltsAnswerId: targetValue,
							IeltsAnswerContent: '',
							Type: 0,
							Index: 0,
							Enable: true
						})
					}

					function checkAnswerId(item) {
						return item.IeltsAnswerId > 0
					}

					const checkResult = items.every(checkAnswerId)

					if (!!Router?.query?.exam && !!checkResult) {
						console.log('-------- Changed PUT items: ', items)

						try {
							await doingTestApi.insertDetail({
								DoingTestId: parseInt(Router?.query?.exam + ''),
								IeltsQuestionId: curGroup?.IeltsQuestions[indexInGroup]?.Id,
								Items: [...items]
							})
						} catch (error) {
						} finally {
							getDoingQuestionGroup()
						}
					}

					const indexSelected = curDragAnswers.findIndex((a) => a.Id == e.target?.value)
					curDragAnswers[indexSelected] = { ...curDragAnswers[indexSelected], disabled: true }

					const thisOptions = document.getElementsByClassName(targetValue)
					for (let t = 0; t < thisOptions.length; t++) {
						thisOptions[t].setAttribute('disabled', 'true')
					}

					const theShitIndex = dragSelected.findIndex((a) => a.quest == realId)

					if (theShitIndex == -1) {
						dragSelected.push({ timeStamp: new Date(), quest: realId, ans: targetValue })
					} else {
						const oldSelected = document.getElementsByClassName(dragSelected[theShitIndex]?.ans)

						for (let t = 0; t < oldSelected.length; t++) {
							oldSelected[t].removeAttribute('disabled')
						}

						// ------------------------
						dragSelected[theShitIndex] = { ...dragSelected[theShitIndex], ans: targetValue }
					}

					setDragAns([...curDragAnswers])
					setTimeStamp(new Date().getTime())

					setNotSetCurrentQuest(true)
					getQuestions()
				})

				// Tìm câu này trong danh sách câu đã chọn đáp án (có thể là lấy từ api)
				const findSelectedId = dragSelected.findIndex((thisAns) => thisAns?.quest == realId)
				const thisFuckingAns = findSelectedId > -1 ? dragSelected[findSelectedId]?.ans : undefined

				for (let p = 0; p < curDragAnswers.length; p++) {
					const element = curDragAnswers[p]

					const findAnsId = dragSelected.findIndex((thisAns) => thisAns?.ans == element?.Id)

					const createOptionDefault = document.createElement('option')
					createOptionDefault.setAttribute('value', element?.Id)
					createOptionDefault.setAttribute('class', element?.Id)

					if (element?.Id == thisFuckingAns) {
						createOptionDefault.setAttribute('selected', 'true')
					}

					if (element?.disabled == true || findAnsId > -1) {
						createOptionDefault.setAttribute('disabled', 'true')
					}

					createOptionDefault.textContent = element?.Content
					createSelect.appendChild(createOptionDefault)
				}

				if (!!inputs[i]) inputs[i].replaceWith(createSelect)
			}
		}

		if (!is.drag) {
			setDragAns([])
		}
	}

	useEffect(() => {
		dragSelected = []

		if (curGroup?.Type == QUESTION_TYPES.DragDrop && curGroup?.IeltsQuestions.length > 0) {
			for (let i = 0; i < curGroup?.IeltsQuestions.length; i++) {
				const element = curGroup?.IeltsQuestions[i]

				if (!!element?.DoingTestDetails) {
					for (let p = 0; p < element?.DoingTestDetails.length; p++) {
						if (!!element?.DoingTestDetails[p]?.IeltsAnswerId) {
							dragSelected.push({
								timeStamp: new Date(),
								quest: element?.Id,
								ans: element?.DoingTestDetails[p]?.IeltsAnswerId
							})
						}
					}
				}
			}
		}

		// ----
		formatInput()
	}, [curGroup])

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

	const [showAudioControl, setShowAudioControl] = useState<boolean>(false)
	const [curAudio, setCurAudio] = useState(null)

	useEffect(() => {
		if (curAudio?.Audio) {
			ShowNostis.success(`Playing: ${curAudio?.Name}`)
		}
	}, [curAudio])

	const [overview, setOverview] = useState(null)

	async function getOverview(examId) {
		try {
			const response: any = await ieltsExamApi.getOverview(examId)
			if (response.status == 200) {
				setOverview(response.data.data)
				setSkills(response.data.data?.IeltsSkills)

				dispatch(setSuperOverview(response.data.data))
				if (response.data.data?.IeltsSkills?.length > 0) {
					setCurrentSkill(response.data.data?.IeltsSkills[0])
				}

				if (!response.data.data?.IeltsSkills && Router.asPath.includes('take-an-exam')) {
					ShowNostis.error('Đề không có nội dung')
					setBlocked('Đề không có nội dung')
				}
			} else {
				setOverview(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function handleChangeSkill(params) {
		setCurrentSection(null)
		setCurrentSkill(params)
	}

	const globalState = useSelector((state: RootState) => state.takeAnExam)

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
				const thisErr = error?.message || error || 'Lỗi không xác định'
				ShowNostis.error(thisErr)
			} finally {
				setSubmiting(false)
				console.timeEnd('Gọi api nộp bài hết')
			}
		}
	}

	return (
		<ExamProvider>
			<div className="exam-23-container relative">
				<div className="cc-exam-detail z-10 !w-full bg-[#fff]">
					<TakeAnExamHeader
						loading={loading}
						testInfo={testInfo}
						overview={overview}
						showSettings={showSettings}
						setShowSetings={setShowSetings}
						skills={skills}
						currentSkill={currentSkill}
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
						setCurAudio={setCurAudio}
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
							<div id={`cauhoi-0`} />

							{is.drag && <DragHeader answers={dragAns} />}

							<GroupContent is={is} curGroup={curGroup} questionsInSection={questionsInSection} />

							<TestingQuestions
								data={curGroup}
								questions={questionsInSection}
								setCurrentQuestion={setCurrentQuestion}
								getDoingQuestionGroup={getDoingQuestionGroup}
								onRefreshNav={() => {
									setNotSetCurrentQuest(true)
									getQuestions()
								}}
							/>

							{curAudio?.Audio && <div className="h-[200px]" />}
						</div>
					</>
				</div>

				{showQuestions && (
					<div className="exam-23-footer">
						<div className="flex flex-col flex-1 items-start">
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
											onClick={() => {
												const theIndex = document.getElementById(`cauhoi-${item?.IeltsQuestionId}`)
												const classIndex = document.getElementsByClassName(`cauhoi-${item?.IeltsQuestionId}`)

												if (!!theIndex) {
													theIndex.scrollIntoView({ behavior: 'smooth', block: 'center' })
												} else if (classIndex.length > 0) {
													classIndex[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
												}

												setCurrentQuestion(item)
											}}
										/>
									)
								})}

								{questionsInSection.length == 0 && <div className="text-[red]">Chưa có câu hỏi</div>}
							</div>
						</div>

						{router?.asPath.includes('take-an-exam') && testInfo?.Type != 1 && (
							<div
								onClick={() => dispatch(openSubmitModal())}
								className="h-[34px] cursor-pointer no-select px-[8px] rounded-[6px] all-center text-[#fff] bg-[#1b73e8] hover:bg-[#1867cf]"
							>
								<IoPaperPlaneOutline color="#fff" size={20} />
								<div className="ml-[4px]">Nộp bài</div>
							</div>
						)}
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

				{loadingGroup && (
					<div className="bg-[rgba(0,0,0,0.1)] all-center rounded-[6px] absolute top-0 left-0 w-full h-full">
						<div className="text-[#000] font-[500]">Đang xử lý...</div>
					</div>
				)}

				<Modal
					width={500}
					closable={false}
					open={globalState.submitVisible}
					footer={
						<div className="tae-submit-footer">
							<PrimaryButton onClick={() => !submiting && dispatch(closeSubmitModal())} background="red" icon="cancel" type="button">
								Huỷ
							</PrimaryButton>

							<PrimaryButton className="ml-[8px]" onClick={submitAll} background="blue" icon="none" type="button">
								<FaTelegramPlane size={20} />
								<div className="tae-submit-title">{submiting ? 'Đang nộp bài..' : 'Nộp ngay'}</div>
							</PrimaryButton>
						</div>
					}
				>
					<div className="tae-submit-modal">
						<Lottie loop animationData={submitAni} play className="animation-submit" />
						<div>Bạn muốn nộp bài ngay?</div>
					</div>
				</Modal>

				<Modal
					width={500}
					closable={false}
					open={successModal}
					footer={
						<div className="tae-submit-footer">
							<PrimaryButton onClick={() => window.close()} background="red" icon="cancel" type="button">
								Thoát ngay
							</PrimaryButton>

							<PrimaryButton
								className="ml-[8px]"
								onClick={() => Router.replace(`/exam-result/?test=${submitData?.Id}`)}
								background="blue"
								icon="eye"
								type="button"
							>
								Xem kết quả
							</PrimaryButton>
						</div>
					}
				>
					<div className="tae-submit-modal">
						<Lottie loop animationData={successAni} play style={{ width: 300, height: 300, marginTop: 0 }} />
						{!!globalState.timeout && <div style={{ marginTop: 0 }}>Đã hết giờ, hệ thống đã tự nộp bài</div>}
						{!globalState.timeout && <div style={{ marginTop: 0 }}>Nộp bài thành công</div>}
					</div>
				</Modal>
			</div>
		</ExamProvider>
	)
}

export default TakeAnExamDetail
