import { Modal } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import Lottie from 'react-lottie-player'

import PrimaryButton from '~/common/components/Primary/Button'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { ShowNoti } from '~/common/utils'
import { examResultApi } from '~/api/exam-result'
import { useRouter } from 'next/router'

import warning from '~/common/components/json/100468-warning.json'
import done from '~/common/components/json/114437-done.json'
import submitted from '~/common/components/json/83330-flying-plane.json'
import { decode } from '~/common/utils/super-functions'

const ModalSubmit = (props) => {
	const { visible, setVisible } = props

	const listQuestionID = useSelector((state: RootState) => state.testingState.listQuestionID)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const finalData = useSelector((state: RootState) => state.testingState.data)

	const [loading, setLoading] = useState(false)
	const [submited, setSubmited] = useState(false)

	const [count, setCount] = useState(5)

	const router = useRouter()

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

	async function submitData() {
		const DATA_SUBMIT = {
			LessonVideoId: router.query?.video !== 'null' ? parseInt(decode(router.query?.video + '')) : 0,
			ExamId: parseInt(decode(router.query?.exam + '')),
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
			<Modal footer={null} closable={false} centered visible={!submited && visible} onCancel={() => setVisible(false)}>
				{listQuestionID.length !== answered.length && (
					<div className="flex flex-col w-full items-center">
						<Lottie loop animationData={warning} play className="inner w-[180px] mx-auto" />
						<div className="text-[22px] font-[600] mt-3">
							Bạn còn <span className="text-[#f81c1c] font-[700]">{listQuestionID.length - answered.length}</span> câu chưa hoàn thành
						</div>
						<div className="mt-2 text-[18px] font-[500]">Bạn có muốn nộp không?</div>
					</div>
				)}

				{listQuestionID.length == answered.length && (
					<div className="flex flex-col w-full items-center">
						<Lottie loop animationData={submitted} play className="inner w-[300px] my-[-20px] mx-auto" />
						<div className="text-[22px] font-[600] mt-[-20px] mb-[-10px]">
							Bạn muốn <span className="text-[#26ad60] font-[700]">nộp bài</span> ngay không?
						</div>
					</div>
				)}

				<div className="w-full flex justify-center mt-5">
					<PrimaryButton disable={loading} onClick={() => setVisible(false)} background="red" icon="cancel" type="button">
						Huỷ
					</PrimaryButton>
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

export default ModalSubmit
