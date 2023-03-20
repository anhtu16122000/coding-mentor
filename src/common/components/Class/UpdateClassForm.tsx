import { Form, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { classApi } from '~/api/class'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import InputNumberField from '../FormControl/InputNumberField'
import InputTextField from '../FormControl/InputTextField'
import SelectField from '../FormControl/SelectField'
import UploadImageField from '../FormControl/UploadImageField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const UpdateClassForm = (props) => {
	const { dataRow, setTodoApi, listTodoApi, academic, setShowPop, getAllClass } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const [teacher, setTeacher] = useState([])
	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = {
				...data,
				Id: dataRow?.Id
			}
			const res = await classApi.updateClass(DATA_SUBMIT)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				setIsModalOpen(false)
				getAllClass && getAllClass()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getAllTeacherByBranchAndProgram = async (branchId, programId) => {
		try {
			const res = await classApi.getAllTeacherWhenCreate({ branchId: branchId, programId: programId })
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'TeacherName', 'TeacherId')
				setTeacher(convertData)
			}
			if (res.status === 204) {
				setTeacher([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (!!isModalOpen && dataRow) {
			getAllTeacherByBranchAndProgram(dataRow.BranchId, dataRow.ProgramId)
			form.setFieldsValue(dataRow)
		}
	}, [isModalOpen])

	return (
		<>
			<IconButton
				icon="edit"
				type="button"
				tooltip="Cập nhật"
				color="yellow"
				onClick={() => {
					setIsModalOpen(true)
					setShowPop && setShowPop('')
				}}
			/>
			<Modal
				title="Cập nhật lớp học"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				centered
				footer={
					<PrimaryButton background="blue" icon="save" type="button" onClick={form.submit} loading={isLoading} disable={isLoading}>
						Lưu
					</PrimaryButton>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<UploadImageField form={form} name="Thumbnail" label="Hình đại diện" />
					<div className="row">
						<div className="col-md-6 col-12">
							<InputTextField name="Name" label="Tên lớp" />
						</div>
						<div className="col-md-6 col-12">
							<InputNumberField name="Price" label="Giá lớp học" />
						</div>
						<div className="col-md-6 col-12">
							<InputNumberField name="MaxQuantity" label="Số lượng học viên tối đa" />
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								name="Status"
								label="Trạng thái"
								optionList={[
									{ value: 1, title: 'Sắp diễn ra' },
									{ value: 2, title: 'Đang diễn ra' },
									{ value: 3, title: 'Kết thúc' }
								]}
							/>
						</div>
						<div className="col-md-6 col-12">
							<SelectField name="AcademicId" label="Học vụ" optionList={academic} />
						</div>
						<div className="col-md-6 col-12">
							<SelectField name="TeacherId" label="Giáo viên" optionList={teacher} />
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default UpdateClassForm
