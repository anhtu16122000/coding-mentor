import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { staffSalaryApi } from '~/api/staff-salary'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import SelectField from '~/common/components/FormControl/SelectField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { ShowNoti } from '~/common/utils'
import { removeCommas } from '~/common/utils/super-functions'

type IModalSalary = {
	dataRow?: any
	onRefresh?: Function
	mode: 'edit' | 'salary'
	time?: any
}
export const ModalSalaryCRUD: React.FC<IModalSalary> = ({ dataRow, onRefresh, mode, time }) => {
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [userDropdown, setUserDropdown] = useState([])
	const [basicSalary, setBasicSalary] = useState(null)
	const [teachingSalary, setTeachingSalary] = useState(null)
	const [deduction, setDeduction] = useState(null)
	const [bonus, setBonus] = useState(null)
	const [form] = Form.useForm()
	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		if (mode === 'salary') {
			getUser()
		}
		setVisible(true)
	}

	const getUser = async () => {
		try {
			const res = await staffSalaryApi.getUserAvailable(time)
			if (res.status === 200) {
				let temp = []
				res.data.data?.forEach((item) => {
					temp.push({ title: item?.FullName, value: item?.UserInformationId })
				})
				setUserDropdown(temp)
			}
			if (res.status === 204) {
				setUserDropdown([])
			}
		} catch (error) {
			console.log(error)
		}
	}
	const handleUpdate = async (data) => {
		try {
			setIsLoading(true)
			const res = await staffSalaryApi.update(data)
			if (res.status === 200) {
				onClose()
				onRefresh()
				setIsLoading(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			setIsLoading(true)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCreate = async (data) => {
		try {
			setIsLoading(true)
			const res = await staffSalaryApi.add(data)
			if (res.status === 200) {
				onClose()
				onRefresh()
				setIsLoading(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			setIsLoading(true)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const _onSubmit = (data) => {
		if (mode === 'edit') {
			data.Id = dataRow?.Id
		}

		const DATA_SUBMIT = { ...data }

		console.log('--- DATA SUBMIT: ', DATA_SUBMIT)

		if (mode === 'edit') {
			handleUpdate(data)
		}

		if (mode === 'salary') {
			data.BasicSalary = removeCommas(data.BasicSalary)
			data.TeachingSalary = removeCommas(data.TeachingSalary)
			data.Bonus = removeCommas(data.Bonus)
			data.Deduction = removeCommas(data.Deduction)
			data.Year = time.year
			data.Month = time.month
			delete data.TotalSalary
			handleCreate(data)
		}
	}

	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
		}
	}, [dataRow])

	useEffect(() => {
		let temp = removeCommas(basicSalary) + removeCommas(teachingSalary) + removeCommas(bonus) - removeCommas(deduction)
		form.setFieldValue('TotalSalary', temp)
	}, [basicSalary, teachingSalary, deduction, bonus])

	return (
		<>
			{mode === 'edit' && (
				<div
					className="flex items-center cursor-pointer"
					onClick={() => {
						onOpen()
					}}
				>
					<IconButton type="button" icon={'edit'} color="green" className="Sửa" tooltip="Sửa" />
				</div>
			)}
			{mode === 'salary' && (
				<div
					className="flex items-center cursor-pointer"
					onClick={() => {
						onOpen()
					}}
				>
					<button
						type="button"
						className={`font-medium none-selection rounded-lg h-[38px] px-3 inline-flex items-center justify-center text-white bg-[#4CAF50] hover:bg-[#449a48] focus:bg-[#38853b]`}
					>
						Tính lương thủ công
					</button>
				</div>
			)}

			<Modal
				title={mode === 'edit' ? 'Cập nhật lương' : 'Tính lương thủ công '}
				open={visible}
				onCancel={onClose}
				footer={
					<>
						<PrimaryButton onClick={() => onClose()} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton
							loading={isLoading}
							onClick={() => form.submit()}
							className="ml-2"
							background="blue"
							icon="save"
							type="button"
							children="Lưu"
						/>
					</>
				}
				width={800}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
							{mode === 'salary' && (
								<>
									<div className="col-span-2">
										<SelectField label="Nhân viên" name="UserId" optionList={userDropdown} placeholder="Chọn nhân viên" />
									</div>
									<div className="col-span-2">
										<InputNumberField
											name="BasicSalary"
											label="Lương cơ bản"
											placeholder="Nhập lương cơ bản"
											isRequired
											onChange={(val) => setBasicSalary(val.target.value)}
										/>
									</div>

									<div className="col-span-2">
										<InputNumberField
											onChange={(val) => setTeachingSalary(val.target.value)}
											name="TeachingSalary"
											label="Lương giảng dạy"
											placeholder="Nhập lương giảng dạy"
										/>
									</div>
								</>
							)}
							<div className="col-span-2">
								<InputNumberField
									onChange={(val) => setDeduction(val.target.value)}
									name="Deduction"
									label="Trừ tạm ứng"
									placeholder="Nhập trừ tạm ứng"
								/>
							</div>

							<div className="col-span-2">
								<InputNumberField onChange={(val) => setBonus(val.target.value)} name="Bonus" label="Thưởng" placeholder="Nhập thưởng" />
							</div>

							{mode === 'salary' && (
								<div className="col-span-2">
									<InputNumberField name="TotalSalary" label="Lương tổng" placeholder="" disabled />
								</div>
							)}

							{mode === 'edit' && (
								<div className="col-span-2">
									<SelectField
										label="Trạng thái"
										name="Status"
										optionList={[
											{ title: 'Chưa chốt', value: 1 },
											{ title: 'Đã chốt', value: 2 },
											{ title: 'Đã thanh toán', value: 3 }
										]}
										placeholder=""
									/>
								</div>
							)}

							<div className="col-span-2">
								<TextBoxField name="Note" label="Ghi chú" />
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
