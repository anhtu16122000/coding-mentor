import { Card, Form, Modal, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import PrimaryButton from '~/common/components/Primary/Button'
import ModalFooter from '~/common/components/ModalFooter'
import moment from 'moment'
import Avatar from '~/common/components/Avatar'

interface IParentForm {
	isEdit?: boolean
	onRefresh?: Function
	parent?: any
	onOpen?: Function
}

const url = 'UserInformation'

const AddChildForm: FC<IParentForm> = (props) => {
	const { isEdit, onRefresh, parent } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	const [students, setStudents] = useState<any>([])

	async function toggle() {
		setVisible(!visible)
	}

	useEffect(() => {
		if (visible) {
			getStudents()
		}
	}, [visible])

	const getStudents = async () => {
		setLoading(true)
		try {
			let res = await RestApi.get<any>('UserInformation', { pageSize: 9999999, pageIndex: 1, RoleIds: '3' })
			if (res.status == 200) {
				setStudents(res.data.data)
			}
			if (res.status == 204) {
				setStudents([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading(false)
		}
	}

	function onFinish(params) {
		const DATA_SUBMIT = {
			UserInformationId: params?.StudentId,
			ParentId: parent?.UserInformationId
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!isEdit && post(DATA_SUBMIT)
	}

	async function post(params) {
		setLoading(true)
		try {
			const response = await RestApi.put(url, params)
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

	return (
		<>
			<PrimaryButton onClick={toggle} background="green" icon="add" type="button">
				Thêm học viên
			</PrimaryButton>

			<Modal
				width={500}
				title="Thêm học viên liên kết"
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submitForm} />}
			>
				<Card className="mb-[16px] card-min-padding">
					<div className="flex relative">
						<Avatar uri={parent?.Avatar} className="w-[64px] h-[64px] rounded-full shadow-sm border-[1px] border-solid border-[#f4f4f4]" />
						<div className="flex-1 ml-[16px]">
							<div className="w-full in-1-line font-[600] text-[16px]">{parent?.FullName}</div>
							<div className="w-full in-1-line font-[400] text-[14px]">
								<div className="font-[600] inline-flex">Mã phụ huynh:</div> {parent?.UserCode}
							</div>
							<div className="w-full in-1-line font-[400] text-[14px]">
								<div className="font-[600] inline-flex">Điện thoại:</div> {parent?.Mobile}
							</div>
						</div>
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
					<Form.Item className="col-span-2 ant-select-class-selected mt-[16px]" name="StudentId" label="Học viên" rules={formRequired}>
						<Select
							showSearch
							optionFilterProp="children"
							allowClear={true}
							disabled={loading}
							placeholder="Chọn học viên"
							className="ant-select-item-option-selected-blue"
						>
							{students.map((item) => {
								return (
									<Select.Option key={item.UserInformationId} value={item.UserInformationId}>
										{item?.FullName}
										<div className="hiddens ant-select-dropdown-by-chau">
											<div className="text-[12px]">Mã: {item?.UserCode}</div>
											<div className="text-[12px]">Ngày sinh: {!!item?.DOB ? moment(item?.DOB).format('DD/MM/YYYY') : 'Không rõ'}</div>
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

export default AddChildForm
