import React, { useEffect, useState } from 'react'
import { Card, Divider, Drawer, Empty, Modal, Popconfirm, Progress, Skeleton, Spin, Switch } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import Router, { useRouter } from 'next/router'
import { RootState } from '~/store'
import { HiClock, HiOutlineBookOpen } from 'react-icons/hi'
import { ieltsExamApi } from '~/api/IeltsExam'
import { decode, wait } from '~/common/utils/common'
import { ShowNostis, log } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import { ieltsSectionApi } from '~/api/IeltsExam/ieltsSection'
import { MdArrowForwardIos, MdSettings } from 'react-icons/md'
import { BsFillGrid3X2GapFill } from 'react-icons/bs'
import { ieltsGroupApi } from '~/api/IeltsExam/ieltsGroup'
import { setNewCurrentGroup } from '~/store/newExamReducer'
import { QUESTION_TYPES } from '~/common/libs'
import { IoClose, IoCloseSharp, IoPaperPlaneOutline } from 'react-icons/io5'

import { AiFillClockCircle, AiFillControl, AiOutlineEye } from 'react-icons/ai'
import { VscSettings } from 'react-icons/vsc'
import { doingTestApi } from '~/api/IeltsExam/doing-test'

import Lottie from 'react-lottie-player'
import lottieFile from '~/common/components/json/animation_lludr9cs.json'
import timer from '~/common/components/json/131525-timer.json'
import { closeSubmitModal, openSubmitModal, setGlobalCurGroup, setSubmited, setSuperOverview, setTimeOut } from '~/store/take-an-exam'
import TakeAnExamHeader from './Header'
import { FaFileMedicalAlt, FaFileSignature, FaTelegramPlane, FaUserGraduate } from 'react-icons/fa'

import submitAni from '~/common/components/json/110944-plane.json'
import successAni from '~/common/components/json/134369-sucess.json'
import timeupAni from '~/common/components/json/6640-times-up.json'
import { examResultApi } from '~/api/exam/result'
import { IoMdClose } from 'react-icons/io'
import { EyeOutlined } from '@ant-design/icons'
import ExamProvider from '~/common/components/Auth/Provider/exam'
import MainAudioPlayer from '~/common/components/Exercise/Details/AudioPlayer'
import htmlParser from '~/common/components/HtmlParser'
import DragHeader from '~/common/components/Exercise/Details/Components/drag-header'
import GroupContent from '~/common/components/Exercise/Details/Components/group-content'
import ButtonQuestion from '~/common/components/Exercise/Details/ButtonQuestion'
import Skill from './Skill'

let curDragAnswers = []
let dragSelectedAnswers = []

let dragSelected = []

