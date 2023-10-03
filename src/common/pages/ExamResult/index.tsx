import React, { useEffect, useState } from 'react'
import { Input, Modal, Spin } from 'antd'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { RootState } from '~/store'
import { ShowNostis } from '~/common/utils'
import { AiFillClockCircle, AiOutlineEye } from 'react-icons/ai'
import { FaCheck, FaFileMedicalAlt, FaFileSignature, FaUserGraduate } from 'react-icons/fa'
import { examResultApi } from '~/api/exam/result'
import ExamProvider from '~/common/components/Auth/Provider/exam'
import htmlParser from '~/common/components/HtmlParser'
import Skill from './Skill'
import ResultHeader from './Header'
import PrimaryButton from '~/common/components/Primary/Button'
import { is } from '~/common/utils/common'

function ExamResult() {
	const router = useRouter()
	const user = useSelector((state: RootState) => state.user.information)

	const [loading, setLoading] = useState(true)
	const [submitVisible, setSubmitVisible] = useState<boolean>(false)
	const [submiting, setSubmiting] = useState<boolean>(false)

	const [inputNote, setInputNote] = useState<any>('')

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
				getOverview()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const [showSettings, setShowSetings] = useState<boolean>(false)

	const [overview, setOverview] = useState(null)

	async function getOverview() {
		try {
			const response: any = await examResultApi.getOverView({ ieltsExamResultId: parseInt(router?.query?.test + '') })
			if (response.status == 200) {
				setOverview(response.data.data)
			} else {
				setOverview(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function submitAll() {
		const SUBMIT_DATA = {
			Id: parseInt(router?.query?.test + ''),
			Note: inputNote,
			Items: []
		}

		if (!submiting) {
			console.time('Gọi api nộp bài hết')

			setSubmiting(true)
			try {
				const res = await examResultApi.review({ ...SUBMIT_DATA })
				if (res.status == 200) {
					ShowNostis.success('Hoàn tất chấm bài')
					setInputNote('')
					setSubmitVisible(false)

					getInfo()
					getOverview()
				}
			} catch (error) {
			} finally {
				getOverview()
				setSubmiting(false)
				console.timeEnd('Gọi api nộp bài hết')
			}
		}
	}

	return (
		<ExamProvider>
			<div className="exam-23-container relative">
				<div className="cc-exam-detail z-10 !w-full bg-[#fff]">
					<ResultHeader overview={overview} showSettings={showSettings} setShowSetings={setShowSetings} />
				</div>

				<div className="flex-1 flex relative">
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
									<h2 className="!text-[18px]">Câu đúng: {overview?.QuestionsMultipleChoiceCorrect || ''}</h2>
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

							<div className="new-sections">
								{!!overview?.IeltsSkillResultOverviews &&
									overview?.IeltsSkillResultOverviews.map((section: any, index) => {
										return <Skill key={`sec-${index}`} index={index} data={section} />
									})}
							</div>
						</div>

						<div className="flex items-center justify-center">
							<div
								onClick={() => window.open('/exam-result/detail/?test=' + router.query?.test, '_blank')}
								className="btn btn-primary mb-[16px] btn-view-detail"
							>
								{!loading ? <AiOutlineEye size={20} /> : <Spin className="loading-base" style={{ marginBottom: -2, marginLeft: 0 }} />}
								<div className="ml-[4px]">Xem chi tiết</div>
							</div>

							{(is(user).admin || is(user).teacher) && overview?.Status != 2 && (
								<div onClick={() => setSubmitVisible(true)} className="ml-[8px] btn btn-success mb-[16px] btn-view-detail">
									{!loading ? (
										<FaCheck size={16} className="mr-[4px]" />
									) : (
										<Spin className="loading-base" style={{ marginBottom: -2, marginLeft: 0 }} />
									)}
									<div className="ml-[4px]">Hoàn thành chấm bài</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<Modal
					width={500}
					closable={false}
					open={submitVisible}
					footer={
						<div className="tae-submit-footer">
							<PrimaryButton background="red" icon="cancel" type="button" onClick={() => setSubmitVisible(false)}>
								Đóng
							</PrimaryButton>
							<PrimaryButton loading={submiting} className="ml-[8px]" background="blue" icon="cancel" type="button" onClick={submitAll}>
								{submiting ? 'Đang lưu..' : 'Hoàn thành'}
							</PrimaryButton>
						</div>
					}
				>
					<div className="">
						<div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Nhận xét</div>
						<Input.TextArea rows={5} placeholder="Nhận xét" defaultValue={inputNote} onChange={(e) => setInputNote(e.target?.value)} />
					</div>
				</Modal>
			</div>
		</ExamProvider>
	)
}

export default ExamResult
