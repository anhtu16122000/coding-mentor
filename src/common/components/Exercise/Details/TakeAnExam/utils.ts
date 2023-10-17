import Router from 'next/router'
import { ieltsExamApi } from '~/api/IeltsExam'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { QUESTION_TYPES } from '~/common/libs'
import { ShowNostis, log } from '~/common/utils'
import { setSuperOverview } from '~/store/take-an-exam'

let focusValue = ''

// SCROLL TO ACTIVATED ITEM
export async function scrollToElement(questionId: string) {
	if (!!questionId) {
		const scrollElement = document.getElementById('scroll-tag') // Find parent tag
		const tempComments = await document.getElementById('cauhoi-0-2') // Get item list

		if (tempComments) {
			const temp = await document.getElementById(`${questionId}`) // Get node item activated
			const tamp = await document.getElementById(`cauhoi-${questionId}`) // Get node item activated
			const tomp = await document.getElementsByClassName(`cauhoi-${questionId}`) // Get node item activated

			// IeltsQuestionResultId

			let element = null

			if (temp) {
				element = temp
			}

			if (tamp) {
				element = tamp
			}

			if (tomp.length > 0) {
				element = tomp[0]
			}

			if (!!element) {
				const firstElemRect = await tempComments.getBoundingClientRect() // Get position of first item
				const elemRect = await element.getBoundingClientRect() // Get position of this item
				const offset = await (elemRect.top - firstElemRect.bottom)
				scrollElement.scroll({ top: offset, left: 0, behavior: 'smooth' }) // Documents: https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll
			}
		}
	}
}

// const numbers = document.getElementsByClassName('ex23-num-quest-container')

// if (numbers.length > 0) {
// 	for (let i = 0; i < numbers.length; i++) {
// 		if (numbers[i].getAttribute('id') == `quest-number-${item?.IeltsQuestionResultId}`) {
// 			numbers[i].classList.add('active-num')
// 		} else {
// 			numbers[i].setAttribute('class', 'ex23-num-quest-container')
// 		}
// 	}
// }

// Bỏ active câu đang active
function removeActivated(item) {
	// Câu điền từ
	const takingActivated: any = document.getElementsByClassName(`input-taking-activated`)
	const fuckingActivated: any = document.getElementsByClassName(`input-fucking-activated`)

	if ([...fuckingActivated, ...takingActivated].length > 0) {
		const tempActive = [...fuckingActivated, ...takingActivated]
		tempActive.forEach((element) => {
			element.setAttribute('class', 'b-in')
		})
	}

	// Câu True or False
	const trueFalseActivated: any = document.getElementsByClassName(`tf-active`)
	if (trueFalseActivated.length > 0) {
		const tempActive = [...trueFalseActivated]
		tempActive.forEach((element) => {
			element.setAttribute('class', 'ex-quest-tf')
		})
	}

	if (Router.asPath.includes('exam-result')) {
		const resultActivated: any = document.getElementsByClassName(`ex23-num-quest-container`)
		const fuckingTemp = [...resultActivated]
		fuckingTemp.forEach((element, i) => {
			if (fuckingTemp[i].getAttribute('id') == `quest-number-${item?.IeltsQuestionResultId}`) {
				fuckingTemp[i].classList.add('active-num')
			} else {
				fuckingTemp[i].setAttribute('class', 'ex23-num-quest-container')
			}
		})
	}
}

// Active câu hỏi hiện tại
function activeCurrentQuest(item) {
	// Câu điền từ
	const inputElement: any = document.getElementsByClassName(`b-in`)
	if (inputElement.length > 0) {
		const tempInput = [...inputElement]
		tempInput.forEach((element, index) => {
			if (element?.id == item?.InputId) {
				if (Router.asPath.includes('take-an-exam')) {
					// Đang làm bài
					tempInput[index].setAttribute('class', 'b-in input-taking-activated')
				} else {
					// Chi tiết đề và kết quả
					tempInput[index].setAttribute('class', 'b-in input-fucking-activated')
				}
			}
		})
	}

	// Câu True or False
	const trueFalseElement: any = document.getElementsByClassName(`ex-quest-tf`)
	if (trueFalseElement.length > 0) {
		const tempFalseElement = [...trueFalseElement]
		tempFalseElement.forEach((element, index) => {
			if (element?.id == `quest-num-${item?.IeltsQuestionId}`) {
				tempFalseElement[index].setAttribute('class', 'ex-quest-tf tf-active')
			}
		})
	}
}

