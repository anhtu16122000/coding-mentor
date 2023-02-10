import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import Lottie from 'react-lottie-player'

import PrimaryButton from '~/common/components/Primary/Button'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { ShowNoti } from '~/common/utils'
import { examResultApi } from '~/api/exam-result'
import { useRouter } from 'next/router'

import done from '~/common/components/json/114437-done.json'
import timeUp from '~/common/components/json/6640-times-up.json'

var submitInterval = null

const ModalTimeOut = (props) => {
	const { visible, setVisible } = props

	const listQuestionID = useSelector((state: RootState) => state.testingState.listQuestionID)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const finalData = useSelector((state: RootState) => state.testingState.data)

	const [loading, setLoading] = useState(false)
	const [submited, setSubmited] = useState(false)

	const [count, setCount] = useState(5)
	const [countSubmit, setCountSubmit] = useState(10)

	const router = useRouter()

	useEffect(() => {
		if (!!visible) {
			countDownSubmit()
		}
	}, [visible])

	function countDown() {
		let distance = 5
		var x = setInterval(function () {
			setCount(distance)
			distance = distance - 1
			if (distance < 0) {
				clearInterval(x)
				!!window && window.close()
			}
		}, 1000)
	}

	function countDownSubmit() {
		let distance = 10
		submitInterval = setInterval(function () {
			setCountSubmit(distance)
			distance = distance - 1

			if (distance < 0) {
				submitData()
			}
		}, 1000)
	}

	async function submitData() {
		clearInterval(submitInterval)
		const DATA_SUBMIT = {
			LessonVideoId: router.query?.LessonVideoId !== 'null' ? parseInt(router.query?.LessonVideoId + '') : 0,
			ExamId: parseInt(router.query?.slug + ''),
			Items: finalData
		}
		console.log('Submit Data: ', DATA_SUBMIT)
		setLoading(true)
		try {
			const response = await examResultApi.submit(DATA_SUBMIT)
			if (response.status === 200) {
				setSubmited(true)
				countDown()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Modal footer={null} closable={false} centered visible={!submited && visible} onCancel={() => {}}>
				{listQuestionID.length !== answered.length && (
					<div className="flex flex-col w-full items-center">
						<Lottie loop animationData={timeUp} play className="inner w-[200px] mx-auto" />
						<div className="text-[22px] font-[600] mt-3 text-[#e22c2c]">Đã hết giờ làm bài</div>
						<div className="mt-2 text-[18px] font-[500]">
							Hệ thống sẽ tự nộp bài sau <span className="text-[#e22c2c]">{countSubmit} giây</span>
						</div>
					</div>
				)}

				<div className="w-full flex justify-center mt-5">
					<PrimaryButton loading={loading} onClick={submitData} className="ml-3" background="blue" type="button">
						<IoPaperPlaneOutline size={18} className="mr-2" /> Nộp ngay
					</PrimaryButton>
				</div>
			</Modal>

			<Modal footer={null} closable={false} centered visible={submited} onCancel={() => {}}>
				<div className="flex flex-col w-full items-center">
					<Lottie loop animationData={done} play className="inner w-[240px] mx-auto" />
					<div className="text-[22px] font-[600] mt-3">
						Nộp bài <span className="text-[#26ad60] font-[700]">thành công!</span>
					</div>
					<div className="mt-3 text-[18px] font-[400]">Trang này sẽ tự đóng sau {count} giây</div>
				</div>
			</Modal>
		</>
	)
}

export default ModalTimeOut
