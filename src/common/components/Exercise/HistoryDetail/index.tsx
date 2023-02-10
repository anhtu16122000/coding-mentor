import React, { useEffect, useState } from 'react'
import { Card, Drawer } from 'antd'
import { ShowNoti } from '~/common/utils'
import { useDispatch } from 'react-redux'
import { setCurrentPackage, setTotalPoint } from '~/store/globalState'
import { useRouter } from 'next/router'
import SectionStudentContainer from './Section'
import { setActivating, setListQuestionID } from '~/store/testingState'
import Navigator from './Navigator'
import IconButton from '../../Primary/IconButton'
import { examResultApi } from '~/api/exam-result'
import moment from 'moment'
import { decode } from '~/common/utils/super-functions'
import TestingHeader from '../Testing/Header'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import ContentTitle from '../ContentTitle'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'

let isResizing = false

function HistoryDetail() {
	const router = useRouter()

	const { exam } = router?.query

	const dispatch = useDispatch()

	const [thisPoint, setThisPoint] = useState({ point: 0, pass: 0 })

	useEffect(() => {
		if (!!exam) {
			const queryData = JSON.parse(decode(exam))
			setThisPoint({ point: queryData?.point, pass: queryData?.pass })
			getDetail(queryData?.exam)
		}
	}, [exam])

	async function initSubmitData(param) {
		console.time('-- Init Submit Data')
		let tempQuestions = []
		let tempQuestionsID = []

		param.forEach((element) => {
			const exerciseGroups = element?.ExerciseResultGroups || []
			exerciseGroups.forEach((element) => {
				const exercises = element?.ExerciseResults || []
				exercises.forEach((element) => {
					tempQuestions.push({ ExerciseId: element?.Id, Answers: [] })
					tempQuestionsID.push(element?.Id)
				})
			})
		})

		dispatch(setListQuestionID(tempQuestionsID))
		dispatch(setActivating(tempQuestionsID.length > 0 ? tempQuestionsID[0] : null))
		console.timeEnd('-- Init Submit Data')
	}

	async function getDetail(id) {
		try {
			console.time('-- get api/Exam/Detail mất')
			const response = await examResultApi.getByID(parseInt(id))
			console.timeEnd('-- get pi/Exam/Detail mất')

			if (response.status === 200) {
				dispatch(setCurrentPackage(response.data.data))
				initSubmitData(response.data.data)
			} else {
				dispatch(setCurrentPackage([]))
				dispatch(setTotalPoint(0))
				initSubmitData([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	const [visibleMenu, setVisibleMenu] = useState(false)

	const currentSection = useSelector((state: RootState) => state.globalState.currentSection)
	const currentGroup = useSelector((state: RootState) => state.globalState.currentGroup)

	// ----------------------------------------------------------------

	function onMouseDown(e) {
		isResizing = true

		var left = document.getElementById('left_panel')
		left.style.transitionDuration = 0 + 'ms'
	}

	useEffect(() => {
		var masterContent = document.getElementById('content-container')
		var container = document.getElementById('container')
		var left = document.getElementById('left_panel')
		var right = document.getElementById('right_panel')

		var content = document.getElementById('testing-content')

		document.onmousemove = function (e) {
			if (!isResizing) {
				return
			}

			var offset = e.clientX - container.offsetLeft

			if (offset < 50 && !!content) {
				masterContent.style.display = 'none'
			} else if (!!content) {
				masterContent.style.display = 'block'
			}

			if (offset < container.clientWidth / 1.5) {
				right.style.left = offset + 'px'
				left.style.width = offset + 'px'
			}
		}

		if (!!left) {
			document.onmouseup = function (e) {
				isResizing = false
				var left = document.getElementById('left_panel')
				left.style.transitionDuration = 300 + 'ms'
			}
		}
	}, [])

	return (
		<>
			<div key="card-testing" className="h-[100vh]">
				<div className="h-full flex flex-col items-stretch">
					<TestingHeader
						title={`Thời gian làm: ${moment(router.query?.CreatedOn).format('HH:mm - DD/MM/YYYY')}`}
						totalPoint={thisPoint?.point}
						passPoint={thisPoint?.pass}
						onClickMenu={() => setVisibleMenu(true)}
						hideTime
					/>

					<div className="flex flex-row flex-auto min-h-0">
						<div className="flex flex-col items-stretch min-h-0 cc-custom-flex">
							<div className="chau-resizer min-h-0">
								<div id="container" className="relative">
									<div id="left_panel">
										<div className="flex-1 flex flex-col relative min-h-0 overflow-x-hidden py-[8px] overflow-y-auto chau-custom-scrollbar">
											<div id="content-container" className="px-[16px] duration-300">
												{!!currentSection && <ContentTitle item={currentSection} type="section" />}
												<div id="testing-content" className="flex flex-col mb-[16px]" />

												{!!currentGroup && <ContentTitle item={currentGroup} type="group" />}
												<div id="testing-group-content" className="flex flex-col mb-[16px]" />
											</div>
										</div>

										<div id="drag" onMouseDown={onMouseDown}>
											<div className="bg-[#000] w-[1px] h-[14px]"></div>
											<div className="bg-[#000] w-[1px] h-[14px] ml-[2px]"></div>
										</div>
									</div>

									<div id="right_panel">
										<div className="flex-initial px-[16px] min-h-0 overflow-x-hidden overflow-y-auto chau-custom-scrollbar">
											<SectionStudentContainer onRefresh={getDetail} />
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="cc-right-nav">
							<div className="flex-initial min-h-0 overflow-x-hidden overflow-y-auto h-full">
								<div className="min-h-[100%] flex-col bg-[#fff] ml-[4px] hidden w800:!flex">
									<Navigator />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Drawer
				width={350}
				className="block w800:!hidden"
				title="Danh sách câu hỏi"
				placement="right"
				onClose={() => setVisibleMenu(false)}
				open={visibleMenu}
			>
				<div className="mx-[-10px]">
					<Navigator />
				</div>
			</Drawer>
		</>
	)
}

export default HistoryDetail
