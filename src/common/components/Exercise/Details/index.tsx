import React, { useEffect, useState } from 'react'
import { Card } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPackage, setTotalPoint } from '~/store/globalState'
import Router from 'next/router'
import SectionContainer from './Section'
import { RootState } from '~/store'
import PrimaryButton from '../../Primary/Button'
import { HiOutlineBookOpen } from 'react-icons/hi'
import PreviewExercise from '../Preview'
import { getExamDetails } from './exam-detail-utils'
import LoadingExercise from '../../Loading/ExerciseDetails'

function ExamDetail() {
	const { exam, name } = Router.query

	const dispatch = useDispatch()
	const totalPoint = useSelector((state: RootState) => state.globalState.packageTotalPoint)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!!exam) {
			getDetail()
		}
	}, [exam])

	// Get details of the exam from the exam id
	async function getDetail() {
		await getExamDetails((event) => {
			if (!!event) {
				dispatch(setCurrentPackage(event?.data))
				dispatch(setTotalPoint(event?.totalPoint))
			} else {
				dispatch(setCurrentPackage([]))
				dispatch(setTotalPoint(0))
			}
			setLoading(false)
		})
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

	return (
		<Card
			className="cc-exam-detail"
			title={
				<div className="w-full flex items-center relative">
					<div className="ml-[16px] w600:ml-[25px] flex-1 pr-2">
						<div className="cc-text-16-700 in-1-line">{name}</div>
						<div className="cc-text-14-500-blue">Tổng điểm: {totalPoint}</div>
					</div>
					<div className="mr-[16px] w600:mr-[25px] flex-shrink-0">
						{showTestButton() && (
							<PrimaryButton onClick={() => setVisiblePreview(true)} background="blue" type="button">
								<HiOutlineBookOpen className="mr-2" size={20} /> Làm thử
							</PrimaryButton>
						)}
					</div>
				</div>
			}
		>
			{loading && <LoadingExercise />}

			{!loading && (
				<div className="mx-[-15px] w600:mx-[2px]">
					<SectionContainer onRefresh={getDetail} />
					<PreviewExercise LessonVideoId={null} exam={exam} name={name} visible={visiblePreview} setVisible={setVisiblePreview} />
				</div>
			)}
		</Card>
	)
}

export default ExamDetail
