import { Card, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'
import ModalFooter from '../../ModalFooter'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { ButtonChange, ButtonPending } from '../../TableButton'
import Avatar from '../../Avatar'
import { MdOpenInNew } from 'react-icons/md'
import { parseToMoney } from '~/common/utils/common'
import moment from 'moment'

interface IChangeClass {
	isEdit?: boolean
	onRefresh?: Function
	item?: any
	onOpen?: Function
}

const url = 'ClassReserve'

const ReserveForm: FC<IChangeClass> = ({ isEdit, onRefresh, item }) => {
	const [form] = Form.useForm()
	const [currentClass, setCurrentClass] = useState<any>()
	const [loading, setLoading] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)

	useEffect(() => {
		if (visible) {
			getCurrentClass()
			gePaid()
		}
	}, [visible])

	function toggle() {
		setVisible(!visible)
	}

	function openEdit() {
		setVisible(!visible)
	}

	function onFinish(params) {
		setLoading(true)

		const DATA_SUBMIT = {
			...params,
			StudentInClassId: item?.Id
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!isEdit && post(DATA_SUBMIT)
		isEdit && edit(DATA_SUBMIT)
	}

	const getCurrentClass = async () => {
		try {
			const response = await RestApi.get('Class/old-class', {
				studentInClassId: item?.Id,
			})
			if (response.status == 200) {
				setCurrentClass(response.data.data)
			} else {
				setCurrentClass(null)
			}
		} catch (err) {
			ShowNostis.error(err?.message)
		} finally {
			setLoading(false)
		}
	}
	const gePaid = async () => {
		try {
			const response = await RestApi.get('ClassReserve/paid', {
				studentInClassId: item?.Id,
			})
			if (response.status == 200) {
				form.setFieldValue('Price', response.data.data.Paid)
			} else {
			}
		} catch (err) {
			ShowNostis.error(err?.message)
		} finally {
			setLoading(false)
		}
	}

	async function post(params) {
		try {
			const response = await RestApi.post(url, params)
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function edit(params) {
		try {
			const response = await RestApi.post(url, { ...params, Id: item?.Id })
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function submitForm() {
		form.submit()
	}

	function viewStudentDetails(params) {
		const uri = '/info-course/student/detail'
		window.open(uri + `/?StudentID=${params?.StudentId}`, '_blank')
	}

	function viewClassDetails(params) {
		const uri = `/class/list-class/detail/?class=${params.ClassId}`
		window.open(uri, '_blank')
	}

	return (
		<>
			<PrimaryTooltip id={`class-pending-${item?.Id}`} place="left" content="Bảo lưu">
				<ButtonPending onClick={openEdit} className="ml-[16px]" />
			</PrimaryTooltip>

			<Modal
				width={500}
				title="Bảo lưu"
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submitForm} />}
			>
				<Card className="mb-[16px] card-min-padding">
					<div className="flex relative">
						<Avatar uri={item?.Avatar} className="w-[64px] h-[64px] rounded-full shadow-sm border-[1px] border-solid border-[#f4f4f4]" />
						<div className="flex-1 ml-[16px]">
							<div className="w-full in-1-line font-[600] text-[16px]">{item?.FullName}</div>
							<div className="w-full in-1-line font-[400] text-[14px]">
								<div className="font-[600] inline-flex">Email:</div> {item?.Email}
							</div>
							<div className="w-full in-1-line font-[400] text-[14px]">
								<div className="font-[600] inline-flex">Phone:</div> {item?.Mobile}
							</div>
						</div>

						<PrimaryTooltip
							className="top-[-4px] right-[-4px] absolute w-[28px] h-[18px]"
							id={`view-in-new-${item?.Id}`}
							place="right"
							content="Xem thông tin"
						>
							<div onClick={() => viewStudentDetails(item)} className="btn-open-in-new-tab text-[#1976D2]">
								<MdOpenInNew size={16} />
							</div>
						</PrimaryTooltip>
					</div>
				</Card>

				<div className="font-[500] mb-[4px]">Lớp hiện tại</div>
				<Card className="mb-[16px] card-min-padding">
					<div className="relative">
						{/* <div>{item?.ClassName}</div> */}
						<div
							style={{
								display: 'flex',
								flexDirection: 'column'
							}}
						>
							<div style={{ fontWeight: '600' }}>{item?.ClassName}</div>
							{currentClass && (
								<>
									<div className="text-[12px]">Giá: {parseToMoney(currentClass?.Price)}</div>
									<div className="text-[12px]">
										Đã học: {currentClass?.CompletedLesson}/{currentClass?.TotalLesson}
									</div>
								</>
							)}
						</div>
						<PrimaryTooltip
							className="top-[-4px] right-[-4px] absolute w-[28px] h-[18px]"
							id={`class-in-new-${item?.Id}`}
							place="right"
							content="Xem lớp"
						>
							<div onClick={() => viewClassDetails(item)} className="btn-open-in-new-tab text-[#43A047]">
								<MdOpenInNew size={16} />
							</div>
						</PrimaryTooltip>
					</div>
				</Card>

				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<Form.Item className="col-span-2" label="Tạm tính" name="Price" rules={formNoneRequired}>
						<InputNumber
							placeholder="Số tiền tạm tính"
							style={{ borderRadius: 6, width: '100%', height: 35, alignItems: 'center', display: 'flex' }}
						/>
					</Form.Item>
					<Form.Item className="col-span-2 ant-select-class-selected" name="Expires" label="Thời hạn bảo lưu">
						<DatePicker
							disabled={loading}
							className="primary-input"
							placeholder="Chọn ngày"
							allowClear={true}
							format="DD/MM/YYYY"
							disabledDate={(current) => {
								return moment().add(-1, 'days') >= current
							}}
							showToday={false}
							
						/>
					</Form.Item>

					<Form.Item className="col-span-2" label="Ghi chú" name="Note" rules={formNoneRequired}>
						<Input.TextArea rows={5} placeholder="" disabled={loading} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default ReserveForm
