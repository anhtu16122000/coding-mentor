import React, { useEffect, useState } from 'react'
import NestedTable from '~/common/components/NestedTable'
// import { useWrap } from '~/src/context/wrap'
import { setPackageResultApi } from '~/api/set-package-result'
import moment from 'moment'
import { Tooltip } from 'antd'
import { EyeOutlined, FormOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { ShowNoti } from '~/common/utils'

const TestExpanded = (props) => {
	const { infoID: info, type: type, isTeacher: isTeacher } = props

	const router = useRouter()
	// const { showNoti } = useWrap()

	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [detail, setDetail] = useState<Array<IPackageHistory>>([])

	useEffect(() => {
		getData()
	}, [])

	const getData = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let response = await setPackageResultApi.getHistory(!!type ? type : 2, info?.ID)
			if (response.status == 200) {
				setDetail(response.data.data)
			}
			if (response.status === 204) {
				setDetail([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const columns = [
		{
			title: 'Đề',
			dataIndex: 'ExamTopicName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Thời gian làm',
			dataIndex: 'CreatedOn',
			render: (text) => <p className="font-weight-black">{moment(text).format('HH:mm DD/MM/YYYY')}</p>
		},
		{
			title: 'Số câu đúng',
			align: 'center',
			dataIndex: 'Correct',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Tổng câu hỏi',
			align: 'center',
			dataIndex: 'TotalQuestions',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			aling: 'center',
			render: (text, data) => {
				return (
					<>
						{data?.Status == 1 && <p className="tag blue">{text}</p>}
						{data?.Status == 2 && <p className="tag yellow">{text}</p>}
						{data?.Status == 3 && <p className="tag green">{text}</p>}
					</>
				)
			}
		},
		{
			title: '',
			render: (text, data) => {
				return (
					<>
						{!isTeacher && (
							<Tooltip title="Xem kết quả">
								<button
									onClick={() => {
										router.push({
											pathname: '/customer/service/service-test-student/detail',
											query: { slug: data.SetPackageResultID, examID: data.ExamTopicID, ExamAppointmentResultID: data.SetPackageResultID }
										})
									}}
									className="btn btn-icon edit mr-2"
								>
									<div className="font-weight-link d-flex align-items-center">
										<EyeOutlined />
									</div>
								</button>
							</Tooltip>
						)}

						{!!isTeacher && (
							<Tooltip title="Chấm bài">
								<button
									onClick={() => {
										router.push({
											pathname: '/course/exercise/result-teacher',
											query: { slug: data.SetPackageResultID, examID: data.ExamTopicID, ID: data.SetPackageResultID }
										})
									}}
									className="btn btn-icon edit"
								>
									<FormOutlined />
								</button>
							</Tooltip>
						)}
					</>
				)
			}
		}
	]

	const studentName = {
		title: 'Họ viên',
		dataIndex: 'CreatedBy',
		render: (text) => <p className="font-weight-black">{text}</p>
	}

	return (
		<NestedTable
			loading={isLoading}
			addClass="basic-header"
			dataSource={detail}
			columns={!!isTeacher ? [studentName, ...columns] : columns}
			haveBorder={true}
		/>
	)
}

export default TestExpanded
