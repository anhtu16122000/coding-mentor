import { Button, Card, Input, Space } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { studentRollUpQrCodeApi } from '~/api/studentRollUpQrCode'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import PrimaryTable from '../Primary/Table'

export const RollUpQRStudentPage = () => {
	const [loading, setLoading] = useState(false)
	const [value, setValue] = useState(null)
	const [dataTable, setDataTable] = useState([])

	const handleSubmit = async (data) => {
		try {
			setLoading(true)
			const res = await studentRollUpQrCodeApi.add(data)
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				let temp = []
				temp.push(res.data.data)
				setDataTable(temp)
			}
		} catch (error) {
			setLoading(true)
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (value) {
			const substrings = value.split('_')
			const dataSubmit = {
				StudentId: substrings?.length > 0 ? Number(substrings[0]) : null,
				ScheduleId: substrings?.length > 0 ? Number(substrings[1]) : null
			}
			handleSubmit(dataSubmit)
		}
	}, [value])
	const columns = [
		{
			title: 'Học viên',
			width: 180,
			dataIndex: 'FullName',
			render: (text) => <p className="text-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Mã',
			dataIndex: 'UserCode'
		},
		{
			title: 'Giáo viên',
			width: 180,
			dataIndex: 'TeacherName'
		},
		{
			title: 'Lớp',
			width: 180,
			dataIndex: 'ClassName'
		},
		{
			title: 'Ngày',
			width: 180,
			dataIndex: 'StartTime',
			render: (text) => <>{moment(text).format('DD/MM/YYYY')}</>
		},
		{
			title: 'Ca',
			width: 180,
			dataIndex: 'StartTime',
			render: (text, item) => (
				<>
					{moment(text).format('HH:mm')} - {moment(item?.EndTime).format('HH:mm')}
				</>
			)
		}
	]
	return (
		<Card title="Điểm danh học viên">
			<div className="w-[50%] m-[auto]">
				<Space.Compact style={{ width: '100%' }}>
					<Input placeholder="Chọn vào và quét mã QR" className="rounded-md h-[36px]" onChange={(val) => setValue(val.target.value)} />
					{/* <Button loading={loading} className="rounded-md h-[36px]" type="primary" onClick={() => handleSubmit()}>
						Điểm danh
					</Button> */}
				</Space.Compact>
			</div>
			<div className="mt-tw-4">
				<PrimaryTable
					loading={loading}
					TitleCard={
						<div className="flex ">
							<div className="title text-[18px] mr-4">Lịch sử điểm danh</div>
						</div>
					}
					Extra={
						<div className="flex ">
							<PrimaryButton type="button" background="blue" children="Làm mới" onClick={() => setDataTable([])} />
						</div>
					}
					data={dataTable}
					columns={columns}
				/>
			</div>
		</Card>
	)
}
