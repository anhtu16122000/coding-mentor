import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { RootState } from '~/store'
import { wait } from '~/common/utils/common'
import { ShowNostis, log } from '~/common/utils'
import { BsFillGrid3X2GapFill } from 'react-icons/bs'
import htmlParser from '../../../HtmlParser'
import TestingQuestions from '../../Testing/Questions'
import { setNewCurrentGroup } from '~/store/newExamReducer'
import { useExamContext } from '~/common/providers/Exam'
import { QUESTION_TYPES } from '~/common/libs'
import { setGlobalCurGroup } from '~/store/take-an-exam'
import MainAudioPlayer from '../AudioPlayer'
import ResultDetailHeader from './Header'
import ResultDetailController from './Controller'
import { ieltsGroupResultApi } from '~/api/exam/ieltsGroupResult'
import ResultGroupContent from './Components/group-content'
import ModalBlocked from '../../Components/ModalBlocked'
import { handleClickQuest } from '../TakeAnExam/utils'
import { RiFileList2Line } from 'react-icons/ri'
import MainAudioPlayer2 from '../AudioPlayer2'
import { TbListDetails } from 'react-icons/tb'
import ERFooter from './Footer'
import { examResultApi } from '~/api/exam/result'

let dragSelected = []

function ResultDetail() {
	const router = useRouter()
	const dispatch = useDispatch()

	const { questionsInSection, setQuestionsInSection, curAudio, setCurAudio } = useExamContext()

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
	const [showOver, setShowOver] = useState<boolean>(true)

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

	async function getResultQuestionGroup(runAnyway?: any) {
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

	const [sections, setSections] = useState([])
	const [currentSection, setCurrentSection] = useState(null)

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
		const inputs: any = document.getElementsByClassName('b-in')
		const temp = [...inputs]

		if (temp.length > 0) {
			for (let i = 0; i < temp.length; i++) {
				const element = temp[i]
				const id = element.getAttribute('id')

				const realId = getRealID(id) || ''
				const indexInGroup = curGroup?.IeltsQuestionResults.findIndex((quest) => quest?.Id == realId)
				const questResult = curGroup?.IeltsQuestionResults[indexInGroup]

				const theFuckingIndex = questionsInSection.findIndex((quest) => quest?.IeltsQuestionResultId == realId)

				const numberArs = document.getElementById(`quest-number-${realId}`)

				if (!numberArs) {
					// ------ Cái số trước ô input
					const numQuest = document.createElement('input')
					numQuest.disabled = true

					numQuest.classList.add('ex23-num-quest-container')
					numQuest.setAttribute('id', `quest-number-${realId}`)
					numQuest.value = questionsInSection[theFuckingIndex]?.Index + ''

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

		handleClickQuest(currentQuestion, setCurrentQuestion)
	}

	const [showRead, setShowRead] = useState<boolean>(false)

	useEffect(() => {
		grChanged()
		if (!showRead) {
			heightChange()
		}
	}, [showRead])

	function grChanged() {
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

		formatInput()
	}

	useEffect(() => {
		grChanged()
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

	useEffect(() => {
		if (curAudio?.Audio) {
			ShowNostis.success(`Playing: ${curAudio?.Name}`)
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

	useEffect(() => {
		if (!!currentQuestion) {
			handleClickQuest(currentQuestion, setCurrentQuestion)
		}
	}, [currentQuestion])

	return (
		<div className="exam-23-container relative">
			<div className="cc-exam-detail z-10 !w-full bg-[#fff]">
				<ResultDetailHeader
					loading={loading}
					overview={overview}
					skills={skills}
					currentSkill={currentSkill}
					showSkills={showSkills}
					showSections={showSections}
					showQuestions={showQuestions}
					setShowSkills={setShowSkills}
					setShowQuestions={setShowQuestions}
					setShowSections={setShowSections}
				/>

				<ResultDetailController
					showSkills={showSkills}
					showSections={showSections}
					loading={loading}
					skills={skills}
					currentSkill={currentSkill}
					setCurrentSkill={(event) => {
						setLoadingGroup(true)
						setCurrentSkill(event)
					}}
					currentSection={currentSection}
					setCurrentSection={setCurrentSection}
					setSections={setSections}
				/>
			</div>

			<div className="flex-1 flex relative">
				{showOver && !!window && window?.innerWidth > 749 && (
					<MainAudioPlayer
						showAudioControl={showAudioControl}
						setShowAudioControl={setShowAudioControl}
						curSection={currentSection}
						curSkill={currentSkill}
					/>
				)}

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

									{!!currentSection?.ReadingPassage && (
										<div className="flex justify-start pt-[4px]">
											<div onClick={() => setShowRead(true)} className="btn-view-passage">
												<RiFileList2Line size={14} className="mr-[4px]" />
												<div>Bài đọc</div>
											</div>
										</div>
									)}

									{!!window && window?.innerWidth < 750 && (
										<ResultGroupContent key={`d-gc-${curGroup?.Id}`} is={is} curGroup={curGroup} questionsInSection={questionsInSection} />
									)}

									{!!window && window?.innerWidth < 750 && (
										<TestingQuestions
											data={curGroup}
											isResult={true}
											onRefresh={(e) => getResultQuestionGroup(e)}
											onRefreshNav={() => {
												setNotSetCurrentQuest(true)
												getQuestions()
											}}
										/>
									)}

									{curAudio?.Audio && <div className="h-[200px]" />}
								</div>
							)}
						</>
					)}
				</>

				<>
					{showMain && <div id="the-fica-block" className="w-[0.5px] bg-transparent" />}

					<div id="scroll-tag" className="tae-right-desktop" style={{ height: mainHeight }}>
						<div id={`cauhoi-0`} />
						<div id={`cauhoi-0-2`} />

						<ResultGroupContent key={`d-gc-${curGroup?.Id}`} is={is} curGroup={curGroup} />

						<TestingQuestions
							data={curGroup}
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
				<ERFooter
					key="result-exam-footer"
					visible={showQuestions}
					testInfo={testInfo}
					questions={questionsInSection}
					onToggle={toggleQuestions}
					curQuest={currentQuestion}
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

			{loadingGroup && (
				<div
					className="bg-[rgba(0,0,0,0.1)] no-select all-center rounded-[6px] fixed top-0 left-0 w-full h-full"
					style={{ zIndex: 9999999 }}
				>
					<div className="text-[#000] font-[500] text-[16px]">Đang xử lý...</div>
				</div>
			)}
		</div>
	)
}

export default ResultDetail
