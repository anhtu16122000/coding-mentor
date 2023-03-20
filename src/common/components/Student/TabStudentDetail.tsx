import { Card, Divider, Form } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { areaApi, districtApi, wardApi } from '~/api/area'
import { branchApi } from '~/api/branch'
import { learningNeedApi } from '~/api/learning-needs'
import { purposeApi } from '~/api/purpose'
import { sourceApi } from '~/api/source'
import { userInformationApi } from '~/api/user'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import DatePickerField from '../FormControl/DatePickerField'
import InputTextField from '../FormControl/InputTextField'
import SelectField from '../FormControl/SelectField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'

export interface ITabStudentDetailProps {
	StudentDetail: IUserResponse
}

export default function TabStudentDetail(props: ITabStudentDetailProps) {
	const { StudentDetail } = props
	const [optionList, setOptionList] = useState({ branch: [], purpose: [], area: [], source: [], learningNeed: [], sale: [] })
	const [district, setDistrict] = useState([])
	const [ward, setWard] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const userInformation = useSelector((state: RootState) => state.user.information)
	const router = useRouter()

	const getDistrict = async (areaID) => {
		try {
			const res = await districtApi.getAllByArea(areaID)
			if (res.status === 200) {
				let temp = []
				res.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				setDistrict(temp)
			}
			if (res.status === 204) {
				setDistrict([])
			}
		} catch (err) {}
	}

	const getWard = async (districtID) => {
		try {
			const res = await wardApi.getAllByDistrict(districtID)
			if (res.status === 200) {
				let temp = []
				res.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				setWard(temp)
			}
			if (res.status === 204) {
				setWard([])
			}
		} catch (err) {}
	}

	const getInfoOptions = async () => {
		try {
			const [branchResponse, areaResponse, sourceResponse, learningResponse, saleResponse, purposeResponse] = await Promise.all([
				branchApi.getAll({ pageIndex: 1, pageSize: 99999 }),
				areaApi.getAll({ pageIndex: 1, pageSize: 99999 }),
				sourceApi.getAll({ pageIndex: 1, pageSize: 99999 }),
				learningNeedApi.getAll({ pageIndex: 1, pageSize: 99999 }),
				userInformationApi.getByRole(5),
				purposeApi.getAll({ pageIndex: 1, pageSize: 99999 })
			])

			let tempOption = { branch: [], purpose: [], area: [], source: [], learningNeed: [], sale: [] }

			if (branchResponse.status == 200) {
				let temp = []
				branchResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.branch = temp
			}
			if (purposeResponse.status == 200) {
				let temp = []
				purposeResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.purpose = temp
			}
			if (sourceResponse.status == 200) {
				let temp = []
				sourceResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.source = temp
			}
			if (learningResponse.status == 200) {
				let temp = []
				learningResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.learningNeed = temp
			}
			if (saleResponse.status == 200) {
				let temp = []
				saleResponse.data.data.forEach((data) => temp.push({ title: data.FullName, value: data.UserInformationId }))
				tempOption.sale = temp
			}
			if (areaResponse.status == 200) {
				let temp = []
				areaResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.area = temp
			}

			setOptionList(tempOption)
		} catch (err) {}
	}

	useEffect(() => {
		getInfoOptions()
	}, [])

	useEffect(() => {
		if (StudentDetail) {
			form.setFieldsValue({
				...StudentDetail,
				BranchIds: Number(StudentDetail.BranchIds),
				DOB: StudentDetail?.DOB ? moment(StudentDetail?.DOB) : null
			})
			if (StudentDetail.AreaId) {
				getDistrict(StudentDetail.AreaId)
			}
			if (StudentDetail.DistrictId) {
				getWard(StudentDetail.DistrictId)
			}
		}
	}, [StudentDetail])

	const _onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let res = await userInformationApi.update({
				...data,
				UserInformationId: StudentDetail.UserInformationId,
				DOB: data.DOB ? new Date(data.DOB) : null
			})
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			setIsLoading(false)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			<Card title="Thông tin cá nhân">
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="row">
						<div className="col-md-6 col-12">
							<InputTextField name="FullName" label="Họ tên" />
						</div>
						<div className="col-md-6 col-12">
							<InputTextField name="UserName" label="Tên đăng nhập" />
						</div>
						<div className="col-md-6 col-12">
							<InputTextField name="Mobile" label="Số điện thoại" />
						</div>
						<div className="col-md-6 col-12">
							<InputTextField name="Email" label="Email" />
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								name="Gender"
								label="Giới tính"
								optionList={[
									{ value: 0, title: 'Khác' },
									{ value: 1, title: 'Nam' },
									{ value: 2, title: 'Nữ' }
								]}
							/>
						</div>
						<div className="col-md-6 col-12">
							<DatePickerField label="Ngày sinh" name="DOB" mode="single" format="DD/MM/YYYY" allowClear={true} />
						</div>

						<div className="col-md-6 col-12">
							<SelectField
								name="StatusId"
								label="Trạng thái hoạt động"
								optionList={[
									{
										value: 0,
										title: 'Hoạt động'
									},
									{
										value: 1,
										title: 'Khóa'
									}
								]}
								placeholder="Chọn trạng thái hoạt động"
							/>
						</div>
						<div className="col-md-6 col-12">
							<TextBoxField name="Extension" label="Giới thiệu thêm" />
						</div>
						<Divider>Địa chỉ</Divider>

						<div className="col-12">
							<SelectField name="BranchIds" label="Trung tâm" optionList={optionList.branch} onChangeSelect={(data) => {}} />
						</div>

						<div className="col-md-6 col-12">
							<InputTextField name="Address" label="Địa chỉ" />
						</div>

						<div className="col-md-6 col-12">
							<SelectField
								name="AreaId"
								label="Tỉnh/thành phố"
								placeholder="Chọn tỉnh/thành phố"
								optionList={optionList.area}
								onChangeSelect={(data) => {
									getDistrict(data)
								}}
							/>
						</div>

						<div className="col-md-6 col-12">
							<SelectField
								disabled={district.length > 0 ? false : true}
								name="DistrictId"
								label="Quận/huyện"
								placeholder="Chọn quận/huyện"
								optionList={district}
								onChangeSelect={(data) => {
									getWard(data)
								}}
							/>
						</div>

						<div className="col-md-6 col-12">
							<SelectField
								disabled={ward.length > 0 ? false : true}
								placeholder="Chọn phường/xã"
								name="WardId"
								label="Phường/xã"
								optionList={ward}
							/>
						</div>

						{router.query.StudentID && (
							<>
								<Divider>Thông tin học</Divider>

								<div className="col-md-6 col-12">
									<SelectField name="LearningNeedId" label="Nhu cầu học" optionList={optionList.learningNeed} />
								</div>

								<div className="col-md-6 col-12">
									<SelectField name="SourceId" label="Nguồn khách hàng" optionList={optionList.source} />
								</div>

								<div className="col-md-6 col-12">
									<SelectField name="SaleId" label="Tư vấn viên" optionList={optionList.sale} />
								</div>

								<div className="col-md-6 col-12">
									<SelectField name="PurposeId" label="Mục đích học" optionList={optionList.purpose} />
								</div>
							</>
						)}
					</div>

					<div className="row mt-3">
						<div className="col-12 flex justify-end">
							<PrimaryButton
								background="blue"
								type="submit"
								loading={isLoading}
								children={<span>Lưu</span>}
								icon="save"
								onClick={() => {}}
							/>
						</div>
					</div>
				</Form>
			</Card>
		</div>
	)
}
