import { Form, Input, Modal, Select, Tooltip } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { GiPayMoney } from 'react-icons/gi'
import * as yup from 'yup'
import { branchApi } from '~/api/branch'
import { paymentMethodsApi } from '~/api/payment-method'
import RestApi from '~/api/RestApi'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import InputTextField from '~/common/components/FormControl/InputTextField'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import PrimaryTable from '~/common/components/Primary/Table'
import { ButtonRefund } from '~/common/components/TableButton'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { _format } from '~/common/utils/format'
const PAGE_SIZE = 10

const PaymentApprovePage = () => {
	const [dataPaymentApprove, setDataPaymentApprove] = useState<any>()
	const [isLoading, setIsLoading] = useState(false)
	const [totalRow, setTotalRow] = useState(1)
	const [todoApi, setTodoApi] = useState({ pageSize: PAGE_SIZE, pageIndex: 1, search: '' })

	const getPaymentApprove = async () => {
		try {
			setIsLoading(true)
			const response = await RestApi.get<any>('/PaymentApprove', {})
			if (response.status == 200) {
				const { data, totalRow } = response.data
				setDataPaymentApprove(data)
				setTotalRow(totalRow)
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

	const columns = [
		{
			width: 120,
			title: 'Mã',
			dataIndex: 'BillCode',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Họ tên',
			dataIndex: 'FullName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			width: 120,
			title: 'Mã học viên',
			dataIndex: 'UserCode',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Thêm lúc',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Số tiền',
			dataIndex: 'Money',
			render: (money) => {
				return <p>{_format.numberToPrice(money)}</p>
			}
		},
		{
			title: 'Ghi Chú ',
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
				return (
					<div className="flex items-center">
						<DeleteTableRow handleDelete={() => handleDelete(data.Id)} />
						{/* <PaymentApprovePage.ApproveMoneyBack id={data.Id} onRefresh={getPaymentApprove} /> */}
						{data.Status === 1 && <PaymentApprovePage.ApproveMoney id={data.Id} onRefresh={getPaymentApprove} />}
					</div>
				)
			},
			width: 120
		}
	]

	return (
		<PrimaryTable
			loading={isLoading}
			total={totalRow}
			onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
			data={dataPaymentApprove}
			columns={columns}
			TitleCard={
				<div className="flex items-center justify-between w-full">
					<Input.Search
						className="primary-search max-w-[300px]"
						onChange={(event) => {
							if (event.target.value == '') {
								setTodoApi({ ...todoApi, pageIndex: 1, search: '' })
							}
						}}
						onSearch={(event) => setTodoApi({ ...todoApi, pageIndex: 1, search: event })}
						placeholder="Tìm kiếm"
					/>
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
							<Form.Item name="BranchId" label="Danh sách chi nhánh" className="w-full col-12">
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