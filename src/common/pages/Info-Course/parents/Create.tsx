import { Divider, Form, Input, Modal, Select } from 'antd'
import React, { FC, useEffect, useMemo, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { branchApi } from '~/api/branch'
import { parseSelectArray, parseToMoney } from '~/common/utils/common'
import { PrimaryTooltip } from '~/common/components'
import PrimaryButton from '~/common/components/Primary/Button'
import ButtonEdit from '~/common/components/TableButton/EDIT'
import ModalFooter from '~/common/components/ModalFooter'
import SelectField from '~/common/components/FormControl/SelectField'
import InputPassField from '~/common/components/FormControl/InputPassField'
import UploadImageField from '~/common/components/FormControl/UploadImageField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { areaApi, districtApi, wardApi } from '~/api/area'
import { useDispatch } from 'react-redux'
import { setArea } from '~/store/areaReducer'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import moment from 'moment'

interface IParentForm {
	isEdit?: boolean
	onRefresh?: Function
	item?: any
	defaultData: any
	onOpen?: Function
}

const url = 'UserInformation'

const ParentForm: FC<IParentForm> = ({ isEdit, onRefresh, defaultData, item }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [methods, setMethods] = useState<any>([])
	const [branch, setBranch] = useState<IBranch[]>(null)

	const area = useSelector((state: RootState) => state.area.Area)

	async function toggle() {
		setVisible(!visible)
	}

	function openEdit() {
		setVisible(!visible)
		form.setFieldsValue(defaultData)
		form.setFieldValue('BranchIds', parseInt(defaultData?.BranchIds))
		form.setFieldValue('DOB', moment(defaultData?.DOB) || null)
	}

	useEffect(() => {
		if (visible) {
			getBranchs()
			getJobs()
			getAllArea()
		}
	}, [visible])

	const [jobs, setJobs] = useState([])
	const getJobs = async () => {
		try {
			const res = await RestApi.get<any>('job', { pageIndex: 1, pageSize: 99999 })
			if (res.status === 200) {
				setJobs(res.data.data)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const [branchLoading, setBranchLoading] = useState(false)
	const getBranchs = async () => {
		if (!branch) {
			setBranchLoading(true)
			try {
				const response = await branchApi.getAll({ pageIndex: 1, pageSize: 99999 })
				response.status == 200 && setBranch(response.data.data)
			} catch (err) {
				ShowNostis.error(err?.message)
			} finally {
				form.setFieldValue('BranchId', item?.BranchId)
				setBranchLoading(false)
			}
		}
	}

	const dispatch = useDispatch()
	const getAllArea = async () => {
		try {
			const response = await areaApi.getAll({ pageSize: 99999 })
			if (response.status === 200) {
				dispatch(setArea(response.data.data))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const [districts, setDistricts] = useState([])
	const getDistrictByArea = async (areaId) => {
		try {
			const response = await districtApi.getAllByArea(areaId)
			if (response.status === 200) {
				const convertWard = parseSelectArray(response.data.data, 'Name', 'Id')
				setDistricts(convertWard)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const [wards, setWards] = useState([])
	const getWardByDistrict = async (districtId) => {
		try {
			const response = await wardApi.getAllByDistrict(districtId)
			if (response.status === 200) {
				const convertWard = parseSelectArray(response.data.data, 'Name', 'Id')
				setWards(convertWard)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	function onFinish(params) {
		setLoading(true)

		const DATA_SUBMIT = {
			...params,
			BranchIds: params?.BranchIds + '',
			RoleId: 8
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!isEdit && post(DATA_SUBMIT)
		isEdit && edit(DATA_SUBMIT)
	}

	async function post(params) {
		try {
			const response = await RestApi.post(url, params)
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function edit(params) {
		try {
			const response = await RestApi.put(url, { ...params, UserInformationId: defaultData?.UserInformationId })
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function submitForm() {
		form.submit()
	}

	const convertAreaSelect = useMemo(() => {
		return parseSelectArray(area, 'Name', 'Id')
	}, [area])

	return (
		<>
			{!isEdit && (
				<PrimaryButton onClick={toggle} background="green" icon="add" type="button">
					Thêm mới
				</PrimaryButton>
			)}

			{!!isEdit && (
				<PrimaryTooltip id={`edit-${defaultData?.UserInformationId}`} place="left" content="Cập nhật">
					<ButtonEdit onClick={openEdit} className="ml-[16px]" />
				</PrimaryTooltip>
			)}

			<Modal
				width={600}
				title={!isEdit ? 'Thêm phụ huynh' : 'Cập nhật phụ huynh'}
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submitForm} />}
			>
				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<div className="col-span-2">
						<UploadImageField name="Avatar" label="Hình ảnh" form={form} />
					</div>
					<Form.Item className="col-span-1" name="FullName" label="Họ tên" rules={formRequired}>
						<Input className="primary-input" />
					</Form.Item>
					<Form.Item className="col-span-1" name="UserName" label="Tên đăng nhập" rules={formRequired}>
						<Input className="primary-input" />
					</Form.Item>
					<Form.Item className="col-span-1" name="Mobile" label="Điện thoại" rules={formRequired}>
						<Input className="primary-input" />
					</Form.Item>
					<Form.Item className="col-span-1" name="Email" label="Email" rules={formRequired}>
						<Input className="primary-input" />
					</Form.Item>
					<Form.Item className="col-span-1" name="BranchIds" label="Trung tâm" rules={formRequired}>
						<Select
							loading={branchLoading}
							disabled={loading}
							className="style-input"
							showSearch
							optionFilterProp="children"
							allowClear={true}
							placeholder="Chọn trung tâm"
						>
							{branch?.map((item, index) => (
								<Select.Option key={index} value={item.Id}>
									{item.Name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<SelectField
						className="col-12"
						label="Giới tính"
						name="Gender"
						placeholder="Chọn giới tính"
						optionList={[
							{ value: 0, title: 'Khác' },
							{ value: 1, title: 'Nam' },
							{ value: 2, title: 'Nữ' }
						]}
					/>
					{!isEdit && (
						<Form.Item name="JobId" className="col-span-1" label="Công việc" rules={formNoneRequired}>
							<Select className="primary-input" placeholder="Chọn công việc">
								{jobs.map((item) => {
									return (
										<Select.Option key={item.Id} value={item.Id}>
											<div className="flex items-center justify-between w-full">{item.Name}</div>
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
					)}

					{isEdit && (
						<SelectField
							className="col-span-1"
							label="Trạng thái"
							name="StatusId"
							optionList={[
								{ value: 0, title: 'Hoạt động' },
								{ value: 1, title: 'Khóa' }
							]}
						/>
					)}

					{isEdit ? (
						<InputPassField className="col-span-1" label="Mật khẩu" name="Password" />
					) : (
						<InputTextField className="col-span-1" label="Mật khẩu" name="Password" />
					)}

					<DatePickerField rules={formRequired} className="col-span-1" label="Ngày sinh" name="DOB" mode="single" format="DD/MM/YYYY" />

					<Divider className="col-span-2" orientation="center">
						Địa chỉ
					</Divider>

					<InputTextField className="col-span-1" label="Địa chỉ" name="Address" />
					<SelectField
						className="col-span-1"
						label="Tỉnh / Thành phố"
						name="AreaId"
						optionList={convertAreaSelect}
						onChangeSelect={(value) => getDistrictByArea(value)}
					/>
					<SelectField
						className="col-span-1"
						label="Quận / Huyện"
						name="DistrictId"
						optionList={districts}
						onChangeSelect={(value) => getWardByDistrict(value)}
					/>
					<SelectField className="col-span-1" label="Phường / Xã" name="WardId" optionList={wards} />
				</Form>
			</Modal>
		</>
	)
}

export default ParentForm
