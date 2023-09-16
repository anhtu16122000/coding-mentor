import { Modal, Form, Input, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import ButtonAdd from '~/common/components/DirtyButton/Button-Add'
import ModalFooter from '~/common/components/ModalFooter'
import { FaCartPlus, FaEdit, FaPlus } from 'react-icons/fa'
import { is } from '~/common/utils/common'
import { packageSectionApi } from '~/api/packed/packages-section'
import { packageSkillApi } from '~/api/packed/packages-skill'
import { ieltsExamApi } from '~/api/IeltsExam'
import { HiOutlinePlus } from 'react-icons/hi'

const FormPackageSkill: FC<ICreateExam & { packageSectionId: any }> = (props) => {
	const { onRefresh, isEdit, defaultData, onOpen, packageId, packageSectionId } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (visible) {
			!!onOpen && onOpen()
		}
	}, [visible])

	async function putUpdate(param) {
		try {
			const response = await packageSkillApi.put(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	async function postNew(param) {
		try {
			const response = await packageSkillApi.post(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const onFinish = async (values) => {
		const DATA_SUBMIT = { ...values, Thumbnail: '', Active: true, PackageSectionId: packageSectionId || null }

		setLoading(true)

		if (!isEdit) {
			postNew(DATA_SUBMIT)
		}

		if (!!isEdit) {
			putUpdate({ ...DATA_SUBMIT, Id: defaultData.Id })
		}
	}

	function openEdit() {
		form.setFieldsValue({ ...defaultData })
		setVisible(true)
	}

	const [exams, setExams] = useState([])

	async function getExams() {
		try {
			const res = await ieltsExamApi.getOptions()
			if (res.status == 200) {
				setExams(res.data?.data)
			} else {
				setExams([])
			}
		} catch (error) {}
	}

	useEffect(() => {
		if (visible && exams.length == 0) {
			getExams()
		}
	}, [visible])

	const user = useSelector((state: RootState) => state.user.information)

	return (
		<>
			{is(user).admin && !isEdit && (
				<div onClick={() => setVisible(true)} className="pe-i-d-cart !px-[8px] !pl-[6px]">
					<FaPlus size={14} />
					<div className="pe-i-d-c-title">Thêm kỹ năng</div>
				</div>
			)}

			{is(user).admin && !!isEdit && (
				<div onClick={openEdit} className="pe-menu-item mt-[8px]">
					<FaEdit size={16} color="#1b73e8" />
					<div className="ml-[8px]">Chỉnh sửa</div>
				</div>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật chương' : 'Tạo chương'}
				width={400}
				open={visible}
				onCancel={() => !loading && setVisible(false)}
				footer={<ModalFooter loading={loading} onOK={() => form.submit()} onCancel={() => setVisible(false)} />}
			>
				<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-4 gap-x-4">
						<Form.Item className="col-span-4" label="Tên" name="Name" rules={formRequired}>
							<Input disabled={loading} className="primary-input" />
						</Form.Item>

						<Form.Item className="col-span-4" name="IeltsExamId" label="Đề" rules={formRequired}>
							<Select
								showSearch
								optionFilterProp="children"
								className="primary-input"
								loading={loading}
								disabled={loading}
								placeholder="Chọn đề"
							>
								{exams.map((item) => {
									return (
										<Select.Option key={item.Id} value={item.Id}>
											[{item?.Code}] - {item?.Name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default FormPackageSkill