function ExamResult() {
	const router = useRouter()
	const dispatch = useDispatch()

	// console.log('----------------------- curDragAnswers: ', curDragAnswers)

	const user = useSelector((state: RootState) => state.user.information)

	// const totalPoint = useSelector((state: RootState) => state.globalState.packageTotalPoint)

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
		if (!!router?.query?.test && !!user) {
			getInfo()
		}
	}, [router, user])

	// GET thông tin của cái bài này
	async function getInfo() {
		try {
			const res = await examResultApi.getByID(parseInt(router?.query?.test + ''))
			if (res.status == 200) {
				//  Mọi thứ phải bắt đầu từ khúc này. Nếu bị block thì không làm gì cả
				setTestInfo(res.data.data)

				getOverview()
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

	useEffect(() => {
		console.log('--- dragAns: ', dragAns)
	}, [dragAns])

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
			ShowNostis.success(`Đang phát audio: ${curAudio?.Name}`)
		}
	}, [curAudio])

	// ---------------------------------------

	const [overview, setOverview] = useState(null)

	async function getOverview() {
		try {
			const response: any = await examResultApi.getOverView({ ieltsExamResultId: parseInt(router?.query?.test + '') })
			if (response.status == 200) {
				setOverview(response.data.data)
				// setSkills(response.data.data?.IeltsSkills)
				// dispatch(setSuperOverview(response.data.data))
				// if (response.data.data?.IeltsSkills?.length > 0) {
				// 	setCurrentSkill(response.data.data?.IeltsSkills[0])
				// }
			} else {
				setOverview(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
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
				</div>

				<div className="flex-1 flex relative">
					<MainAudioPlayer
						curAudio={curAudio}
						showAudioControl={showAudioControl}
						setShowAudioControl={setShowAudioControl}
						curSection={currentSection}
						curSkill={currentSkill}
					/>

					<div className="w-full">
						<div className="nr-top-info w-full">
							<div className="nr-top-item">
								<div className="the-icon-wrapper">
									<FaUserGraduate size={26} className="result-icon" />
								</div>
								<div className="nr-title">
									<h1>Học viên</h1>
									<h2>{overview?.StudentName || '---- ----'}</h2>
								</div>
							</div>

							<div className="nr-top-item --clock">
								<div className="the-icon-wrapper">
									<AiFillClockCircle size={28} className="result-icon" />
								</div>
								<div className="nr-title">
									<h1>Thời gian đề: {overview?.Time} phút</h1>
									<h2>Thời gian làm: {overview?.TimeSpent || 1} phút</h2>
								</div>
							</div>
						</div>

						<div className="nr-top-info">
							<div className="nr-top-item --info">
								<div className="the-icon-wrapper">
									<FaFileSignature size={26} className="result-icon" />
								</div>
								<div className="nr-title">
									<h3 className="!text-[20px]">Tổng số câu: {overview?.QuestionsAmount || ''}</h3>
									<h2 className="!text-[18px]">Trắc nghiệm: {overview?.QuestionMultipleChoiceAmount || ''}</h2>
									<h2 className="!text-[18px] !mb-0">Tự luận: {overview?.QuestionEssayAmount || ''}</h2>
								</div>
							</div>

							<div className="nr-top-item --result">
								<div className="the-icon-wrapper">
									<FaFileMedicalAlt size={28} className="result-icon" />
								</div>

								<div className="nr-title">
									<h3 className="!text-[20px]">Tổng điểm trắc nghiệm: {overview?.Point || ''}</h3>
									<h2 className="!text-[18px]">
										Câu đúng: {overview?.QuestionsMultipleChoiceCorrect || ''}
										{/* - Tỉ lệ: {overview?.MultipleChoiceCorrectPercent}% */}
									</h2>
									<h2 className="!text-[18px] !mb-0">Điểm: {overview?.MyPoint || ''}</h2>
								</div>
							</div>
						</div>

						<div className="renew-sec">
							<div className="teacher-note">
								<h4>Nhận xét của GV</h4>
								<div className="vir-h"></div>
								<div>{!overview?.Note ? 'Không có nhận xét' : htmlParser(overview?.Note)}</div>
							</div>

							<h1 className="result-h1-title">Tổng quan kết quả</h1>

							{/* <div className="btn btn-primary mt-[16px] btn-view-detail">
								{!loading ? <AiOutlineEye size={20} /> : <Spin className="loading-base" style={{ marginBottom: -2, marginLeft: 0 }} />}
								<div className="ml-[4px]">Xem chi tiết</div>
							</div> */}

							<div className="new-sections">
								{!!overview?.IeltsSkillResultOverviews &&
									overview?.IeltsSkillResultOverviews.map((section: any, index) => {
										return (
											<Skill
												key={`sec-${index}`}
												index={index}
												data={section}
												visible={currentSection?.ExamTopicSectionId !== section?.ExamTopicSectionId}
												toggle={setCurrentSection}
											/>
										)
									})}
							</div>
						</div>
					</div>
				</div>

				{/* {loadingGroup && (
					<div className="bg-[rgba(0,0,0,0.1)] all-center rounded-[6px] absolute top-0 left-0 w-full h-full">
						<div className="text-[#000] font-[500]">Đang xử lý...</div>
					</div>
				)} */}
			</div>
		</ExamProvider>
	)
}

export default ExamResult
