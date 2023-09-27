import { Form, Modal, Select, Tooltip } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import RestApi from '~/api/RestApi'
import { paymentMethodsApi } from '~/api/business/payment-method'
import { branchApi } from '~/api/manage/branch'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import FilterBase from '~/common/components/Elements/FilterBase'
import InputTextField from '~/common/components/FormControl/InputTextField'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import PrimaryTable from '~/common/components/Primary/Table'
import { ButtonRefund } from '~/common/components/TableButton'
import TabComp from '~/common/custom/TabComp'
import { TabCompData } from '~/common/custom/TabComp/type'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'
import { _format } from '~/common/utils/format'
import { RootState } from '~/store'

const PAGE_SIZE = 10

const PaymentApprovePage = () => {
	const initParamters = { pageSize: PAGE_SIZE, pageIndex: 1, search: '', status: 0 }
	const [dataPaymentApprove, setDataPaymentApprove] = useState<any>()
	const [paymentStatus, setPaymentStatus] = useState<TabCompData[]>()
	const [statusSelected, setStatusSelected] = useState<number>(0)
	const [isLoading, setIsLoading] = useState(false)
	const [totalRow, setTotalRow] = useState(1)
	const [totalMoney, setTotalMoney] = useState()
	const [todoApi, setTodoApi] = useState(initParamters)

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'grid-cols-1',
			type: 'date-range'
		}
	])

	const getPaymentApprove = async () => {
		try {
			setIsLoading(true)
			const response = await RestApi.get<any>('/PaymentApprove', todoApi)
			if (response.status == 200) {
				const { data, totalRow, totalMoney, AllState, Opened, Approved, Canceled }: any = response.data
				setDataPaymentApprove(data)
				setTotalMoney(totalMoney)
				setTotalRow(totalRow)
				setPaymentStatus([
					{
						id: 0,
						title: 'Tất cả',
						value: AllState
					},
					{
						id: 1,
						title: 'Chờ duyệt',
						value: Opened
					},
					{
						id: 2,
						title: 'Đã duyệt',
						value: Approved
					},
					{
						id: 3,
						title: 'Không duyệt',
						value: Canceled
					}
				])
			} else {
				setDataPaymentApprove([])
			}
		} catch (error) {
			ShowNostis.error(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getPaymentApprove()
	}, [todoApi])

	const handleDelete = async (id: string) => {
		try {
			const res = await RestApi.delete('/PaymentApprove', id)
			getPaymentApprove()
			ShowNoti('success', res.data.message)
			return res
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const user = useSelector((state: RootState) => state.user.information)
	function isAdmin() {
		return user?.RoleId == 1
	}

	function isTeacher() {
		return user?.RoleId == 2
	}

	function isManager() {
		return user?.RoleId == 4
	}

	function isStdent() {
		return user?.RoleId == 3
	}

	function isAccountant() {
		return user?.RoleId == 6
	}

	function isAcademic() {
		return user?.RoleId == 7
	}

	const columns = [
		{
			width: 120,
			title: 'Mã',
			dataIndex: 'BillCode',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Người yêu cầu',
			dataIndex: 'FullName',
			render: (text, item) => <div className="font-semibold text-[#1b73e8]">{text}</div>
		},
		{
			title: 'Thêm lúc',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
		},
		{
			title: 'Số tiền',
			dataIndex: 'Money',
			width: 150,
			render: (money) => {
				return <p>{_format.numberToPrice(money)}</p>
			}
		},
		{
			title: 'Ghi chú ',
			dataIndex: 'Note',
			width: 140
		},
		{
			title: 'Trạng thái ',
			render: (data) => {
				switch (data?.Status) {
					case 1:
						return <p className="font-semibold text-tw-yellow">{data.StatusName}</p>
					case 2:
						return <p className="font-semibold text-tw-green">{data.StatusName}</p>
					default:
						return <p className="font-semibold text-tw-red">{data.StatusName}</p>
				}
			}
		},
		{
			title: 'Chức năng',
			render: (data) => {
				if (!isAdmin() && !isAccountant() && !isManager()) return ''

				return (
					<div className="flex items-center">
						<DeleteTableRow handleDelete={() => handleDelete(data.Id)} />
						{data.Status == 1 && <PaymentApprovePage.ApproveMoney id={data.Id} onRefresh={getPaymentApprove} />}
					</div>
				)
			},
			width: 120
		}
	]

	const listFieldFilter = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		fromDate: null,
		toDate: null
	}
	const handleFilter = (listFilter) => {
		let newListFilter = { ...listFieldFilter }
		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value
				}
			})
		})
		setTodoApi({ ...todoApi, ...newListFilter, pageIndex: 1 })
	}

	const handleReset = () => {
		setTodoApi({ ...initParamters })
	}

	const handleSelecStatus = (status: number) => {
		if (statusSelected !== status) {
			setStatusSelected(status)
			setTodoApi({ ...todoApi, status: status })
		}
	}

	return (
		<PrimaryTable
			loading={isLoading}
			total={totalRow}
			onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
			data={dataPaymentApprove}
			columns={columns}
			TitleCard={
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center">
						<FilterBase dataFilter={dataFilter} handleFilter={handleFilter} handleReset={handleReset} />
						{/* <Input.Search
							className="primary-search max-w-[300px]"
							onChange={(event) => {
								if (event.target.value == '') {
									setTodoApi({ ...todoApi, pageIndex: 1, search: '' })
								}
							}}
							onSearch={(event) => setTodoApi({ ...todoApi, pageIndex: 1, search: event })}
							placeholder="Tìm kiếm"
						/> */}
						<TabComp data={paymentStatus} selected={statusSelected} handleSelected={handleSelecStatus} />
					</div>

					<div
						className="font-medium none-selection
					 rounded-lg h-[36px] px-[10px] inline-flex 
					 items-center justify-center bg-[#4CAF50] 
					 text-white  undefined"
					>
						<span>Tổng tiền: {parseToMoney(totalMoney)}đ</span>
					</div>
				</div>
			}
		/>
	)
}

