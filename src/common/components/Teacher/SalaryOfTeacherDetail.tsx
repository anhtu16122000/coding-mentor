import React, { useState, useEffect } from 'react'
import { Tooltip, Modal } from 'antd'
import { parseToMoney } from '~/common/utils/common'
import { teacherSalaryApi } from '~/api/teacher-salary'
import PrimaryTable from '~/common/components/Primary/Table'
// import { useWrap } from '~/src/context/wrap'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

const SalaryOfTeacherDetail = ({ price, record }) => {
	const [visible, setVisible] = useState(false)
	const [dataSource, setDataSource] = useState<ITeacherSalaryDetail[]>([])
	// const { showNoti, pageSize } = useWrap()
	const defaultParams = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		sortType: true,
		SalaryOfTeacherID: record.ID
	}

	const getNum = (num) => {
		return num < 10 ? '0' + num : num
	}

	const getStrDate = (date) => {
		const nDate = new Date(date)
		return getNum(nDate.getDate()) + '-' + getNum(nDate.getMonth() + 1) + '-' + nDate.getFullYear()
	}

	const columns = [
		{
			title: 'Giáo viên',
			dataIndex: 'TeacherName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Môn học',
			dataIndex: 'CourseName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Buổi học',
			dataIndex: 'LessonNumber',
			align: 'center',
			render: (price, record) => <p style={{ width: 70 }}>{price}</p>
		},
		{
			title: 'Ngày dạy',
			dataIndex: 'Date',
			align: 'center',
			render: (price, record) => <p style={{ width: 100 }}>{getStrDate(price)}</p>
		},
		{
			title: 'Thời gian học',
			dataIndex: 'StudyTimeName',
			render: (price, record) => <p style={{ width: 100 }}>{price}</p>
		},
		{
			title: 'Lương buổi học',
			dataIndex: 'SalaryOfLesson',
			render: (price, record) => <p style={{ width: 120 }}>{parseToMoney(price)}</p>
		}
	]

	const getDataSource = async () => {
		try {
			let res = await teacherSalaryApi.getDetail(defaultParams)
			console.log(res.data.data)
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
			if (res.status == 204) {
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
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
					<button className="custom-btn-shit">{parseToMoney(price)}</button>
				</Tooltip>
			</button>

			<Modal width={1280} title="Chi tiết lương giáo viên" visible={visible} onCancel={() => setVisible(false)} footer={false}>
				<PrimaryTable columns={columns} data={dataSource} />
			</Modal>
		</>
	)
}

export default SalaryOfTeacherDetail
