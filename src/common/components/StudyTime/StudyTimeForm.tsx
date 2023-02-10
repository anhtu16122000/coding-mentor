import { Form, Modal, Spin, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { studyTimeApi } from '~/api/study-time'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { Edit } from 'react-feather'
import { ShowNoti } from '~/common/utils'
import TimePickerField from '../FormControl/TimePickerField'
import * as yup from 'yup'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

type IStudyTimeForm = {
	getDataSource?: Function
	rowData?: any
}

const StudyTimeForm = (props: IStudyTimeForm) => {
	const { getDataSource, rowData } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()

	let schema = yup.object().shape({
		StartTime: yup.string().required('Bạn không được để trống'),
		EndTime: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	// ON SUBMIT
	const onSubmit = async (dataSubmit: any) => {
		setIsLoading(true)
		let DATA_SUBMIT = null
		if (rowData) {
			DATA_SUBMIT = {
				...rowData,
				...dataSubmit,
				StartTime: moment(dataSubmit.StartTime).format('HH:mm'),
				EndTime: moment(dataSubmit.EndTime).format('HH:mm')
			}
		} else {
			DATA_SUBMIT = {
				...dataSubmit,
				StartTime: moment(dataSubmit.StartTime).format('HH:mm'),
				EndTime: moment(dataSubmit.EndTime).format('HH:mm')
			}
		}
		try {
			const res = !!rowData?.Id ? await studyTimeApi.update(DATA_SUBMIT) : await studyTimeApi.add(DATA_SUBMIT)
			if (res.status === 200) {
				getDataSource()
				setIsModalVisible(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				rowData.StartTime = moment(rowData.StartTime, 'HH:mm')
				rowData.EndTime = moment(rowData.EndTime, 'HH:mm')
				form.setFieldsValue(rowData)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowData ? (
				<IconButton type="button" color="yellow" icon="edit" onClick={() => setIsModalVisible(true)} tooltip="Cập nhật" />
			) : (
				<PrimaryButton background="green" type="button" icon="add" onClick={() => setIsModalVisible(true)}>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={rowData ? 'Cập nhật ca học' : 'Thêm ca học'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<TimePickerField name="StartTime" label="Thời gian bắt đầu" rules={[yupSync]} isRequired />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<TimePickerField name="EndTime" label="Thời gian kết thúc" rules={[yupSync]} isRequired />
							</div>
						</div>
						<div className="row ">
							<div className="col-12 flex-all-center">
								<PrimaryButton icon="save" type="submit" disable={isLoading} loading={isLoading} background="blue">
									Lưu
								</PrimaryButton>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default StudyTimeForm
