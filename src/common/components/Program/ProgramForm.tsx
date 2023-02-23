import React, { useEffect, useState } from 'react'
import { Modal, Form } from 'antd'
import EditorField from '~/common/components/FormControl/EditorField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import SelectField from '~/common/components/FormControl/SelectField'
import { ShowNoti } from '~/common/utils'
import { programApi } from '~/api/program'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const ProgramForm = React.memo((props: any) => {
	const { rowData, specialize, setTodoApi, listTodoApi } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = null
			let res
			if (rowData) {
				DATA_SUBMIT = { ...rowData, ...data }
				res = await programApi.update(DATA_SUBMIT)
			} else {
				DATA_SUBMIT = { ...data }
				res = await programApi.add(DATA_SUBMIT)
			}
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				setIsModalVisible(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	// IS VISIBLE MODAL
	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				form.setFieldsValue(rowData)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowData ? (
				<IconButton icon="edit" tooltip="Cập nhật" onClick={() => setIsModalVisible(true)} color="yellow" type="button" />
			) : (
				<PrimaryButton onClick={() => setIsModalVisible(true)} icon="add" background="green" type="button">
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={`${rowData ? 'Cập nhật' : 'Tạo'} chương trình`}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={850}
				centered
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField disabled={rowData} placeholder="Chọn chuyên môn" name="GradeId" label="Chuyên môn" optionList={specialize} />
							</div>

							<div className="col-md-6 col-12">
								<InputTextField
									placeholder="Nhập mã trương trình"
									name="Code"
									label="Mã chương trình"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								/>
							</div>

							<div className="col-md-6 col-12">
								<InputTextField
									placeholder="Nhập tên trương trình"
									name="Name"
									label="Tên chương trình"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								/>
							</div>

							<div className="col-md-6 col-12">
								<InputNumberField
									className="w-full"
									placeholder="Nhập học phí"
									name="Price"
									label="Học phí"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								/>
							</div>

							<div className="col-12">
								<EditorField
									id={rowData?.Id}
									name="Description"
									label="Mô tả"
									onChangeEditor={(value) => form.setFieldValue('Description', value)}
									height={250}
								/>
							</div>
						</div>

						<div className="row">
							<div className="col-12 text-center">
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
})

export default ProgramForm
