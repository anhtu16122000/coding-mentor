import React, { useEffect, useState } from 'react'
import { Drawer, Modal, Switch } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { RootState } from '~/store'
import { decode, wait } from '~/common/utils/common'
import { ShowNostis, log } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import ButtonQuestion from '../ButtonQuestion'
import { MdArrowForwardIos } from 'react-icons/md'
import { BsFillGrid3X2GapFill } from 'react-icons/bs'
import htmlParser from '../../../HtmlParser'
import TestingQuestions from '../../Testing/Questions'
import { setNewCurrentGroup } from '~/store/newExamReducer'
import ExamProvider from '../../../Auth/Provider/exam'
import { QUESTION_TYPES } from '~/common/libs'
import Lottie from 'react-lottie-player'
import lottieFile from '~/common/components/json/animation_lludr9cs.json'
import { setGlobalCurGroup } from '~/store/take-an-exam'
import MainAudioPlayer from '../AudioPlayer'
import { examResultApi } from '~/api/exam/result'
import ResultDetailHeader from './Header'
import ResultDetailController from './Controller'
import { ieltsGroupResultApi } from '~/api/exam/ieltsGroupResult'
import ResultGroupContent from './Components/group-content'

let dragSelected = []

function ResultDetail() {
	const router = useRouter()
	const dispatch = useDispatch()

	const user = useSelector((state: RootState) => state.user.information)

	const [testInfo, setTestInfo] = useState(null)
	const [loading, setLoading] = useState(true)
	const [currentSkill, setCurrentSkill] = useState(null)

	const [showSkills, setShowSkills] = useState<boolean>(true)
	const [showSections, setShowSections] = useState<boolean>(true)

	const [currentQuestion, setCurrentQuestion] = useState(null)
	const [showQuestions, setShowQuestions] = useState<boolean>(true)

	const [loadingGroup, setLoadingGroup] = useState<boolean>(false)

	const [blocked, setBlocked] = useState('')

	useEffect(() => {
		getHeight()
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

	// log.Yellow('---- XX currentQuestion: ', currentQuestion)

	async function getResultQuestionGroup(runAnyway?: any) {
		log.Yellow('----------------------------------------------------------------', '')

		if (!runAnyway && !currentQuestion?.IeltsQuestionGroupResultId) {
			return
		}

		setLoadingGroup(true)
		try {
			const res = await ieltsGroupResultApi.getByID(!runAnyway ? currentQuestion?.IeltsQuestionGroupResultId : runAnyway)
			if (res.status == 200) {
				setCurGroup(res.data.data)
			} else {
				setCurGroup(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
			setLoadingGroup(false)
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
	const [questionsInSection, setQuestionsInSection] = useState([])

	async function getQuestions() {
		// GET questions in navigation
		if (currentSection?.Id) {
			try {
				const res = await examResultApi.getQuestions({ ieltsSectionResultId: currentSection?.Id })
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
				setLoading(false)
			}
		}
	}

	const [curGroup, setCurGroup] = useState<any>(null)

	useEffect(() => {
		if (!!currentQuestion?.IeltsQuestionResultId) {
			getResultQuestionGroup()
		}
	}, [currentQuestion?.IeltsQuestionResultId])

	useEffect(() => {
		if (!!currentSkill?.Id) {
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
			setCurrentSection(sections[0])
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

	function getRealID(Id) {
		const theIndex = curGroup?.IeltsQuestionResults.findIndex((question) => question?.InputId == Id)

		if (theIndex !== -1) {
			return curGroup?.IeltsQuestionResults[theIndex]?.Id
		}

		return ''
	}

	async function formatInput() {
		// log.Red('--------------------- formatInput -----------------------', '')

		const inputs: any = document.getElementsByClassName('b-in')
		const temp = [...inputs]

		if (temp.length > 0) {
			for (let i = 0; i < temp.length; i++) {
				const element = temp[i]
				const id = element.getAttribute('id')

				const realId = getRealID(id) || ''
				const indexInGroup = curGroup?.IeltsQuestionResults.findIndex((quest) => quest?.Id == realId)
				const questResult = curGroup?.IeltsQuestionResults[indexInGroup]

				const numberArs = document.getElementById(`quest-number-${realId}`)

				if (!numberArs) {
					// ------ Cái số trước ô input
					const numQuest = document.createElement('input')
					numQuest.disabled = true

					numQuest.classList.add('ex23-num-quest-container')
					numQuest.setAttribute('id', `quest-number-${realId}`)
					numQuest.value = questResult?.Index

					// Bước 5: Sử dụng insertBefore để chèn divElement trước inputElement
					temp[i].parentNode.insertBefore(numQuest, temp[i])
				}

				if (!!questResult?.IeltsAnswerResults) {
					let contentAnswerd = ''
					let myContentAnswerd = ''

					for (let el = 0; el < questResult?.IeltsAnswerResults.length; el++) {
						const element = questResult?.IeltsAnswerResults[el]

						if (is.drag) {
							if (!!element?.MyChoice) {
								myContentAnswerd = questResult?.IeltsAnswerResults[el]?.IeltsAnswerContent
							}
						} else {
							myContentAnswerd = questResult?.IeltsAnswerResults[el]?.MyIeltsAnswerContent
						}

						if (!!element?.Correct) {
							contentAnswerd = questResult?.IeltsAnswerResults[0]?.IeltsAnswerContent
						}
					}

					const innerText = `${myContentAnswerd || 'Không trả lời'} / ${contentAnswerd}`

					temp[i].value = innerText || null
					temp[i].style.maxWidth = 'unset'
					temp[i].classList.add('ex23-result-input')
					temp[i].style.width = innerText.length + 1.5 + 'ch'

					if (!questResult?.Correct) {
						temp[i].classList.add('ex23-incorrect')
					} else {
						temp[i].classList.add('ex23-correct')
					}
				}

				temp[i].disabled = true
				temp[i].classList.add(`cauhoi-${realId}`)
			}
		}
	}

	useEffect(() => {
		dragSelected = []

		if (curGroup?.Type == QUESTION_TYPES.DragDrop && curGroup?.IeltsQuestionResults.length > 0) {
			for (let i = 0; i < curGroup?.IeltsQuestionResults.length; i++) {
				const element = curGroup?.IeltsQuestionResults[i]

				if (!!element?.DoingTestDetails) {
					for (let p = 0; p < element?.IeltsAnswerResults.length; p++) {
						if (!!element?.IeltsAnswerResults[p]?.IeltsAnswerId) {
							dragSelected.push({
								timeStamp: new Date(),
								quest: element?.Id,
								ans: element?.IeltsAnswerResults[p]?.IeltsAnswerId
							})
						}
					}
				}
			}
		}

		// console.log('---- dragSelected: ', dragSelected)

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

	const [overview, setOverview] = useState(null)

	async function getOverview() {
		try {
			const response: any = await examResultApi.getOverView({ ieltsExamResultId: parseInt(router?.query?.test + '') })
			if (response.status == 200) {
				setOverview(response.data.data)
				setSkills(response.data.data?.IeltsSkillResultOverviews)
				if (response.data.data?.IeltsSkillResultOverviews?.length > 0) {
					setCurrentSkill(response.data.data?.IeltsSkillResultOverviews[0])
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

	return (
		<ExamProvider>
			<div className="exam-23-container relative">
				<div className="cc-exam-detail z-10 !w-full bg-[#fff]">
					<ResultDetailHeader
						loading={loading}
						overview={overview}
						showSettings={showSettings}
						setShowSetings={setShowSetings}
						skills={skills}
						currentSkill={currentSkill}
					/>

					<ResultDetailController
						showSkills={showSkills}
						showSections={showSections}
						loading={loading}
						skills={skills}
						setCurAudio={setCurAudio}
						currentSkill={currentSkill}
						setCurrentSkill={(event) => {
							setLoadingGroup(true)
							setCurrentSkill(event)
						}}
						onRefreshSkill={getExamSkill}
						sections={sections}
						currentSection={currentSection}
						setCurrentSection={setCurrentSection}
						setSections={setSections}
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

						<div className="flex-1 p-[16px] scrollable max-w-[1200px] mx-auto" style={{ height: mainHeight }}>
							<div id={`cauhoi-0`} />

							<ResultGroupContent is={is} curGroup={curGroup} questionsInSection={questionsInSection} />

							<TestingQuestions
								data={curGroup}
								questions={questionsInSection}
								setCurrentQuestion={setCurrentQuestion}
								getDoingQuestionGroup={getResultQuestionGroup}
								isResult={true}
								onRefresh={(e) => getResultQuestionGroup(e)}
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
									const activated = currentQuestion?.IeltsQuestionResultId == item?.IeltsQuestionResultId

									return (
										<ButtonQuestion
											key={`quest-num-${index}`}
											isActivated={activated}
											data={item}
											onClick={() => {
												const theIndex = document.getElementById(`cauhoi-${item?.IeltsQuestionResultId}`)
												const classIndex = document.getElementsByClassName(`cauhoi-${item?.IeltsQuestionResultId}`)

												if (!!theIndex) {
													theIndex.scrollIntoView({ behavior: 'smooth', block: 'center' })
												} else if (classIndex.length > 0) {
													classIndex[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
												}

												const numbers = document.getElementsByClassName('ex23-num-quest-container')

												if (numbers.length > 0) {
													for (let i = 0; i < numbers.length; i++) {
														if (numbers[i].getAttribute('id') == `quest-number-${item?.IeltsQuestionResultId}`) {
															numbers[i].classList.add('active-num')
														} else {
															numbers[i].setAttribute('class', 'ex23-num-quest-container')
														}
													}
												}

												setCurrentQuestion(item)
											}}
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

				{loadingGroup && (
					<div
						className="bg-[rgba(0,0,0,0.1)] no-select all-center rounded-[6px] fixed top-0 left-0 w-full h-full"
						style={{ zIndex: 9999999 }}
					>
						<div className="text-[#000] font-[500] text-[16px]">Đang xử lý...</div>
					</div>
				)}
			</div>
		</ExamProvider>
	)
}

export default ResultDetail
