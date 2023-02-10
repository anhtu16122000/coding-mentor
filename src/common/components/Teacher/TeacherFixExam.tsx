import React, { useState, useEffect } from 'react'
import { Tooltip, Modal } from 'antd'
import { parseToMoney } from '~/common/utils/common'
import PrimaryTable from '~/common/components/Primary/Table'
import { teacherSalaryApi } from '~/api/teacher-salary'
import moment from 'moment'
// import { useWrap } from '~/src/context/wrap'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'

const TeacherFixExam = ({ price, record }) => {
	const [visible, setVisible] = useState(false)
	const [dataSource, setDataSource] = useState<ITeacherSalaryFixExam[]>([])
	// const { showNoti, pageSize } = useWrap()
	const defaultParams = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		sortType: true,
		selectAll: true,
		SalaryOfTeacherID: record.ID
	}

	const columns = [
		{
			title: 'Giáo viên',
			width: 150,
			dataIndex: 'TeacherName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Môn học',
			width: 100,
			dataIndex: 'SetPackageName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Buổi học',
			width: 100,
			dataIndex: 'ExamTopicName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Tên học viên',
			width: 150,
			dataIndex: 'StudentName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Thời gian chấm bài',
			width: 150,
			dataIndex: 'CreateOn',
			render: (price, record) => <p>{moment(price).format('DD-MM-YYYY')}</p>
		}
	]

	const getDataSource = async () => {
		try {
			let res = await teacherSalaryApi.getFixExam(defaultParams)
			console.log(res.data.data)
			setDataSource(res.data.data)
		} catch (error) {}
	}

	useEffect(() => {
		getDataSource()
	}, [])

	return (
		<>
			<button
				className="font-weight-primary btn btn-icon edit"
				onClick={() => {
					setVisible(true)
				}}
			>
				<Tooltip title="Xem chi tiết">
					<button className="custom-btn-shit-2">{parseToMoney(price)}</button>
				</Tooltip>
			</button>

			<Modal width={800} title="Chi tiết lương chấm bài" visible={visible} onCancel={() => setVisible(false)} footer={false}>
				<PrimaryTable columns={columns} data={dataSource} />
			</Modal>
		</>
	)
}

export default TeacherFixExam
