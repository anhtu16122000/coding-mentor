import { Modal, Form, Input } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import ButtonAdd from '~/common/components/DirtyButton/Button-Add'
import ModalFooter from '~/common/components/ModalFooter'
import { FaEdit } from 'react-icons/fa'
import { is } from '~/common/utils/common'
import { packageSectionApi } from '~/api/packed/packages-section'

const FormPackageSection: FC<ICreateExam> = (props) => {
	const { onRefresh, isEdit, defaultData, onOpen, packageId } = props

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
			const response = await packageSectionApi.put(param)
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
			const response = await packageSectionApi.post(param)
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
		const DATA_SUBMIT = { ...values, Active: true, PackageId: packageId || null }

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

	const user = useSelector((state: RootState) => state.user.information)

	return (
		<>
			{(is(user).admin || is(user).manager) && !isEdit && (
				<div data-tut="reactour-create" className="flex-shrink-0">
					<ButtonAdd icon="outline" onClick={() => setVisible(true)}>
						Tạo mới
					</ButtonAdd>
				</div>
			)}

			{(is(user).admin || is(user).manager) && !!isEdit && (
				<div onClick={openEdit} className="pe-menu-item mt-[8px]">
					<FaEdit size={16} color="#D21320" />
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
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default FormPackageSection
