import { Modal } from 'antd'
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
	const initParameters = { salaryId: null, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [dataTable, setDataTable] = useState([])
	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
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
		if (apiParameters) {
			getSalaryTeachingDetail(apiParameters)
		}
	}, [apiParameters])

	useEffect(() => {
		if (dataRow && dataRow?.Id) {
			setApiParameters({ ...apiParameters, salaryId: dataRow?.Id })
		}
	}, [dataRow])

	const columns = [
		{
			title: 'Giáo viên',
			dataIndex: ''
		},
		{
			title: 'Môn học',
			dataIndex: ''
		},
		{
			title: 'Buổi học',
			dataIndex: ''
		},
		{
			title: 'Ngày dạy',
			dataIndex: ''
		},
		{
			title: 'Thòi gian học',
			dataIndex: ''
		},
		{
			title: 'Lương buổi học',
			dataIndex: ''
		}
	]

	return (
		<>
			<button onClick={() => onOpen()}>
				<span className="tag green w-[100px]">{dataRow ? parseToMoney(dataRow?.TeachingSalary) : 0}</span>
			</button>
			<Modal title="Chi tiết lương giáo viên" open={visible} onCancel={onClose} footer={null} width={800}>
				<PrimaryTable data={dataTable} columns={columns} />
			</Modal>
		</>
	)
}
