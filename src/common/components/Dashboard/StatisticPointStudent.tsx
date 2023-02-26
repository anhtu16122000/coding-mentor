import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { studentAssessmentApi } from '~/api/student-assessment'
import { transcriptApi } from '~/api/transcript'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'
import ExpandTable from '../Primary/Table/ExpandTable'

let pageIndex = 1
export const StatisticPointStudent = (props) => {
	const { idStudent } = props
	const user = useSelector((state: RootState) => state.user.information)

	function isStdent() {
		return user?.RoleId == 3
	}
	function isParents() {
		return user?.RoleId == 8
	}
	const initParameters = {
		parentIds: isParents() ? user.UserInformationId : '',
		studentIds: isParents() ? '' : user.UserInformationId,
		pageIndex: 1,
		pageSize: PAGE_SIZE
	}
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [dataTable, setDataTable] = useState([])
	const [totalRow, setTotalRow] = useState(1)

	const getStudentPoint = async (params) => {
		try {
			setLoading(true)
			const res = await transcriptApi.getStudentPoint(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (idStudent && isParents()) {
			setApiParameters({ ...apiParameters, studentIds: idStudent.toString() })
		}
	}, [idStudent])

	useEffect(() => {
		if (apiParameters.studentIds || apiParameters.parentIds) {
			getStudentPoint(apiParameters)
		}
	}, [apiParameters])

	const columns = isParents()
		? [
				{
					title: 'Học viên',
					width: 150,
					dataIndex: 'StudentModel',
					render: (text, item) => {
						const temp = item?.StudentModel ? JSON.parse(item?.StudentModel) : {}
						return <>{temp?.FullName}</>
					}
				},
				{
					title: 'Lớp',
					width: 150,
					dataIndex: 'ClassModel',
					render: (text, item) => {
						const temp = item?.ClassModel ? JSON.parse(item?.ClassModel) : {}
						return <>{temp?.Name}</>
					}
				},
				{
					title: 'Listening',
					width: 150,
					dataIndex: 'Listening'
				},
				{
					title: 'Speaking',
					width: 150,
					dataIndex: 'Speaking'
				},
				{
					title: 'Reading',
					width: 150,
					dataIndex: 'Reading'
				},
				{
					title: 'Writing',
					width: 150,
					dataIndex: 'Writing'
				}
		  ]
		: [
				{
					title: 'Lớp',
					width: 150,
					dataIndex: 'ClassModel',
					render: (text, item) => {
						const temp = item?.ClassModel ? JSON.parse(item?.ClassModel) : {}
						return <>{temp?.Name}</>
					}
				},
				{
					title: 'Listening',
					width: 150,
					dataIndex: 'Listening'
				},
				{
					title: 'Speaking',
					width: 150,
					dataIndex: 'Speaking'
				},
				{
					title: 'Reading',
					width: 150,
					dataIndex: 'Reading'
				},
				{
					title: 'Writing',
					width: 150,
					dataIndex: 'Writing'
				}
		  ]

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setApiParameters({
			...apiParameters,
			pageIndex: pageIndex
		})
	}

	const expandedRowRender = (data) => {
		return <>Ghi chú: {data?.Note}</>
	}

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalRow && totalRow}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={loading}
				dataSource={dataTable}
				columns={columns}
				expandable={expandedRowRender}
				TitleCard={<h1 className="text-2xl font-medium">Điểm số trong từng lớp</h1>}
			/>
			{/* <PrimaryTable loading={loading} total={totalRow} data={dataTable} columns={columns} /> */}
		</>
	)
}
