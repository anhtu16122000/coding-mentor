import { Collapse, Empty } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { rollUpApi } from '~/api/rollup'
import { studentInClassApi } from '~/api/student-in-class'
import PrimaryTable from '~/common/components/Primary/Table'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'

const { Panel } = Collapse

type ITabClassList = {
	StudentDetail: IUserResponse
}
let pageIndex = 1
export const TabClassList: React.FC<ITabClassList> = ({ StudentDetail }) => {
	const [loading, setLoading] = useState({ type: '', status: false })
	const [currentPage, setCurrentPage] = useState(1)
	const [loadingRollUp, setLoadingRollUp] = useState(false)
	const initParameters = { studentIds: StudentDetail.UserInformationId, pageIndex: 1, pageSize: 9999 }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [data, setData] = useState([])
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])

	const getRollUp = async (params) => {
		try {
			setLoadingRollUp(true)
			const res = await rollUpApi.getRollUpStudent(params)
			if (res.status === 200) {
				const temp = res.data.data?.map((item) => {
					return { ...item, ScheduleModel: JSON.parse(item?.ScheduleModel) }
				})
				setDataTable(temp)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			setLoadingRollUp(true)
		} finally {
			setLoadingRollUp(false)
		}
	}

	const onChange = (value) => {
		getRollUp({ classId: Number(value), scheduleId: 0, studentIds: StudentDetail.UserInformationId, pageIndex: 1, pageSize: PAGE_SIZE })
	}

	const getStudentInClass = async (Id) => {
		try {
			setLoading({ type: 'GET_ALL', status: true })
			const res = await studentInClassApi.getAll(Id)
			if (res.status === 200) {
				setData(res.data.data)
				setLoading({ type: 'GET_ALL', status: false })
			}
			if (res.status === 204) {
				setLoading({ type: 'GET_ALL', status: true })
				setData([])
			}
		} catch (error) {
			setLoading({ type: 'GET_ALL', status: true })
		} finally {
			setLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		if (StudentDetail) {
			getStudentInClass(apiParameters)
		}
	}, [StudentDetail])

	const columns = [
		{
			title: 'Ngày',
			width: 150,
			dataIndex: 'Time',
			render: (text, item) => <>{moment(item?.ScheduleModel?.StartTime).format('DD/MM/YYYY')}</>
		},
		{
			title: 'Ca',
			width: 150,
			dataIndex: 'Times',
			render: (text, item) => (
				<>
					{moment(item?.ScheduleModel?.StartTime).format('HH:mm')} - {moment(item?.ScheduleModel?.EndTime).format('HH:mm')}
				</>
			)
		},
		{
			title: 'Học lực',
			width: 150,
			dataIndex: 'LearningStatusName'
		},
		{
			title: 'Điểm danh',
			width: 150,
			dataIndex: 'StatusName'
		}
	]

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setApiParameters({
			...apiParameters,
			// ...listFieldSearch,
			pageIndex: pageIndex
		})
	}

	const expandedRowRender = (data) => <>Ghi chú: {data?.Note}</>
	return (
		<div className="custom-tab-class-list">
			{data && data?.length > 0 ? (
				<Collapse onChange={onChange} accordion>
					{data &&
						data?.length > 0 &&
						data?.map((item, index) => (
							<>
								<Panel header={item?.ClassName} key={item?.ClassId}>
									<div>
										{/* <PrimaryTable
											loading={loading}
											TitleCard={<div className="extra-table">Điểm danh</div>}
											data={dataTable}
											columns={columns}
											expand={(data) => expandRow(data)}
										/> */}
										<ExpandTable
											currentPage={currentPage}
											totalPage={totalRow && totalRow}
											TitleCard={<div className="extra-table">Điểm danh</div>}
											getPagination={(pageNumber: number) => getPagination(pageNumber)}
											loading={loading}
											// addClass="basic-header"
											dataSource={dataTable}
											columns={columns}
											expandable={expandedRowRender}
											// isResetKey={isResetKey}
										/>
									</div>
								</Panel>
							</>
						))}
				</Collapse>
			) : (
				<Empty />
			)}
		</div>
	)
}
