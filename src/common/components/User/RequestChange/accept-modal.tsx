import { Modal, Card, Popconfirm } from 'antd'
import React, { FC, useState } from 'react'
import { requestApi } from '~/api/user'
import { ShowNoti } from '~/common/utils'

import moment from 'moment'
import IconButton from '../../Primary/IconButton'
import PrimaryButton from '../../Primary/Button'

const AcceptRequest: FC<{ data: any; onRefresh?: Function; onDelete?: Function }> = (props) => {
	const { onRefresh, data, onDelete } = props

	const [loading, setLoading] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)

	async function postAccept() {
		setLoading(true)
		try {
			const response = await requestApi.acceptUpdate(data?.Id)
			if (response.status === 200) {
				if (!!onRefresh) {
					onRefresh()
					setIsModalVisible(false)
				}
				ShowNoti('success', response?.data?.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	function getColor(old, current) {
		if (!old && !current) {
			return ''
		}
		return old == current ? '' : '!text-[#0A89FF]'
	}

	return (
		<>
			<IconButton onClick={() => setIsModalVisible(true)} type="button" background="transparent" color="green" icon="eye" />

			<Modal
				centered
				title="Xem thông tin thay đổi"
				width={1000}
				visible={isModalVisible}
				onCancel={() => !loading && setIsModalVisible(false)}
				footer={
					<>
						<Popconfirm
							placement="left"
							title="Bạn thật sự muốn xóa?"
							okText="Xóa"
							cancelText="Hủy"
							onConfirm={() => {
								onDelete(data.Id)
								setIsModalVisible(false)
							}}
						>
							<PrimaryButton disable={loading} background="red" icon="cancel" type="button">
								Xóa yêu cầu
							</PrimaryButton>
						</Popconfirm>
						<Popconfirm placement="left" title="Duyệt yêu cầu đổi thông tin?" okText="Duyệt" cancelText="Hủy" onConfirm={postAccept}>
							<PrimaryButton loading={loading} className="ml-2" background="green" icon="check" type="button">
								Duyệt yêu cầu
							</PrimaryButton>
						</Popconfirm>
					</>
				}
			>
				<div className="w-full grid grid-cols-1 w700:!grid-cols-2 gap-x-4">
					<Card className="col-span-1" title="Thông tin cũ">
						<div className="col-span-1">
							<span className="font-semibold">Mã học viên:</span> {data?.Info?.UserCode}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Họ & tên / Name:</span> {data?.Info?.FullName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">CMND / ID number:</span> {data?.Info?.CMND}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Ngày tháng năm sinh / Date of birth:</span>{' '}
							{!!data?.Info?.DOB ? moment(data?.Info?.DOB).format('DD/MM/YYYY') : ''}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Email:</span> {data?.Info?.Email}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Điện thoại liên hệ / Contact number:</span> {data?.Info?.Mobile}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Địa chỉ thường trú / Permanent residence:</span> {data?.Info?.PermanentResidence}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Tình trạng hôn nhân / Marriage status:</span> {data?.Info?.MarriageName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Trình độ học vấn / Academic level:</span> {data?.Info?.AcademicLevelName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Công việc hiện tại / Current job:</span> {data?.Info?.JobName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Thu nhập bình quân tháng hiện tại / Current monthly income:</span>{' '}
							{data?.Info?.MonthlyIncomeName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Tình trạng công việc của bố / Job status of your father:</span> {data?.Info?.JobOfFatherName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Tình trạng công việc của mẹ / Job status of your mother:</span> {data?.Info?.JobOfMotherName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Công việc của vợ hoặc chồng / Job status of your spouse:</span> {data?.Info?.JobOfSpouseName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Thu nhập bình quân của gia đình / Average monthly:</span> {data?.Info?.IncomeOfFamilyName}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">Dự định / Plan:</span> {data?.Info?.FuturePlan}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">
								Lý do theo học chương trình đào tạo này / Why do you want to attend this training program?:
							</span>{' '}
							{data?.Info?.Purpose}
						</div>
						<div className="col-span-1 mt-3">
							<span className="font-semibold">
								Làm thế nào anh/chị biết đến chương trình đào tạo này? / How do you get to know about this training program?:
							</span>{' '}
							{data?.Info?.Source}
						</div>
					</Card>

					<Card className="col-span-1 mt-4 w700:!mt-0" title="Thông tin mới">
						<div className="col-span-1">
							<span className={`font-semibold  ${getColor(data?.Info?.UserCode, data?.UserCode)}`}>Mã học viên:</span>
							<span className={`pl-2 ${getColor(data?.Info?.UserCode, data?.UserCode)}`}>{data?.UserCode}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.FullName, data?.FullName)}`}>Họ & tên / Name:</span>
							<span className={`pl-2 ${getColor(data?.Info?.FullName, data?.FullName)}`}>{data?.FullName}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.CMND, data?.CMND)}`}>CMND / ID number:</span>
							<span className={`pl-2 ${getColor(data?.Info?.CMND, data?.CMND)}`}>{data?.CMND}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span
								className={`font-semibold ${getColor(
									moment(data?.Info?.DOB).format('DD/MM/YYYY'),
									moment(data?.DOB).format('DD/MM/YYYY')
								)}`}
							>
								Ngày tháng năm sinh / Date of birth:
							</span>
							<span className={`pl-2 ${getColor(moment(data?.Info?.DOB).format('DD/MM/YYYY'), moment(data?.DOB).format('DD/MM/YYYY'))}`}>
								{!!data?.DOB ? moment(data?.DOB).format('DD/MM/YYYY') : ''}
							</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.Email, data?.Email)}`}>Email:</span>
							<span className={`pl-2 ${getColor(data?.Info?.Email, data?.Email)}`}>{data?.Email}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.Mobile, data?.Mobile)}`}>Điện thoại liên hệ / Contact number:</span>
							<span className={`pl-2 ${getColor(data?.Info?.Mobile, data?.Mobile)}`}>{data?.Mobile}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.PermanentResidence, data?.PermanentResidence)}`}>
								Địa chỉ thường trú / Permanent residence:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.PermanentResidence, data?.PermanentResidence)}`}>
								{data?.PermanentResidence}
							</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.MarriageName, data?.MarriageName)}`}>
								Tình trạng hôn nhân / Marriage status:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.MarriageName, data?.MarriageName)}`}>{data?.MarriageName}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.AcademicLevelName, data?.AcademicLevelName)}`}>
								Trình độ học vấn / Academic level:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.AcademicLevelName, data?.AcademicLevelName)}`}>{data?.AcademicLevelName}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.JobName, data?.JobName)}`}>Công việc hiện tại / Current job:</span>
							<span className={`pl-2 ${getColor(data?.Info?.JobName, data?.JobName)}`}>{data?.JobName}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.MonthlyIncomeName, data?.MonthlyIncomeName)}`}>
								Thu nhập bình quân tháng hiện tại / Current monthly income:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.MonthlyIncomeName, data?.MonthlyIncomeName)}`}>{data?.MonthlyIncomeName}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.JobOfFatherName, data?.JobOfFatherName)}`}>
								Tình trạng công việc của bố / Job status of your father:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.JobOfFatherName, data?.JobOfFatherName)}`}>{data?.JobOfFatherName}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.JobOfMotherName, data?.JobOfMotherName)}`}>
								Tình trạng công việc của mẹ / Job status of your mother:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.JobOfMotherName, data?.JobOfMotherName)}`}>{data?.JobOfMotherName}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.JobOfSpouseName, data?.JobOfSpouseName)}`}>
								Công việc của vợ hoặc chồng / Job status of your spouse:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.JobOfSpouseName, data?.JobOfSpouseName)}`}>{data?.JobOfSpouseName}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.IncomeOfFamilyName, data?.IncomeOfFamilyName)}`}>
								Thu nhập bình quân của gia đình / Average monthly:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.IncomeOfFamilyName, data?.IncomeOfFamilyName)}`}>
								{data?.IncomeOfFamilyName}
							</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.FuturePlan, data?.FuturePlan)}`}>Dự định / Plan:</span>
							<span className={`pl-2 ${getColor(data?.Info?.FuturePlan, data?.FuturePlan)}`}>{data?.FuturePlan}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.Purpose, data?.Purpose)}`}>
								Lý do theo học chương trình đào tạo này / Why do you want to attend this training program?:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.Purpose, data?.Purpose)}`}>{data?.Purpose}</span>
						</div>
						<div className="col-span-1 mt-3">
							<span className={`font-semibold  ${getColor(data?.Info?.Source, data?.Source)}`}>
								Làm thế nào anh/chị biết đến chương trình đào tạo này? / How do you get to know about this training program?:
							</span>
							<span className={`pl-2 ${getColor(data?.Info?.Source, data?.Source)}`}>{data?.Source}</span>
						</div>
					</Card>
				</div>
			</Modal>
		</>
	)
}

export default AcceptRequest
