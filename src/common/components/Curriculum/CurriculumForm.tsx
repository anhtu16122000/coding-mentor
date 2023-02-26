import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { curriculumApi } from '~/api/curriculum'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { Edit } from 'react-feather'
import InputTextField from '../FormControl/InputTextField'
import { useRouter } from 'next/router'
import InputNumberField from '../FormControl/InputNumberField'
import * as yup from 'yup'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const CurriculumForm = (props: any) => {
	const { dataRow, setTodoApi, listTodoApi, onRefresh } = props
	const router = useRouter()
	const { slug, name } = router.query
	const [form] = Form.useForm()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	let schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống'),
		Lesson: yup.string().required('Bạn không được để trống'),
		Time: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	// SUBMI FORM
	const onSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = null
			if (dataRow) {
				DATA_SUBMIT = { ...dataRow, ...data }
			} else {
				DATA_SUBMIT = { ...data, ProgramId: slug }
			}
			const res = await (dataRow?.Id ? curriculumApi.update(DATA_SUBMIT) : curriculumApi.add(DATA_SUBMIT))
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				setIsModalVisible(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
				onRefresh && onRefresh()
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			if (dataRow) {
				form.setFieldsValue(dataRow)
			}
			form.setFieldsValue({ NameProgram: name })
		}
	}, [isModalVisible])

	return (
		<>
			{!!dataRow ? (
				<IconButton tooltip="Cập nhật" icon="edit" onClick={() => setIsModalVisible(true)} type="button" color="yellow" />
			) : (
				<PrimaryButton icon="add" onClick={() => setIsModalVisible(true)} type="button" background="green">
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={dataRow ? 'Cập nhật giáo trình' : 'Thêm giáo trình'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} onFinish={onSubmit} layout="vertical">
						<div className="row">
							<div className="col-12">
								<InputTextField className="form-disable" disabled label="Chương trình" name="NameProgram" />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputTextField placeholder="Nhập tên giáo trình" label="Tên giáo trình" name="Name" isRequired rules={[yupSync]} />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputNumberField
									placeholder="Nhập số buổi học"
									className="w-full"
									label="Số buổi học"
									name="Lesson"
									isRequired
									rules={[yupSync]}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputNumberField
									placeholder="Nhập thời gian buổi học"
									className="w-full"
									label="Thời gian buổi học"
									name="Time"
									isRequired
									rules={[yupSync]}
								/>
							</div>
						</div>
						<div className="row ">
							<div className="col-12 mt-3 flex-all-center">
								<PrimaryButton type="submit" background="blue" icon="save">
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

export default CurriculumForm
