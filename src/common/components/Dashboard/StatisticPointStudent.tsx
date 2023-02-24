import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { studentAssessmentApi } from '~/api/student-assessment'
import { transcriptApi } from '~/api/transcript'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'
import PrimaryTable from '../Primary/Table'
import ExpandTable from '../Primary/Table/ExpandTable'

let pageIndex = 1
export const StatisticPointStudent = (props) => {
	const user = useSelector((state: RootState) => state.user.information)
	const { type, idClass } = props
	const initParametersAssessment = {
		classId: idClass,
		pageIndex: 1,
		pageSize: PAGE_SIZE
	}
	const initParametersByStudentClass = {
		classId: idClass,
		studentId: user?.UserInformationId,
		pageIndex: 1,
		pageSize: PAGE_SIZE
	}
	const [apiParametersAssessment, setApiParametersAssessment] = useState(initParametersAssessment)
	const [apiParametersByStudentClass, setApiParametersByStudentClass] = useState(initParametersByStudentClass)
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [dataTable, setDataTable] = useState([])
	const [totalRow, setTotalRow] = useState(1)

	const getStudentAssessment = async (params) => {
		try {
			setLoading(true)
			const res = await studentAssessmentApi.getAll(params)
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

	const getPointByStudentClass = async (params) => {
		try {
			setLoading(true)
			const res = await transcriptApi.getPointByStudentClass(params)
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
		if (type == 'daykem') {
			setApiParametersAssessment({ ...apiParametersAssessment, classId: idClass })
			setApiParametersByStudentClass(initParametersByStudentClass)
		} else {
			setApiParametersByStudentClass({ ...apiParametersByStudentClass, classId: idClass, studentId: user?.UserInformationId })
			setApiParametersAssessment(initParametersAssessment)
		}
	}, [type, idClass])

	useEffect(() => {
		if (apiParametersAssessment) {
			getStudentAssessment(apiParametersAssessment)
		}
	}, [apiParametersAssessment])

	useEffect(() => {
		if (apiParametersByStudentClass) {
			getPointByStudentClass(apiParametersByStudentClass)
		}
	}, [apiParametersByStudentClass])

	const columns = [
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

		if (type == 'daykem') {
			setApiParametersAssessment({
				...apiParametersAssessment,
				pageIndex: pageIndex
			})
		} else {
			setApiParametersByStudentClass({
				...apiParametersByStudentClass,
				pageIndex: pageIndex
			})
		}
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
			/>
			{/* <PrimaryTable loading={loading} total={totalRow} data={dataTable} columns={columns} /> */}
		</>
	)
}
