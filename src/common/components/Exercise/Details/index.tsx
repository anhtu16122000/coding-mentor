import React, { useEffect, useState } from 'react'
import { Card, Collapse, Empty } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPackage, setGlobalBreadcrumbs, setTotalPoint } from '~/store/globalState'
import Router, { useRouter } from 'next/router'
import SectionContainer from './Section'
import { RootState } from '~/store'
import PrimaryButton from '../../Primary/Button'
import { HiOutlineBookOpen } from 'react-icons/hi'
import PreviewExercise from '../Preview'
import LoadingExercise from '../../Loading/ExerciseDetails'
import { ieltsExamApi } from '~/api/IeltsExam'
import { decode, wait } from '~/common/utils/common'
import { ShowNostis } from '~/common/utils'
import { ieltsSkillApi } from '~/api/IeltsExam/ieltsSkill'
import CreateExamSkill from './ExamSkill/exam-skill-form'
import ExamSkillItem from './ExamSkill/exam-skill-item'

const { Panel } = Collapse

function ExamDetail() {
	const { exam } = Router.query

	const dispatch = useDispatch()
	const totalPoint = useSelector((state: RootState) => state.globalState.packageTotalPoint)

	const [examInfo, setExamInfo] = useState(null)

	const [loading, setLoading] = useState(true)

	const router = useRouter()

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
		if (!!exam) {
			getExanInfo()
			getExanSkill()
		}
	}, [exam])

	async function getExanInfo() {
		try {
			const res = await ieltsExamApi.getByID(parseInt(decode(exam + '')))
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
	async function getExanSkill() {
		try {
			const res = await ieltsSkillApi.getAll({ pageSize: 99, pageIndex: 1, ieltsExamId: parseInt(decode(exam + '')) })
			if (res.status == 200) {
				setSkills(res.data.data)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const roleId = useSelector((state: RootState) => state.user.information.RoleId)

	function showTestButton() {
		if (roleId == 1 || roleId == 2) {
			return true
		} else {
			return false
		}
	}

	const [visiblePreview, setVisiblePreview] = useState(false)

	const [skillSelected, setSkillSelected] = useState(null)

	const onChange = (key: string | string[]) => {
		setSkillSelected(key)
	}

	return (
		<Card
			className="cc-exam-detail !max-w-[1200px]"
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
					<CreateExamSkill className="mr-[16px]" onRefresh={getExanSkill} />
				</div>
			}
		>
			{loading && <LoadingExercise />}

			{!loading && skills.length == 0 && <Empty />}

			{!loading && skills.length > 0 && (
				<div className="mb-[-16px]">
					{skills.map((sk, index) => {
						return (
							<ExamSkillItem
								key={`sk-${index}`}
								data={sk}
								index={index}
								activeKey={[skillSelected]}
								onRefresh={getExanSkill}
								onClick={() => onChange(sk?.Id == skillSelected ? '' : sk?.Id)}
							/>
						)
					})}
				</div>
			)}
		</Card>
	)
}

export default ExamDetail
