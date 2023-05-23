import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { classApi } from '~/api/class'
import { ShowNostis } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import InputNumberField from '../../FormControl/InputNumberField'
import InputTextField from '../../FormControl/InputTextField'
import SelectField from '../../FormControl/SelectField'
import UploadImageField from '../../FormControl/UploadImageField'
import IconButton from '../../Primary/IconButton'
import { FaEdit } from 'react-icons/fa'
import ModalFooter from '../../ModalFooter'

const UpdateClassForm = (props) => {
	const { dataRow, academic, setShowPop, onRefresh } = props

	const [form] = Form.useForm()

	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [teachers, setTeachers] = useState([])

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			const res = await classApi.updateClass({ ...data, Id: dataRow?.Id })
			if (res.status == 200) {
				setVisible(false)
				!!onRefresh && onRefresh()
				ShowNostis.success(res.data.message)
			}
		} catch (err) {
			ShowNostis.error(err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getTeachers = async (branchId, programId) => {
		try {
			const res = await classApi.getAllTeachers({ branchId: branchId, programId: programId })
			if (res.status == 200) {
				const convertData = parseSelectArray(res.data.data, 'TeacherName', 'TeacherId')
				setTeachers(convertData)
			} else {
				setTeachers([])
			}
		} catch (err) {
			ShowNostis.error(err.message)
		}
	}

	useEffect(() => {
		if (!!visible && dataRow) {
			getTeachers(dataRow.BranchId, dataRow.ProgramId)
			form.setFieldsValue(dataRow)
		}
	}, [visible])

	function toggle() {
		setVisible(!visible)
	}

	function showMopdal() {
		toggle()
		setShowPop && setShowPop('')
	}

	return (
		<>
			{!!props?.isPro && (
				<div onClick={showMopdal} className="pro-menu-item text-primary the-item-pro">
					<FaEdit className="pro-edit" />
					<div className="ml-[8px] font-[500]">Cập nhật</div>
				</div>
			)}

			{!props?.isPro && <IconButton icon="edit" type="button" tooltip="Cập nhật" color="yellow" onClick={showMopdal} />}

			<Modal
				title="Cập nhật lớp học"
				open={visible}
				onCancel={toggle}
				centered
				footer={<ModalFooter loading={isLoading} onCancel={toggle} onOK={form.submit} />}
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
							<SelectField name="TeacherId" label="Giáo viên" optionList={teachers} />
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default UpdateClassForm