// Gọi khi nhấn vào 1 câu hỏi
export function handleClickQuest(item, callBack: Function) {
	log.Yellow('------- handleClickQuest: ', item)

	let temp = null
	const trueFalseActivated: any = document.getElementsByClassName(`tf-active`)
	if (trueFalseActivated.length > 0) {
		const tempActive = [...trueFalseActivated]
		tempActive.forEach((element) => {
			temp = element?.id
		})
	}

	if (temp !== `quest-num-${item?.IeltsQuestionId}`) {
		if (!!window && window?.innerWidth < 750) {
			// Trường hợp màn hình nhỏ, cho điện thoại
			const theIndex = document.getElementById(`cauhoi-${item?.IeltsQuestionId}`)
			const classIndex = document.getElementsByClassName(`cauhoi-${item?.IeltsQuestionId}`)

			if (!!theIndex) {
				theIndex.scrollIntoView({ behavior: 'smooth', block: 'center' })
			} else if (classIndex.length > 0) {
				classIndex[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
		} else {
			// Trường hợp màn hình lớn
			scrollToElement(item?.InputId || item?.IeltsQuestionId || item?.IeltsQuestionResultId)
		}
	}

	// Bỏ active câu đang active
	removeActivated(item)

	// Active câu hỏi hiện tại
	activeCurrentQuest(item)

	if (temp !== `quest-num-${item?.IeltsQuestionId}`) {
		// Focus dô câu hiện tại
		const thisInput = document.getElementById(item?.InputId)
		if (thisInput) {
			thisInput.focus()
		}
	}

	callBack(item) // Gán câu hỏi thành câu hiện tại để xử lý
}

export async function getOverview(
	examId,
	dispatch,
	setOverview: Function,
	setSkills: Function,
	setCurrentSkill: Function,
	setBlocked: Function,
	setLoading: Function
) {
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

export function getRealID(curGroup, Id) {
	const theIndex = curGroup?.IeltsQuestions.findIndex((question) => question?.InputId == Id)

	if (theIndex !== -1) {
		return curGroup?.IeltsQuestions[theIndex]?.Id
	}

	return ''
}

export function getQuestIndex(questionsInSection, Id) {
	const theIndex = questionsInSection.findIndex((question) => question?.IeltsQuestionId == Id)

	if (theIndex !== -1) {
		return questionsInSection[theIndex]
	}

	return ''
}

let curDragAnswers = []

//
export async function formatInput(
	questions,
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
) {
	log.Yellow('-------------------------------- formatInput --------------------------------', '')

	const is = {
		typing: curGroup?.Type == QUESTION_TYPES.FillInTheBlank,
		drag: curGroup?.Type == QUESTION_TYPES.DragDrop
	}

	const inputs: any = document.getElementsByClassName('b-in')
	const temp = [...inputs]

	log.Red('ĐÃ CHẠY HẾT khúc lấy input', { inputs, is })

	if (temp.length > 0) {
		for (let i = 0; i < temp.length; i++) {
			log.Red('ĐÃ CHẠY FOR CỦA TYPING', temp[i])

			const element = temp[i]
			const id = element.getAttribute('id')

			const realId = getRealID(curGroup, id) || ''
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

				temp[i].setAttribute('placeholder', `(${getQuestIndex(questions, realId).Index})`)
				temp[i].disabled = false
				temp[i].classList.add(`cauhoi-${realId}`)
				temp[i].classList.add(`the-ex-item`)
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
					focusValue = event.target.value

					event.target.style.border = '1px solid #1b73e8'
					setCurrentQuestion({ ...currentQuestion, IeltsQuestionId: realId, InputId: temp[i]?.id })
				})

				temp[i].addEventListener('blur', (event) => {
					event.target.style.border = '1px solid #ebebeb'
					if (!!event.target.value && focusValue !== event.target.value) {
						handleAnswerTyping(realId, event.target.value)
					}
				})
			}
		}
	}

	// --------
	log.Red('ĐÃ CHẠY HẾT TYPING', '')

	if (is.drag) {
		// --------
		log.Red('ĐÃ CHẠY DÔ is.drag', '')

		let tamp = []

		for (let iQuest = 0; iQuest < curGroup?.IeltsQuestions.length; iQuest++) {
			const element = curGroup?.IeltsQuestions[iQuest]

			element?.IeltsAnswers.forEach((i, j) => {
				tamp.push({ aNum: j, ...{ ...element?.IeltsAnswers[j], Question: { ...element } } })
			})
		}

		curDragAnswers = tamp

		setDragAns(tamp)

		// -----------------------------------------------------

		for (let i = 0; i < temp.length; i++) {
			const element = temp[i]

			const id = element.getAttribute('id')
			const createSelect = document.createElement('select')

			const realId = getRealID(curGroup, id) || ''

			createSelect.classList.add('b-in')

			createSelect.setAttribute('id', id)
			createSelect.classList.add(`cauhoi-${realId}`)

			const createOptionDefault = document.createElement('option')
			createOptionDefault.setAttribute('value', '0')
			createOptionDefault.textContent = 'Chọn đáp án'
			createSelect.appendChild(createOptionDefault)

			createSelect.style.maxWidth = 'unset'

			createSelect.addEventListener('click', (event) => {
				setCurrentQuestion({ ...currentQuestion, IeltsQuestionId: realId, InputId: temp[i]?.id })
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
					} catch (error) {}
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

			console.log('------------------------- curDragAnswers: ', curDragAnswers)

			for (let p = 0; p < curDragAnswers.length; p++) {
				const element = curDragAnswers[p]

				const findAnsId = dragSelected.findIndex((thisAns) => thisAns?.ans == element?.Id)

				// console.log('--- findAnsId: ', findAnsId)

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
