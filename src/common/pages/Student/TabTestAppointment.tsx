import React, { useEffect, useState } from 'react'
import { testAppointmentApi } from '~/api/learn/test-appointment'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { parseToMoney } from '~/common/utils/common'
import ServiceAppointmentTest from '../InfoCourse/ServiceAppointmentTest'

type ITabTestAppointment = {
	StudentDetail: IUserResponse
}
export const TabTestAppointment: React.FC<ITabTestAppointment> = ({ StudentDetail }) => {
	const [loading, setLoading] = useState(false)
	const initParameters = { studentId: StudentDetail?.UserInformationId, pageIndex: 1, pageSise: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [dataTable, setDataTable] = useState([])
	const [totalRow, setTotalRow] = useState(1)

	console.log('---- StudentDetail: ', StudentDetail)

	const getTestAppointment = async (params) => {
		try {
			setLoading(true)
			const res = await testAppointmentApi.getAll({
				...params,
				studentId: StudentDetail?.UserInformationId
			})

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
	// useEffect(() => {
	// 	if (StudentDetail) {
	// 		getTestAppointment(apiParameters)
	// 	}
	// }, [StudentDetail])

	return (
		<>
			{/* <PrimaryTable
				loading={loading}
				total={totalRow}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
				data={dataTable}
				columns={columns}
			/> */}
			<ServiceAppointmentTest student={StudentDetail} />
		</>
	)
}
