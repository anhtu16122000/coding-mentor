import { Skeleton } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/branch'
import { paymentMethodsApi } from '~/api/payment-method'
import { refundApi } from '~/api/refund'
import { userInformationApi } from '~/api/user'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti, _format } from '~/common/utils'
import { RootState } from '~/store'
import ModalRefundCRUD from './ModalRefundCRUD'
import appConfigs from '~/appConfig'
import Head from 'next/head'

export interface IRefundPageProps {}

export default function RefundPage(props: IRefundPageProps) {
	const initialParams = { pageIndex: 1, pageSize: PAGE_SIZE }
	const initialParamsStudent = { pageIndex: 1, pageSize: PAGE_SIZE, FullName: '', RoleIds: 3 }
	const [dataSource, setDataSource] = useState<IRefund[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState(initialParams)
	const [optionList, setOptionList] = useState({ branch: [], paymentMethod: [] })
	const [totalRow, setTotalRow] = useState(0)
	const userInformation = useSelector((state: RootState) => state.user.information)
	const [todoStudentOption, setTodoStudentOption] = useState(initialParamsStudent)
	const [optionStudent, setStudentOption] = useState<{ title: string; value: any }[]>([])

	const getListRefund = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await refundApi.getAll(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status == 204) {
				setDataSource([])
				setTotalRow(0)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		getListRefund()
	}, [todoApi])

	const _onSubmit = async (data) => {
		setIsLoading({ type: 'SUBMIT', status: true })
		try {
			let res
			if (data.mode == 'add') {
				res = await refundApi.add(data)
			}
			if (data.mode == 'edit') {
				res = await refundApi.update(data)
			}
			if (data.mode == 'delete') {
				res = await refundApi.delete(data.Id)
			}

			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getListRefund()
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const getOptionList = async () => {
		try {
			const [branchResponse, paymentMethod] = await Promise.all([
				branchApi.getAll({ pageIndex: 1, pageSize: 99999 }),
				paymentMethodsApi.getAll({ pageIndex: 1, pageSize: 99999 })
			])

			let tempOption = { branch: [], paymentMethod: [] }

			if (branchResponse.status == 200) {
				let temp = []
				branchResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.branch = temp
			}
			if (paymentMethod.status == 200) {
				let temp = []
				paymentMethod.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.paymentMethod = temp
			}

			setOptionList(tempOption)
		} catch (error) {}
	}

	useEffect(() => {
		getOptionList()
	}, [])

	const getOptionStudent = async () => {
		try {
			let res = await userInformationApi.getByRole(3)
			if (res.status == 200) {
				let temp = []
				res.data.data.forEach((item) => temp.push({ title: `${item.FullName}-${item.UserCode}`, value: item.UserInformationId }))
				setStudentOption(temp)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
		}
	}

	useEffect(() => {
		getOptionStudent()
	}, [todoStudentOption])

	const handleSearchForOptionList = (data, name) => {
		if (name == 'student') {
			if (!!data) {
				setTodoStudentOption({ ...todoStudentOption, FullName: data })
			} else {
				setTodoStudentOption(initialParamsStudent)
			}
		}
	}

	const handleLoadOnScrollForOptionList = (name) => {
		if (name == 'student') {
			setTodoStudentOption({ ...todoStudentOption, pageSize: (todoStudentOption.pageSize += 10) })
		}
	}

	const columns =
		userInformation && userInformation.RoleId == '1'
			? [
					{
						title: 'Tên học viên',
						width: 200,
						dataIndex: 'FullName',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
								<p className="table-row-sub-text">{item.BranchName}</p>
								<p className="table-row-sub-text">Ngày tạo: {moment(item.CreatedOn).format('DD/MM/YYYY')}</p>
							</>
						)
					},
					{
						title: 'Số tiền yêu cầu',
						width: 200,
						dataIndex: 'Price',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{_format.numberToPrice(text)} VND</p>
							</>
						)
					},
					{
						title: 'Loại yêu cầu',
						width: 150,
						dataIndex: 'TypeName',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
							</>
						)
					},
					{
						title: 'Ghi chú',
						width: 200,
						dataIndex: 'Note',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
							</>
						)
					},
					{
						title: 'Trạng thái',
						width: 200,
						dataIndex: 'StatusName',
						render: (text, item) => (
							<>
								{item.Status == 1 && <PrimaryTag children={<>{item.StatusName}</>} color="disabled" />}
								{item.Status == 2 && <PrimaryTag children={<>{item.StatusName}</>} color="green" />}
								{item.Status == 3 && <PrimaryTag children={<>{item.StatusName}</>} color="red" />}
							</>
						)
					},
					{
						title: '',
						width: 100,
						dataIndex: 'Action',
						render: (text, item) => (
							<>
								<ModalRefundCRUD
									mode="edit"
									dataRow={item}
									isLoading={isLoading.type == 'SUBMIT' && isLoading.status}
									onSubmit={_onSubmit}
									optionStudent={optionStudent}
									dataOption={optionList}
									handleSearchForOptionList={handleSearchForOptionList}
									handleLoadOnScrollForOptionList={handleLoadOnScrollForOptionList}
								/>
								<ModalRefundCRUD
									mode="delete"
									dataRow={item}
									isLoading={isLoading.type == 'SUBMIT' && isLoading.status}
									onSubmit={_onSubmit}
									optionStudent={optionStudent}
									dataOption={optionList}
									handleSearchForOptionList={handleSearchForOptionList}
									handleLoadOnScrollForOptionList={handleLoadOnScrollForOptionList}
								/>
							</>
						)
					}
			  ]
			: [
					{
						title: 'Tên học viên',
						width: 200,
						dataIndex: 'FullName',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
								<p className="table-row-sub-text">{item.BranchName}</p>
								<p className="table-row-sub-text">Ngày tạo: {moment(item.CreatedOn).format('DD/MM/YYYY')}</p>
							</>
						)
					},
					{
						title: 'Số tiền yêu cầu',
						width: 200,
						dataIndex: 'Price',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{_format.numberToPrice(text)} VND</p>
							</>
						)
					},
					{
						title: 'Loại yêu cầu',
						width: 150,
						dataIndex: 'TypeName',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
							</>
						)
					},
					{
						title: 'Ghi chú',
						width: 200,
						dataIndex: 'Note',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
							</>
						)
					},
					{
						title: 'Trạng thái',
						width: 200,
						dataIndex: 'StatusName',
						render: (text, item) => (
							<>
								{item.Status == 1 && <PrimaryTag children={<>{item.StatusName}</>} color="disabled" />}
								{item.Status == 2 && <PrimaryTag children={<>{item.StatusName}</>} color="green" />}
								{item.Status == 3 && <PrimaryTag children={<>{item.StatusName}</>} color="red" />}
							</>
						)
					}
			  ]

	if (isLoading.type == 'GET_ALL' && isLoading.status) {
		return <Skeleton active />
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Danh sách hoàn tiền</title>
			</Head>
			<PrimaryTable
				loading={isLoading.type == 'GET_ALL' && isLoading.status}
				total={totalRow}
				onChangePage={(event: number) => setTodoApi({ ...initialParams, pageIndex: event })}
				TitleCard={<div className="extra-table">Danh sách hoàn tiền</div>}
				data={dataSource}
				columns={columns}
				Extra={
					<>
						{userInformation && userInformation.RoleId != '3' && (
							<ModalRefundCRUD
								dataOption={optionList}
								mode="add"
								isLoading={isLoading.type == 'SUBMIT' && isLoading.status}
								onSubmit={_onSubmit}
								optionStudent={optionStudent}
								handleSearchForOptionList={handleSearchForOptionList}
								handleLoadOnScrollForOptionList={handleLoadOnScrollForOptionList}
							/>
						)}
					</>
				}
			/>
		</>
	)
}
