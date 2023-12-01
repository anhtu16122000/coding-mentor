import { Modal, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import SelectField from '~/common/components/FormControl/SelectField'
import { testAppointmentApi } from '~/api/learn/test-appointment'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import PrimaryTooltip from '../PrimaryTooltip'
import { TiArrowSortedDown } from 'react-icons/ti'

const TestUpdateStatus = (props) => {
	const { rowData, setTodoApi, listTodoApi } = props

	const [form] = Form.useForm()

	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const showModal = () => {
		setVisible(true)
	}

	const handleCancel = () => {
		setVisible(false)
	}

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			const res = await testAppointmentApi.update({ ...rowData, Status: data.Status })
			if (res.status == 200) {
				handleCancel()
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (rowData) {
			form.setFieldsValue(rowData)
		}
	}, [visible])

	return (
		<>
			<PrimaryTooltip id={rowData?.id + '-fi'} content="Cập nhật trạng thái" place="left">
				<div onClick={showModal} className="cursor-pointer">
					{rowData?.Status != 1 && rowData?.Status != 2 && !rowData.StatusName && (
						<p className="tag yellow">
							Cập nhật trạng thái <TiArrowSortedDown size={16} className="mt-[-3px]" />
						</p>
					)}

					{rowData?.Status == 1 && (
						<p className="tag red">
							{rowData.StatusName} <TiArrowSortedDown size={16} className="mt-[-3px]" />
						</p>
					)}

					{rowData?.Status == 2 && (
						<p className="tag blue">
							{rowData.StatusName} <TiArrowSortedDown size={16} className="mt-[-3px]" />
						</p>
					)}

					{rowData?.Status != 1 && rowData?.Status != 2 && !!rowData.StatusName && (
						<p className="tag yellow">
							{rowData.StatusName} <TiArrowSortedDown size={16} className="mt-[-3px]" />
						</p>
					)}
				</div>
			</PrimaryTooltip>

			<Modal
				title="Cập nhật trạng thái"
				open={visible}
				onCancel={handleCancel}
				footer={
					<div className="flex-all-center">
						<PrimaryButton disable={isLoading} loading={isLoading} type="button" background="blue" icon="save" onClick={form.submit}>
							Cập nhật
						</PrimaryButton>
					</div>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<SelectField
						name="Status"
						label="Trạng thái"
						optionList={[
							{ value: 1, title: 'Chưa kiểm tra' },
							{ value: 2, title: 'Đã kiểm tra' }
						]}
					/>
				</Form>
			</Modal>
		</>
	)
}

export default TestUpdateStatus
