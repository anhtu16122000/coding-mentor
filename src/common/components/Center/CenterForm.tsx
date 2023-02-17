import React, { useEffect, useState } from 'react'
import { Modal, Form, Spin, Tooltip } from 'antd'
import { districtApi, wardApi } from '~/api/area'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import * as yup from 'yup'
import InputTextField from '~/common/components/FormControl/InputTextField'
import SelectField from '~/common/components/FormControl/SelectField'
import { ShowNoti } from '~/common/utils'
import { Edit } from 'react-feather'
import { parseSelectArray } from '~/common/utils/common'
import { branchApi } from '~/api/branch'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const CenterForm = React.memo((props: any) => {
	const { rowData, dataArea, setTodoApi, listTodoApi } = props
	const [form] = Form.useForm()

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [dataDistrict, setDataDistrict] = useState([])
	const [dataWard, setDataWard] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	let schema = yup.object().shape({
		Code: yup.string().required('Bạn không được để trống'),
		Name: yup.string().required('Bạn không được để trống'),
		// AreaId: yup.mixed().nullable().required('Bạn không được để trống'),
		// DistrictId: yup.mixed().nullable().required('Bạn không được để trống'),
		// WardId: yup.mixed().nullable().required('Bạn không được để trống'),
		// Email: yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống'),
		Address: yup.string().required('Bạn không được để trống')
		// Mobile: yup
		// 	.string()
		// 	.matches(/(\+84|0)\d{9,10}/, 'Số điện thoại không đúng định dạng')
		// 	.required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const getAllDistrictByArea = async (areaId) => {
		try {
			const res = await districtApi.getAll({ pageSize: 99999, areaId: areaId })
			if (res.status == 200) {
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				setDataDistrict(convertData)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllWardByDistrict = async (districtId) => {
		try {
			const res = await wardApi.getAll({ pageSize: 99999, districtId: districtId })
			if (res.status == 200) {
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				setDataWard(convertData)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	// SUBMI FORM
	const handleSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			const dataSubmit = {
				...rowData,
				...data
			}
			const res = await (dataSubmit?.Id ? branchApi.update(dataSubmit) : branchApi.add(dataSubmit))
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				setIsModalVisible(false)
				setTodoApi(listTodoApi)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	// ON CHANGE SELECT
	const onChangeSelect = (value, name) => {
		form.setFieldValue(name, value)
		switch (name) {
			case 'AreaId':
				getAllDistrictByArea(value)
				form.setFieldValue('DistrictId', [])
				break
			case 'DistrictId':
				getAllWardByDistrict(value)
				form.setFieldValue('WardId', [])
				break
			default:
				break
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			if (rowData?.Id) {
				form.setFieldsValue({
					...rowData,
					AreaId: rowData.AreaId,
					DistrictId: rowData.DistrictId,
					WardId: rowData.WardId
				})
				getAllDistrictByArea(rowData.AreaId) && rowData.DistrictId
				getAllWardByDistrict(rowData.DistrictId) && rowData.WardId
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowData ? (
				<IconButton
					icon="edit"
					color="yellow"
					tooltip={'Cập nhật'}
					onClick={() => {
						setIsModalVisible(true)
					}}
					type="button"
				/>
			) : (
				<PrimaryButton icon="add" type="button" onClick={() => setIsModalVisible(true)} background="green">
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={rowData ? 'Cập nhật trung tâm' : 'Thêm trung tâm'}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				centered={true}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={handleSubmit}>
						<div className="row">
							<div className="col-12">
								<InputTextField isRequired name="Code" label="Mã trung tâm" rules={[yupSync]} />
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<InputTextField isRequired name="Name" label="Tên trung tâm" rules={[yupSync]} />
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<InputTextField name="Mobile" label="Số điện thoại" />
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<InputTextField name="Email" label="Email" />
							</div>
						</div>

						<div className="row">
							<div className="col-md-6 col-12">
								<InputTextField name="Address" label="Địa chỉ" />
							</div>

							<div className="col-md-6 col-12">
								<SelectField
									name="AreaId"
									label="Tỉnh/Thành"
									optionList={dataArea}
									onChangeSelect={(value) => onChangeSelect(value, 'AreaId')}
								/>
							</div>
						</div>

						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField
									name="DistrictId"
									label="Quận/Huyện"
									optionList={dataDistrict}
									onChangeSelect={(value) => onChangeSelect(value, 'DistrictId')}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField name="WardId" label="Phường/Xã" optionList={dataWard} />
							</div>
						</div>
						<button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
							<MdSave size={18} className="mr-2" /> Lưu {isLoading && <Spin className="loading-base" />}
						</button>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default CenterForm
