import React, { useEffect, useState } from 'react'
import { testAppointmentApi } from '~/api/test-appointment'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { parseToMoney } from '~/common/utils/common'

type ITabTestAppointment = {
	StudentDetail: IUserResponse
}
export const TabTestAppointment: React.FC<ITabTestAppointment> = ({ StudentDetail }) => {
	const [loading, setLoading] = useState(false)
	const initParameters = { studentId: StudentDetail?.UserInformationId, pageIndex: 1, pageSise: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [dataTable, setDataTable] = useState([])
	const [totalRow, setTotalRow] = useState(1)

	const getTestAppointment = async (params) => {
		try {
			setLoading(true)
			const res = await testAppointmentApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
				setLoading(false)
			}
			if (res.status === 204) {
				setLoading(true)
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		if (StudentDetail) {
			getTestAppointment(apiParameters)
		}
	}, [StudentDetail])

	const columns = [
		{
			title: 'Người tư vấn',
			width: 180,
			dataIndex: 'SaleName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Listening',
			width: 100,
			dataIndex: 'ListeningPoint',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Reading',
			width: 100,
			dataIndex: 'ReadingPoint',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Writing',
			width: 100,
			dataIndex: 'WritingPoint',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Speaking',
			width: 100,
			dataIndex: 'SpeakingPoint',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Volcabulary',
			width: 100,
			dataIndex: 'Vocab',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Học phí tư vấn',
			width: 180,
			dataIndex: 'Tuitionfee',
			render: (text) => <div className="text-right">{parseToMoney(text)}</div>
		},
		{
			title: 'Trung tâm',
			width: 180,
			dataIndex: 'BranchName'
		},
		{
			title: 'Giáo viên',
			width: 180,
			dataIndex: 'TeacherName'
		},
		{
			title: 'Trạng thái',
			width: 180,
			dataIndex: 'Status',
			render: (text, item) => (
				<>
					<PrimaryTag color={`${text == 1 ? 'red' : 'green'}`} children={item?.StatusName} />
				</>
			)
		}
	]
	return (
		<>
			<PrimaryTable
				loading={loading}
				total={totalRow}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
				data={dataTable}
				columns={columns}
			/>
		</>
	)
}
