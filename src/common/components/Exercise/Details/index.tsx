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

function ExamDetail() {
	const router = useRouter()
	const dispatch = useDispatch()

	const totalPoint = useSelector((state: RootState) => state.globalState.packageTotalPoint)

	const [examInfo, setExamInfo] = useState(null)
	const [loading, setLoading] = useState(true)
	const [currentSkill, setCurrentSkill] = useState(null)

	useEffect(() => {
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
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

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

	const [showSkills, setShowSkills] = useState<boolean>(true)
	const [showSections, setShowSections] = useState<boolean>(true)

	const [currentQuestion, setCurrentQuestion] = useState(null)
	const [showQuestions, setShowQuestions] = useState<boolean>(true)

	function toggleQuestions() {
		setShowQuestions(!showQuestions)
	}

	const [showSettings, setShowSetings] = useState<boolean>(false)

	return (
		<div className="h-[100vh] w-[100%] relative flex flex-col">
			<Card
				className="cc-exam-detail !w-full"
				title={
					<div className="w-full flex items-center relative">
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
				}
			>
				<div className="flex items-center">
					{loading && (
						<div className="flex items-center">
							<Skeleton active paragraph={false} style={{ width: '100px' }} />
							<Skeleton active paragraph={false} style={{ width: '50px', marginLeft: 8, marginRight: 8 }} />
							<Skeleton active paragraph={false} style={{ width: '70px' }} />
						</div>
					)}

					{showSkills && (
						<div className="flex items-center">
							<CreateExamSkill onRefresh={getExamSkill} />

							{skills.map((sk, index) => {
								return <ExamSkillItem data={sk} currentSkill={currentSkill} setCurrentSkill={setCurrentSkill} onRefresh={getExamSkill} />
							})}
						</div>
					)}
				</div>

				{showSkills && showSections && <Divider className="ant-divider-16" />}

				<div className="flex items-center">
					{loading && (
						<div className="flex items-center">
							<Skeleton active paragraph={false} style={{ width: '100px' }} />
							<Skeleton active paragraph={false} style={{ width: '50px', marginLeft: 8, marginRight: 8 }} />
							<Skeleton active paragraph={false} style={{ width: '70px' }} />
						</div>
					)}

					{showSections && (
						<div className="flex items-center">
							<CreateExamSection onRefresh={getExamSkill} />

							{sections.map((item, index) => {
								return (
									<ExamSectionItem
										key={`sec-e${index}`}
										data={item}
										currentSection={currentSection}
										setCurrentSection={setCurrentSection}
										onRefresh={getSections}
									/>
								)
							})}
						</div>
					)}
				</div>

				{!loading && skills.length == 0 && <Empty />}
			</Card>

			<div className="flex-1"></div>

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

						<div className="flex items-center">
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
