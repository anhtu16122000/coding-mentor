import { Form, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { classApi } from '~/api/learn/class'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import InputNumberField from '../../FormControl/InputNumberField'
import InputTextField from '../../FormControl/InputTextField'
import SelectField from '../../FormControl/SelectField'
import UploadImageField from '../../FormControl/UploadImageField'
import IconButton from '../../Primary/IconButton'
import { FaEdit } from 'react-icons/fa'
import ModalFooter from '../../ModalFooter'
import PrimaryButton from '../../Primary/Button'
import { certificateConfigApi } from '~/api/certificate/certificate-config'
import { formRequired } from '~/common/libs/others/form'

const UpdateClassForm = (props) => {
	const { dataRow, academic, setShowPop, onRefresh, isDetail, onShow } = props

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

	const [cers, setCers] = useState([])

	const getCers = async () => {
		try {
			const res = await certificateConfigApi.getAll({ pageIndex: 1, pageSize: 99999 })
			if (res.status == 200) {
				const { data, totalRow } = res.data
				setCers(data)
			} else {
				setCers([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
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
			getCers()
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
		onShow && onShow()
	}

	return (
		<>
			{!!props?.isPro && !isDetail && (
				<div onClick={showMopdal} className="pro-menu-item text-primary the-item-pro">
					<FaEdit className="pro-edit" />
					<div className="ml-[8px] font-[500]">Cập nhật</div>
				</div>
			)}

			{props?.isPro && !!isDetail && (
				<PrimaryButton onClick={showMopdal} icon="edit" background="yellow" type="button" className="mr-3">
					Cập nhật
				</PrimaryButton>
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
						<Form.Item className="col-md-6 col-12" name="CertificateTemplateId" label="Chứng chỉ" required={true} rules={formRequired}>
							<Select className="primary-input" showSearch loading={isLoading} placeholder="" optionFilterProp="children">
								{cers.map((cer, index) => {
									return (
										<Select.Option key={cer?.Id} value={cer?.Id}>
											{cer?.Name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default UpdateClassForm
