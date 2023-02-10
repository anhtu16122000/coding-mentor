import { Card, Popconfirm, Popover } from 'antd'
import React, { FC, useState } from 'react'
import { ShowNoti } from '~/common/utils'
import { examApi } from '~/api/exam'
import PrimaryButton from '../Primary/Button'
import CreateExam from './exam-form'
import { FiMoreVertical } from 'react-icons/fi'
import Router from 'next/router'
import ButtonEye from '../DirtyButton/Button-Eye'
import { encode } from '~/common/utils/super-functions'
import PrimaryTooltip from '../PrimaryTooltip'

const ExamItem: FC<IExerciseItem> = (params) => {
	const { data, onRefresh } = params

	const [loading, setLoading] = useState(false)
	const [isOpenMenu, setOpenMenu] = useState(false)

	async function deleteExercise() {
		setLoading(true)
		try {
			const response = await examApi.delete(data?.Id)
			if (response.status == 200) {
				onRefresh()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	function _viewDetail() {
		const theQuery = {
			exam: encode(data?.Id),
			name: data?.Name
		}

		Router.push({
			pathname: `/exercise`,
			query: theQuery
		})
	}

	const content = (
		<>
			<Popconfirm title="Xoá đề thi này?" okText="Xoá" cancelText="Hủy" onConfirm={deleteExercise}>
				<PrimaryButton loading={loading} className="mb-2 !w-full" type="button" background="red" icon="remove">
					Xoá
				</PrimaryButton>
			</Popconfirm>
			<CreateExam onRefresh={onRefresh} isEdit className="!w-full" defaultData={data} onOpen={() => setOpenMenu(false)} />
		</>
	)

	return (
		<Card className="cc-exam-item">
			<div className="flex items-center mt-[-5px]">
				<div>
					<PrimaryTooltip place="top" id={`it-${data?.Code}`} content={data?.Name}>
						<div onClick={_viewDetail} className="cc-exam-item-name">
							{data?.Name}
						</div>
					</PrimaryTooltip>
				</div>
				<div className="flex-1" />
				<Popover open={isOpenMenu} onOpenChange={(event) => setOpenMenu(event)} placement="bottom" content={content}>
					<FiMoreVertical className="mr-[-10px] cursor-pointer" size={20} />
				</Popover>
			</div>

			<div className="!flex mt-1">
				<div className="cc-exam-item-code">Mã đề: {data?.Code}</div>
			</div>

			<div className="cc-exam-item-info">
				<div className="mt-1">Thời gian: {data?.Time} phút</div>
				<div className="mt-1">Số câu hỏi: {data?.NumberExercise}</div>
				<div className="mt-1">Điểm sàn: {data?.PassPoint}</div>
			</div>

			<ButtonEye icon="outline" iconSize={22} className="mt-3" onClick={_viewDetail}>
				Xem chi tiết
			</ButtonEye>
		</Card>
	)
}

export default ExamItem
