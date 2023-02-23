import React, { useEffect, useState } from 'react'
import { faqApi } from '~/api/faq'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import QuestionForm from '~/common/components/Faq/QuestionForm'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'
import Head from 'next/head'
import appConfigs from '~/appConfig'

const FAQ = () => {
	const [dataSource, setDataSource] = useState([])
	const [totalPage, setTotalPage] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const todoApiDataSource = { pageIndex: 1, pageSize: PAGE_SIZE }
	const [todoApi, setTodoApi] = useState(todoApiDataSource)
	const [isLoading, setIsLoading] = useState(false)

	const theInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return theInformation?.RoleId == 1
	}

	function isTeacher() {
		return theInformation?.RoleId == 2
	}

	function isManager() {
		return theInformation?.RoleId == 4
	}

	function isStdent() {
		return theInformation?.RoleId == 3
	}

	const columns = [
		{
			title: 'Câu hỏi',
			dataIndex: 'Question',
			render: (text, data) => <p>{data.Question}</p>
		},
		{
			title: 'Chức năng',
			dataIndex: '',
			width: 130,
			render: (text, data) => (
				<div className="d-flex">
					{(isAdmin() || isManager()) && <QuestionForm rowData={data} getDataSource={getDataSource} />}
					{(isAdmin() || isManager()) && <DeleteTableRow handleDelete={() => handleDelete(data.Id)} text={data.Question} />}
				</div>
			)
		}
	]

	const getDataSource = async () => {
		setIsLoading(true)
		try {
			let res = await faqApi.getAll(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async (id) => {
		try {
			let res = await faqApi.delete(id)
			if (res.status === 200) {
				setTodoApi(todoApiDataSource)
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const getPagination = (pageNumber) => {
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageNumber })
	}

	useEffect(() => {
		getDataSource()
	}, [todoApi, currentPage])

	const expandedRowRender = (record) => {
		return (
			<>
				<div className="expanded__row-container">
					<p className="expanded__row-title">Nội dung trả lời: </p>
					<p className="expanded__row-text">{record.Answer}</p>
				</div>
			</>
		)
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Cấu hình câu hỏi thường gặp</title>
			</Head>
			<ExpandTable
				totalPage={totalPage && totalPage}
				currentPage={currentPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				columns={columns}
				dataSource={dataSource}
				TitlePage="Danh sách câu hỏi thường gặp"
				TitleCard={(isManager() || isAdmin()) && <QuestionForm getDataSource={getDataSource} />}
				expandable={expandedRowRender}
			/>
		</>
	)
}
export default FAQ
