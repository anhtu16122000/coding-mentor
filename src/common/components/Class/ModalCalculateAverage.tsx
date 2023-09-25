import { useState } from 'react'
import loadingJson from '~/assets/json/115876-calculator.json'
import Lottie from 'react-lottie-player'
import { Modal } from 'antd'
import PrimaryButton from '../Primary/Button'
import { scoreApi } from '~/api/configs/score'
import { ShowNoti } from '~/common/utils'

const ModalCalculateAverage = ({ classId, transcriptId, refreshAllGrades }: any) => {
	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	const calMediumScores = async (classId, transcriptId) => {
		setLoading(true)
		try {
			const res = await scoreApi.calcMediumScore({
				ClassId: Number(classId),
				TranscriptId: Number(transcriptId)
			})
			if (res?.status === 200) {
				ShowNoti('success', res?.data?.message)
				refreshAllGrades(classId, transcriptId)
				setVisible(false)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
		setLoading(false)
	}

	return (
		<>
			<div className="class-point-button">
				<PrimaryButton
					background="green"
					type="button"
					icon="calculate"
					disable={!Boolean(transcriptId)}
					onClick={() => {
						setVisible(true)
					}}
				>
					Tính điểm trung bình
				</PrimaryButton>
			</div>
			<Modal footer={null} width={500} open={visible} onCancel={() => setVisible(false)}>
				<Lottie loop animationData={loadingJson} play className="inner my-3 w-[250px] mx-auto" />
				<div className="flex justify-center flex-col items-center">
					<h1 className="w-full mb-[30px] text-center text-[20px] font-[700]">Bạn muốn tính điểm trung bình của học viên?</h1>
					<PrimaryButton
						background="blue"
						type="button"
						loading={loading}
						onClick={() => {
							setVisible(true)
							calMediumScores(classId, transcriptId)
						}}
					>
						Tính ngay
					</PrimaryButton>
				</div>
			</Modal>
		</>
	)
}
export default ModalCalculateAverage
