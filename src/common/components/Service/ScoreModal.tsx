import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { testAppointmentApi } from '~/api/test-appointment'
import { ShowNoti } from '~/common/utils'
import InputTextField from '../FormControl/InputTextField'
import InputNumberField from '../FormControl/InputNumberField'
import TextBoxField from '../FormControl/TextBoxField'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const ScoreModal = (props) => {
	const { rowData, listTodoApi, setTodoApi } = props
	const [isVisible, setVisible] = useState(false)
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = { ...rowData, ...data }
			const res = await testAppointmentApi.update(DATA_SUBMIT)
			if (res.status === 200) {
				setVisible(false)
				setTodoApi(listTodoApi)
				form.resetFields()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!!rowData) {
			form.setFieldsValue(rowData)
		}
	}, [isVisible])

	return (
		<>
			<IconButton tooltip="Nhập điểm thủ công" icon="edit3" onClick={() => setVisible(true)} type="button" color="black" />

			<Modal
				className="wrap-score"
				width={900}
				onCancel={() => setVisible(false)}
				title="Nhập điểm thủ công"
				open={isVisible}
				footer={
					<>
						<PrimaryButton disable={isLoading} loading={isLoading} onClick={form.submit} type="button" background="blue" icon="save">
							Lưu
						</PrimaryButton>
					</>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="row text-center">
						<div className="col-md-2">
							<InputTextField name="ListeningPoint" label="Listening" />
						</div>
						<div className="col-md-2">
							<InputTextField name="SpeakingPoint" label="Speaking" />
						</div>
						<div className="col-md-2">
							<InputTextField name="ReadingPoint" label="Reading" />
						</div>
						<div className="col-md-2">
							<InputTextField name="WritingPoint" label="Writing" />
						</div>
						<div className="col-md-2">
							<InputTextField name="Vocab" label="Vocabulary" />
						</div>
						<div className="col-md-2">
							<InputNumberField className="w-full" name="Tuitionfee" label="Học phí tư vấn" />
						</div>
						<div className="col-12">
							<TextBoxField name="Note" label="Ghi chú" />
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default ScoreModal
