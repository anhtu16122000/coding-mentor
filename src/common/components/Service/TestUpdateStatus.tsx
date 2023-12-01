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
			const res = await testAppointmentApi.update({ ...rowData, LearningStatus: data.LearningStatus })
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
					{rowData?.LearningStatus == 1 && (
						<p className="tag red">
							{rowData.LearningStatusName} <TiArrowSortedDown size={16} className="mt-[-3px]" />
						</p>
					)}

					{rowData?.LearningStatus == 2 && (
						<p className="tag blue">
							{rowData.LearningStatusName} <TiArrowSortedDown size={16} className="mt-[-3px]" />
						</p>
					)}

					{rowData?.LearningStatus == 3 && (
						<p className="tag black">
							{rowData.LearningStatusName} <TiArrowSortedDown size={16} className="mt-[-3px]" />
						</p>
					)}

					{rowData?.LearningStatus != 1 && rowData?.LearningStatus != 2 && rowData?.LearningStatus != 3 && (
						<p className="tag yellow">
							{rowData.LearningStatusName} <TiArrowSortedDown size={16} className="mt-[-3px]" />
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
						name="LearningStatus"
						label="Trạng thái"
						optionList={[
							{ value: 1, title: 'Chờ kiểm tra' },
							{ value: 2, title: 'Đã kiểm tra' },
							{ value: 3, title: 'Không học' },
							{ value: 4, title: 'Chờ xếp lớp' }
						]}
					/>
				</Form>
			</Modal>
		</>
	)
}

export default TestUpdateStatus
