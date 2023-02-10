import { Form, Modal, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { paymentMethodsApi } from '~/api/payment-method'
import { ShowNoti } from '~/common/utils'
import EditorField from '../FormControl/EditorField'
import SelectField from '../FormControl/SelectField'
import UploadImageField from '../FormControl/UploadImageField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import PrimaryEditor from '../Editor'

const PaymentMethodForm = (props) => {
	const { dataRow, setTodoApi, initTodoApi } = props
	const [form] = Form.useForm()
	const [openModal, setOpenModal] = useState(false)
	const [statusShow, setStatusShow] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = {
				...dataRow,
				...data
			}
			const res = await paymentMethodsApi.update(DATA_SUBMIT)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				setTodoApi(initTodoApi)
				setOpenModal(false)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		if (!!openModal && !!dataRow) {
			console.log('dataRow: ', dataRow)
			form.setFieldsValue(dataRow)
			setStatusShow(dataRow.Active)
		}
	}, [openModal])
	const handleChangeStatus = (data) => {
		setStatusShow(data)
	}
	return (
		<div>
			<IconButton icon="edit" color="yellow" type="button" tooltip="Cập nhật" onClick={() => setOpenModal(true)} />
			<Modal
				centered
				width={600}
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title="Cập nhật"
				footer={
					<PrimaryButton type="button" icon="save" background="blue" onClick={form.submit} disable={isLoading} loading={isLoading}>
						Lưu
					</PrimaryButton>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="grid grid-cols-2">
						<div className="col-span-1">
							<UploadImageField form={form} name="Thumbnail" label="Hình ảnh" />
						</div>

						<div className="col-span-1">
							<Form.Item name="Active" label="Trạng thái" className="antd-custom-wrap">
								<Switch onChange={handleChangeStatus} checked={statusShow} />
							</Form.Item>
						</div>
					</div>

					<Form.Item className="col-span-4" label="Mô tả" name="Description" required rules={formNoneRequired}>
						<PrimaryEditor
							id={`quest-content-${new Date().getTime()}`}
							height={300}
							initialValue={dataRow?.Description || ''}
							onChange={(event) => form.setFieldValue('Description', event)}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}

export default PaymentMethodForm
