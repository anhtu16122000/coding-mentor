import { Card, Form, Modal, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'
import ModalFooter from '../../ModalFooter'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import Avatar from '../../Avatar'
import { MdOpenInNew } from 'react-icons/md'
import { parseToMoney } from '~/common/utils/common'
import moment from 'moment'
import ButtonMoveTo from '../../TableButton/MOVETO'
import { programApi } from '~/api/program'

interface IAddToClass {
	isEdit?: boolean
	onRefresh?: Function
	item?: any
	onOpen?: Function
}

const url = 'ClassRegistration'

const AddToClass: FC<IAddToClass> = ({ isEdit, onRefresh, item }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [classes, setClasses] = useState<any>([])

	useEffect(() => {
		if (visible) {
			getPrograms()
			getClass(item?.ProgramId)
		}
	}, [visible])

	const [programs, setPrograms] = useState([])
	const getPrograms = async () => {
		try {
			const res = await programApi.getAll()
			if (res.status == 200) {
				setPrograms(res.data.data)
			}
			if (res.status == 204) {
				setPrograms([])
			}
		} catch (err) {
			ShowNostis.error(err?.message)
		}
	}

	const [loadingClass, setLoadingClass] = useState(false)
	async function getClass(params) {
		setLoadingClass(true)
		form.setFieldValue('ClassId', null)
		try {
			const response = await RestApi.get(`Bill/class-available`, {
				programId: params,
				branchId: item?.BranchId,
				studentId: item?.StudentId
			})

			if (response.status == 200) {
				setClasses(response.data.data)
			} else {
				setClasses([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
			setLoadingClass(false)
		}
	}

	function toggle() {
		setVisible(!visible)
	}

	function openEdit() {
		setVisible(!visible)
		form.setFieldValue('ProgramId', item?.ProgramId)
	}

	function onFinish(params) {
		setLoading(true)

		const DATA_SUBMIT = {
			...params,
			ClassRegistrationIds: [item?.Id]
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!isEdit && post(DATA_SUBMIT)
		isEdit && edit(DATA_SUBMIT)
	}

	async function post(params) {
		try {
			const response = await RestApi.post(url + '/add-to-class', params)
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
			const response = await RestApi.post(url + '/payment', { ...params, Id: item?.Id })
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
			<PrimaryTooltip id={`add-to-${item?.Id}`} place="left" content="Chuyển vào lớp">
				<ButtonMoveTo onClick={openEdit} className="ml-[16px]" />
			</PrimaryTooltip>

			<Modal
				width={500}
				title="Chuyển vào lớp"
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
								<div className="font-[600] inline-flex">Mã:</div> {item?.UserCode}
							</div>
							<div className="w-full in-1-line font-[400] text-[14px]">
								<div className="font-[600] inline-flex">Số tiền đăng ký:</div> {parseToMoney(item?.Price)}
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

				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<Form.Item className="col-span-2" name="ProgramId" label="Chương trình" rules={formRequired}>
						<Select
							defaultValue={item?.ProgramId}
							disabled={loading}
							onChange={(event) => getClass(event)}
							placeholder="Chọn chương trình"
							className=""
						>
							{programs.map((thisItem) => {
								return (
									<Select.Option key={thisItem.Id} value={thisItem.Id}>
										{thisItem?.Name}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>

					<Form.Item className="col-span-2 ant-select-class-selected" name="ClassId" label="Lớp chuyển đến" rules={formRequired}>
						<Select loading={loadingClass} disabled={loading} placeholder="Chọn lớp" className="ant-select-item-option-selected-blue">
							{classes.map((thisClass) => {
								return (
									<Select.Option disabled={!thisClass?.Fit} key={thisClass.Id} value={thisClass.Id}>
										<div className="flex items-center justify-between w-full ant-select-class-option">
											<div className="ant-select-item-option-name">{thisClass?.Name}</div>
											{!thisClass?.Fit && <div className="text-[#e011116c]">{thisClass?.Note}</div>}
										</div>
										<div className="hiddens ant-select-dropdown-by-chau">
											<div className="text-[12px]">Giá: {parseToMoney(thisClass?.Price)}</div>
											<div className="text-[12px]">Học viên: {parseToMoney(thisClass?.StudentQuantity)}</div>
										</div>
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default AddToClass
