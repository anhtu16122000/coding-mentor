import { Input, Modal, Spin } from 'antd'
import React, { useState } from 'react'
import { FaRegCheckSquare } from 'react-icons/fa'
// import { examAppointmentResultApi } from '~/apiBase'
// import { homeworkPonimentApi } from '~/apiBase/course-detail/home-work-pontment'
// import { courseExamResultApi } from '~/apiBase/package/course-exam-result'
// import { packageResultDetailApi } from '~/apiBase/package/package-result-detail'
// import { useDoneTest } from '~/context/useDoneTest'
// import { useWrap } from '~/context/wrap'
import Lottie from 'react-lottie-player'

// import warning from '~/components/json/100468-warning.json'

const DoneMarkingExam = (props) => {
	const { onDoneMarking, isMarked, type, detailResult } = props
	// const { dataMarking, getDataMarking } = useDoneTest()
	// const { showNoti } = useWrap()
	const [loading, setLoading] = useState(false)
	const [checkDone, setCheckDone] = useState(false)
	const [note, setNote] = useState('')

	const [isModalVisible, setIsModalVisible] = useState(false)

	const showModal = () => {
		checkDoneMark()
		setIsModalVisible(true)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	const remakeData = () => {
		// let dataSubmit = null
		// switch (type) {
		// 	case 'test':
		// 		let dataTest = {
		// 			ExamAppointmentResultID: null,
		// 			Note: '',
		// 			examAppointmentExerciseStudentList: []
		// 		}
		// 		dataTest.ExamAppointmentResultID = dataMarking.SetPackageResultID
		// 		dataTest.Note = dataMarking.Note
		// 		dataTest.examAppointmentExerciseStudentList = [...dataMarking.setPackageExerciseStudentsList]
		// 		dataSubmit = { ...dataTest }
		// 		break
		// 	case 'check':
		// 		let dataCheck = {
		// 			CourseExamresultID: dataMarking.SetPackageResultID,
		// 			Note: dataMarking.Note,
		// 			courseExamExerciseStudentList: [...dataMarking.setPackageExerciseStudentsList]
		// 		}
		// 		dataSubmit = { ...dataCheck }
		// 		break
		// 	case 'homework':
		// 		let dataHW = {
		// 			HomeworkResultID: dataMarking.SetPackageResultID,
		// 			Note: dataMarking.Note,
		// 			homeworkExerciseStudenttList: [...dataMarking.setPackageExerciseStudentsList]
		// 		}
		// 		dataSubmit = { ...dataHW }
		// 		break
		// 	default:
		// 		dataSubmit = { ...dataMarking }
		// 		break
		// }
		// return dataSubmit
	}

	const handleMarkingExam = async () => {
		setLoading(true)
		let dataSubmit = remakeData()

		// console.log('Data Submit: ', dataMarking)

		let res = null

		// try {
		// 	switch (type) {
		// 		case 'test':
		// 			res = await examAppointmentResultApi.updatePoint({ ...dataSubmit, Note: note })
		// 			break
		// 		case 'check':
		// 			res = await courseExamResultApi.updatePoint({ ...dataSubmit, Note: note })
		// 			break
		// 		case 'homework':
		// 			res = await homeworkPonimentApi.update({ ...dataSubmit, Note: note })
		// 			break
		// 		default:
		// 			res = await packageResultDetailApi.updatePoint({ ...dataSubmit, Note: note })
		// 			break
		// 	}

		// 	if (res.status == 200) {
		// 		showNoti('success', 'Hoàn tất chấm bài')
		// 		onDoneMarking && onDoneMarking()
		// 		setIsModalVisible(false)
		// 		setNote('')
		// 	}
		// } catch (error) {
		// 	showNoti('danger', error.message)
		// } finally {
		// 	setLoading(false)
		// }
	}

	function checkDoneMark() {
		let temp = true
		for (let i = 0; i < detailResult.length; i++) {
			for (let e = 0; e < detailResult[i]?.SetPackageExerciseStudent.length; e++) {
				if (detailResult[i]?.SetPackageExerciseStudent[e].SkillID == 4 || detailResult[i]?.SetPackageExerciseStudent[e].SkillID == 2) {
					let item = detailResult[i]?.SetPackageExerciseStudent[e]
					if (!item?.EssayPoint) {
						temp = false
					}
				}
			}
		}
		setCheckDone(temp)
	}

	return (
		<>
			<button className="btn btn-success btn-done-all-marks" onClick={showModal}>
				<FaRegCheckSquare className="mr-2" size={18} />
				Hoàn thành chấm bài
			</button>

			<Modal title="Hoàn thành chấm bài" width={500} footer={null} visible={isModalVisible} onCancel={handleCancel}>
				{!!isMarked && (
					<p className="mb-0" style={{ fontWeight: 500, fontSize: 16, textAlign: 'center' }}>
						Đề thi này đã được chấm. <br /> Bạn chỉ được chấm lại khi có yêu cầu của học viên
					</p>
				)}

				{!isMarked && !checkDone ? (
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
						{/* <Lottie loop animationData={warning} play style={{ width: 200, height: 200, marginTop: -20 }} /> */}
						<p className="mb-0" style={{ fontWeight: 500, fontSize: 16, textAlign: 'center' }}>
							<p style={{ color: '#E53935', marginBottom: 8, fontSize: 20, fontWeight: 700 }}>Còn câu chưa chấm</p>
							<p>Vui lòng chấm hết số câu còn lại</p>
						</p>
					</div>
				) : (
					<>
						<p className="w-100" style={{ fontWeight: 500, fontSize: 14, textAlign: 'left', marginBottom: 8 }}>
							Vui lòng nhập nội dung nhận xét
						</p>

						<Input.TextArea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							rows={4}
							placeholder="Nhập nhận xét"
							style={{ marginBottom: 8 }}
						/>

						<button className="btn btn-success w-100 mt-3" onClick={handleMarkingExam}>
							<FaRegCheckSquare className="mr-2" size={18} />
							Hoàn thành chấm bài
							{loading && <Spin className="loading-base" />}
						</button>
					</>
				)}
			</Modal>
		</>
	)
}

export default DoneMarkingExam
