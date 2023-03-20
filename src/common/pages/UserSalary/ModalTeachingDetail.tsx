import { Modal } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { staffSalaryApi } from '~/api/staff-salary'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { parseToMoney } from '~/common/utils/common'
type IModalTeachingDetail = {
	dataRow: any
}
export const ModalTeachingDetail: React.FC<IModalTeachingDetail> = ({ dataRow }) => {
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const initParameters = { salaryId: dataRow?.Id, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [dataTable, setDataTable] = useState([])
	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		getSalaryTeachingDetail(apiParameters)
		setVisible(true)
	}

	const getSalaryTeachingDetail = async (params) => {
		try {
			setIsLoading(true)
			const res = await staffSalaryApi.getTeachingDetail(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setIsLoading(false)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			setIsLoading(true)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (dataRow && dataRow?.Id) {
			setApiParameters({ ...apiParameters, salaryId: dataRow?.Id })
		}
	}, [dataRow])

	const columns = [
		{
			title: 'Lớp học',
			width: 180,
			dataIndex: 'ClassName'
		},
		{
			title: 'Phòng học',
			width: 100,
			dataIndex: 'RoomName'
		},
		{
			title: 'Ngày dạy',
			width: 100,
			dataIndex: 'StartTime',
			render: (text) => <>{moment(text).format('MM-DD-YYYY')}</>
		},
		{
			title: 'Thòi gian học',
			width: 100,
			dataIndex: 'Time',
			render: (text, item) => {
				return (
					<>
						{moment(item?.StartTime).format('HH:mm')} - {moment(item?.EndTime).format('HH:mm')}
					</>
				)
			}
		},
		{
			title: 'Lương buổi học',
			width: 100,
			dataIndex: 'TeachingFee',
			render: (text) => <>{parseToMoney(text)}</>
		}
	]

	return (
		<>
			<button onClick={() => onOpen()}>
				<span className="tag green w-[100px]">{dataRow ? parseToMoney(dataRow?.TeachingSalary) : 0}</span>
			</button>
			<Modal title="Chi tiết lương giáo viên" open={visible} onCancel={onClose} footer={null} width={1200}>
				<PrimaryTable data={dataTable} columns={columns} />
			</Modal>
		</>
	)
}