export default PaymentApprovePage

PaymentApprovePage.ApproveMoney = ({ id, onRefresh }) => {
	const [form] = Form.useForm()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			const res = await RestApi.post(`PaymentApprove/${id}/status/${data.status}`, {})
			if (res.status === 200) {
				form.resetFields()
				setIsModalVisible(false)
				onRefresh()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<IconButton color="green" type="button" icon="check" tooltip={'Chấp thuận'} onClick={() => setIsModalVisible(true)} />

			<Modal centered title={<>Duyệt thanh toán</>} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit} initialValues={{ status: 2 }}>
						<div className="row">
							<Form.Item name="status" className="w-full col-12">
								<Select>
									<Select.Option value={2}>Duyệt</Select.Option>
									<Select.Option value={3}>Không duyệt</Select.Option>
								</Select>
							</Form.Item>
						</div>
						<div className="row">
							<div className="col-12">
								<PrimaryButton className="w-full" icon="save" background="blue" type="submit" disable={isLoading} loading={isLoading}>
									Chấp thuận
								</PrimaryButton>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

PaymentApprovePage.ApproveMoneyBack = ({ id, onRefresh }) => {
	const [form] = Form.useForm()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [allBranch, setAllBranch] = useState([])
	const [allPaymentMethod, setAllPaymentMethod] = useState([])

	let schema = yup.object().shape({
		Price: yup.number().required('Số tiền không được để trống ')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			data.PaymentApproveId = id
			data.Type = 4

			const res = await RestApi.post(`/Refund`, data)

			if (res.status === 200) {
				form.resetFields()
				setIsModalVisible(false)
				onRefresh()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getAllBranch = async () => {
		try {
			const { data } = await branchApi.getAll()
			setAllBranch(data.data)
		} catch (error) {
			console.log('error', error)
		}
	}

	const getAllPaymentMeThod = async () => {
		try {
			const { data } = await paymentMethodsApi.getAll()
			setAllPaymentMethod(data.data)
		} catch (error) {
			console.log('error', error)
		}
	}

	useEffect(() => {
		getAllBranch()
		getAllPaymentMeThod()
	}, [])

	return (
		<>
			<Tooltip title="Hoàn tiền">
				<ButtonRefund size={21} className="ml-[8px] mt-[-2px]" onClick={() => setIsModalVisible(true)} />
			</Tooltip>

			<Modal centered title={<>Hoàn tiền </>} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit} initialValues={{ status: 2, BranchId: allBranch[0]?.Id }}>
						<div className="row">
							<Form.Item name="BranchId" label="Danh sách trung tâm" className="w-full col-12">
								<Select>
									{allBranch.map((branch) => (
										<Select.Option value={branch.Id} key={Math.random() * 1000 + Date.now()}>
											{branch.Name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>

							<InputTextField isRequired name="Price" label="Số tiền" rules={[yupSync]} />
							<InputTextField name="Note" label="Ghi chú" />

							<Form.Item label="Phương thức thanh toán" name="PaymentMethodId" className="w-full col-12">
								<Select>
									{allPaymentMethod.map((paymentItem) => (
										<Select.Option value={paymentItem.Id} key={Math.random() * 1000 + Date.now()}>
											{paymentItem.Name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</div>
						<div className="row">
							<div className="col-12">
								<PrimaryButton className="w-full" icon="save" background="blue" type="submit" disable={isLoading} loading={isLoading}>
									Chấp thuận
								</PrimaryButton>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
