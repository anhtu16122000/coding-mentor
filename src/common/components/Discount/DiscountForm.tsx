import React, { useEffect, useState } from 'react'
import { Modal, Form, Switch, Tooltip, Spin } from 'antd'
import moment from 'moment'
import { parseStringToNumber } from '~/common/utils/common'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { Edit } from 'react-feather'
import InputTextField from '~/common/components/FormControl/InputTextField'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import SelectField from '~/common/components/FormControl/SelectField'
import * as yup from 'yup'
import { ShowNoti } from '~/common/utils'
import { discountApi } from '~/api/discount'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const packages = [
	{
		value: 1,
		title: 'Gói lẻ'
	},
	{
		value: 2,
		title: 'Gói combo'
	}
]

const status = [
	{
		value: 1,
		title: 'Đang diễn ra'
	},
	{
		value: 2,
		title: 'Đã kết thúc'
	}
]

const DiscountForm = (props) => {
	const { rowData, setTodoApi, listTodoApi } = props

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	const [percent, setPercent] = useState(false)

	const onChange = () => {
		setPercent(!percent)
	}

	let schema = yup.object().shape({
		Code: yup.string().required('Bạn không được để trống'),
		Value: yup.string().required('Bạn không được để trống'),
		Quantity: yup.string().required('Bạn không được để trống'),
		Expired: yup.mixed().required('Bạn không được để trống'),
		PackageType: yup.number().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const handleSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			let newData = null
			if (rowData) {
				newData = {
					...rowData,
					...data,
					Value: parseStringToNumber(data.Value),
					Quantity: parseStringToNumber(data.Quantity),
					Expired: moment(data.Expired).format(),
					MaxDiscount: parseStringToNumber(data.MaxDiscount || 0)
				}
			} else {
				newData = {
					...data,
					Value: parseStringToNumber(data.Value),
					Quantity: parseStringToNumber(data.Quantity),
					Expired: moment(data.Expired).format(),
					MaxDiscount: parseStringToNumber(data.MaxDiscount || 0)
				}
			}
			if (percent) {
				newData.Type = 2
			} else {
				newData.Type = 1
			}
			const res = await (rowData?.Id ? discountApi.update(newData) : discountApi.add(newData))
			if (res.status === 200) {
				setIsModalVisible(false)
				form.resetFields()
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				form.setFieldValue('Id', rowData.Id)
				form.setFieldValue('Code', rowData.Code)
				form.setFieldValue('MaxDiscount', rowData.MaxDiscount)
				form.setFieldValue('Note', rowData.Note)
				form.setFieldValue('PackageType', rowData.PackageType)
				form.setFieldValue('Type', rowData.Type)
				form.setFieldValue('Expired', moment(rowData.Expired))
				form.setFieldValue('Quantity', rowData.Quantity)
				form.setFieldValue('Value', rowData.Value)
				form.setFieldValue('Status', rowData.Status)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowData ? (
				<IconButton
					icon="edit"
					type="button"
					color="yellow"
					onClick={() => {
						setIsModalVisible(true), form.resetFields()
					}}
					tooltip="Cập nhật"
				/>
			) : (
				<PrimaryButton background="green" icon="add" onClick={() => setIsModalVisible(true)} type="button">
					Thêm mới
				</PrimaryButton>
			)}
			{console.log('rowData: ', rowData)}
			<Modal
				title={<>{rowData ? 'Cập nhật mã khuyến mãi' : 'Thêm mã khuyến mãi'}</>}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				centered
			>
				<div className="container-fluid antd-custom-wrap">
					<Form form={form} layout="vertical" onFinish={handleSubmit}>
						{!rowData ? (
							<div className="row">
								<div className="mb-3">
									<span className="font-medium mr-4 text-[rgba(0,0,0,0.85)] text-sm">Phần trăm</span>
									<Switch onChange={onChange} />
								</div>
								<div className="col-12">
									<InputTextField isRequired rules={[yupSync]} label="Mã khuyến mãi" name="Code" />
								</div>
								<div className="col-6">
									{percent ? (
										<>
											<InputNumberField label="Khuyến mãi %" name="Value" max={100} isRequired rules={[yupSync]} />
										</>
									) : (
										<InputNumberField label="Giá trị khuyến mãi" name="Value" isRequired rules={[yupSync]} />
									)}
								</div>
								{percent ? (
									<>
										<div className="col-6">
											<InputNumberField label="Khuyến mãi tối đa" name="MaxDiscount" />
										</div>
										<div className="col-12">
											<SelectField isRequired rules={[yupSync]} label="Gói" name="PackageType" optionList={packages} />
										</div>
									</>
								) : (
									<>
										<div className="col-6">
											<SelectField isRequired rules={[yupSync]} label="Gói" name="PackageType" optionList={packages} />
										</div>
									</>
								)}
							</div>
						) : (
							<div className="row">
								{rowData.Type === 1 ? (
									<>
										<div className="col-6">
											<InputTextField label="Mã khuyến mãi" name="Code" rules={[yupSync]} />
										</div>
										<div className="col-6">
											<InputNumberField label="Giá trị khuyến mãi" name="Value" isRequired rules={[yupSync]} />
										</div>
									</>
								) : (
									<>
										<div className="col-12">
											<InputTextField label="Mã khuyến mãi" name="Code" isRequired rules={[yupSync]} />
										</div>
										<div className="col-6">
											<InputNumberField label="Khuyến mãi %" name="Value" isRequired rules={[yupSync]} max={100} />
										</div>
										<div className="col-6">
											<InputNumberField label="Khuyến mãi tối đa" name="MaxDiscount" />
										</div>
									</>
								)}
							</div>
						)}
						<div className="row">
							<div className="col-6">
								<InputNumberField label="Số lượng" name="Quantity" isRequired rules={[yupSync]} />
							</div>
							<div className="col-6">
								<DatePickerField mode="single" label="Thời hạn" name="Expired" isRequired rules={[yupSync]} />
							</div>
						</div>
						<div className="row">
							<div className="col-12">{rowData && <SelectField label="Trạng thái" name="Status" optionList={status} />}</div>
						</div>
						<div className="row">
							<div className="col-12">
								<TextBoxField name="Note" label="Ghi chú" />
							</div>
						</div>
						<div className="row">
							<div className="col-12 flex-all-center">
								<PrimaryButton icon="save" type="submit" background="blue" disable={isLoading} loading={isLoading}>
									Lưu
								</PrimaryButton>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default DiscountForm
