import { Card, Form, Modal, Select, Tooltip } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'
import ModalFooter from '../../ModalFooter'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import Avatar from '../../Avatar'
import { MdOpenInNew } from 'react-icons/md'
import { parseToMoney } from '~/common/utils/common'
import ButtonMoveTo from '../../TableButton/MOVETO'
import { programApi } from '~/api/learn/program'
import PrimaryButton from '../../Primary/Button'
import { AiOutlineWarning } from 'react-icons/ai'

interface IAddToClass {
	isEdit?: boolean
	onRefresh?: Function
	item?: any
	onOpen?: Function
	items?: any
	isTop?: boolean
}

const url = 'ClassRegistration'

const AddToClass: FC<IAddToClass> = ({ isEdit, onRefresh, item, items, isTop }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [classes, setClasses] = useState<any>([])

	useEffect(() => {
		if (visible) {
			getPrograms()
			getClass(item?.ProgramId || items[0]?.ProgramId)
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

		let tempStudents = []

		if (isTop) {
			for (let i = 0; i < items.length; i++) {
				tempStudents.push(items[i]?.StudentId)
			}
		}

		try {
			const response = await RestApi.get(`ClassRegistration/class-available`, {
				programId: params,
				branchId: items[0]?.BranchId,
				studentIds: tempStudents.join(', ')
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

		if (!isTop) {
			form.setFieldValue('ProgramId', item?.ProgramId)
		} else {
			form.setFieldValue('ProgramId', items[0]?.ProgramId)
		}
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

	const [showStudent, setShowstudent] = useState<boolean>(false)

	return (
		<>
			{!isTop && (
				<PrimaryTooltip id={`add-to-${item?.Id}`} place="left" content="Chuyển vào lớp">
					<ButtonMoveTo onClick={openEdit} className="ml-[16px]" />
				</PrimaryTooltip>
			)}

			{!!isTop && (
				<PrimaryTooltip id={`add-all-to`} place="left" content={items.length == 0 ? 'Chưa chọn học viên' : `Chọn lớp để xếp`}>
					<PrimaryButton disable={!!items && items.length == 0} onClick={openEdit} background="blue" icon="enter" type="button">
						Chọn lớp
					</PrimaryButton>
				</PrimaryTooltip>
			)}

			<Modal
				width={500}
				title={isTop ? `Chuyển ${items.length} học viên vào lớp` : 'Chuyển vào lớp'}
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submitForm} />}
			>
				{!isTop && (
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
				)}

				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<Form.Item className="col-span-2 ant-select-class-selected" name="ClassId" label="Lớp chuyển đến" rules={formRequired}>
						<Select loading={loadingClass} disabled={loading} placeholder="Chọn lớp" className="ant-select-item-option-selected-blue">
							{classes.map((thisClass) => {
								return (
									<Select.Option disabled={!thisClass?.Fit} key={thisClass.ClassId} value={thisClass.ClassId}>
										<div className="flex items-center justify-between w-full ant-select-class-option">
											<div className="ant-select-item-option-name">{thisClass?.ClassName}</div>
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

					<Form.Item name="ClassId" label="Lớp chuyển đến" rules={formRequired}>
						<Select loading={loadingClass} disabled={loading} placeholder="Chọn lớp">
							{classes.map((item) => {
								return (
									<Select.Option disabled={!item.Fit} key={item.ClassId} value={item.ClassId}>
										<div className="flex items-center justify-between w-full">
											{item.ClassId}
											{!item.Fit && (
												<Tooltip placement="right" title={!!item.Note ? item.Note : `Giáo viên ${item.TeacherName} bị trùng lịch`}>
													<AiOutlineWarning className="text-tw-red" />
												</Tooltip>
											)}
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
