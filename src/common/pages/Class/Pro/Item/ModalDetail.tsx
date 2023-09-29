import { Divider, Modal, Tooltip } from 'antd'
import moment from 'moment'
import Router from 'next/router'
import React, { useState } from 'react'
import { BsCalendarCheckFill } from 'react-icons/bs'
import { FaBook, FaInfoCircle, FaUserTie } from 'react-icons/fa'
import UpdateClassForm from '~/common/components/Class/ProClass/UpdateClassForm'
import PrimaryButton from '~/common/components/Primary/Button'
import { is, parseToMoney } from '~/common/utils/common'
import ProClassInfoItem from '../Common/ProClassInfoItem'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const ModalDetail = (props) => {
	const { data, onRefresh, academics, isDesktop, isMobile } = props

	const [visible, setVisible] = useState<boolean>(false)
	const userInfo = useSelector((state: RootState) => state.user.information)

	function viewDetails() {
		Router.push({
			pathname: '/class/list-class/detail',
			query: { class: data?.Id, curriculum: data?.CurriculumId, branch: data?.BranchId }
		})
	}

	function getStrDate(date) {
		if (!date) return 'Không xác định'
		return moment(date).format('DD/MM/YYYY')
	}

	return (
		<>
			{!!isDesktop && isMobile && (
				<Tooltip id={`fica-i-${data?.Id}`} title="Xem thông tin" placement="left">
					<div
						onClick={(e) => {
							e.stopPropagation()
							setVisible(true)
						}}
						className={`btn-class-info`}
					>
						<FaInfoCircle size={18} />
					</div>
				</Tooltip>
			)}

			<Tooltip id={`fica-i-${data?.Id}`} title="Xem thông tin" placement="left">
				<div
					onClick={(e) => {
						e.stopPropagation()
						setVisible(true)
					}}
					className={`btn-class-info ${!!isDesktop && !isMobile ? '!hidden w600:!flex' : '!hidden'}`}
				>
					<FaInfoCircle size={18} />
				</div>
			</Tooltip>

			<div
				onClick={(e) => {
					e.stopPropagation()
					setVisible(true)
				}}
				className={`flex-shrink-0 bg-[#FFBA0A] hover:bg-[#e7ab11] focus:bg-[#d19b10] text-[#000] items-center px-[8px] h-[30px] rounded-[6px] ${
					!!isMobile && !isDesktop ? '!flex w600:!hidden' : '!hidden'
				}`}
			>
				<FaInfoCircle size={18} className="mr-[4px] hidden w350:inline" />
				<div>Thông tin</div>
			</div>

			<Modal
				open={visible}
				title={data.Name}
				onCancel={() => setVisible(false)}
				footer={
					<div className="flex item-center justify-center">
						{is(userInfo).admin && (
							<UpdateClassForm onRefresh={onRefresh} dataRow={data} academic={academics} onShow={() => setVisible(false)} isPro isDetail />
						)}
						<PrimaryButton onClick={viewDetails} icon="enter" background="blue" type="button">
							Vào lớp
						</PrimaryButton>
					</div>
				}
			>
				<div className="flex items-start justify-between mt-[8px]">
					<div>
						<div className="font-[600]">{`${getStrDate(data.StartDay)} - ${getStrDate(data.EndDay)}`}</div>
						<div className="font-[600]">
							Trung tâm: <div className="font-[600] inline">{`${data.BranchName}`}</div>
						</div>
						<div className="font-[600]">
							Số lượng học viên: <div className="font-[600] inline">{`${data.TotalStudent || 0} / ${data.MaxQuantity || 0}`}</div>
						</div>
					</div>

					<div
						className="p-[0px] px-[6px] rounded-full text-[#fff]"
						style={{ background: data?.Status == 3 ? '#e31616' : data?.Status == 2 ? '#1b73e8' : '#24913c' }}
					>
						{data?.StatusName}
					</div>
				</div>

				<Divider className="ant-divider-16" />

				<div className="flex items-center">
					<div className="w-[40px] h-[40px] bg-[#dbdbdb] flex items-center justify-center rounded-full">
						<FaUserTie size={22} className="" />
					</div>
					<div className="flex-1 flex flex-col ml-[16px]">
						{/* <ProClassInfoItem title="Giảng viên" value={data.TeacherName} /> */}
						<div className="flex items-center">
							<div className="class-info-item flex-1 in-1-line">
								Giảng viên:{' '}
								<div className="info-value !inline">
									<Tooltip
										id={`ix-cl-${data?.Id}`}
										title={data?.Teachers.map((teacher, index) => {
											return (
												<div key={`te-n-${index}`} className="block">
													{teacher?.TeacherName}
												</div>
											)
										})}
										placement="top"
									>
										<>
											{data?.Teachers.map((teacher, index) => {
												return (
													<div key={`te-n-${index}`} className="inline">
														{index > 0 && ', '}
														{teacher?.TeacherName}
													</div>
												)
											})}
										</>
									</Tooltip>
								</div>
							</div>
						</div>

						<ProClassInfoItem title="Học vụ" value={data.AcademicName} />
					</div>
				</div>

				<Divider className="ant-divider-16" />

				<div className="flex items-center">
					<div className="w-[40px] h-[40px] bg-[#dbdbdb] flex items-center justify-center rounded-full">
						<FaBook size={20} className="" />
					</div>
					<div className="flex-1 flex flex-col ml-[16px]">
						<ProClassInfoItem title="Chương trình" value={data.ProgramName} />
						<ProClassInfoItem title="Giáo trình" value={data.CurriculumName} />
					</div>
				</div>

				<Divider className="ant-divider-16" />

				<div className="flex items-center">
					<div className="w-[40px] h-[40px] bg-[#dbdbdb] flex items-center justify-center rounded-full">
						<BsCalendarCheckFill size={20} className="" />
					</div>
					<div className="flex-1 flex flex-col ml-[16px]">
						<ProClassInfoItem title="Số buổi đã học" value={`${data?.LessonCompleted} / ${data?.TotalLesson}`} />
						<ProClassInfoItem title="Số buổi còn lại" value={`${data?.TotalLesson - data?.LessonCompleted}`} />
					</div>
				</div>

				<Divider className="ant-divider-16" />

				<div className="flex items-center">
					<div className="w-[40px] h-[40px] bg-[#dbdbdb] flex items-center justify-center rounded-full">
						<FaInfoCircle size={22} className="" />
					</div>
					<div className="flex-1 flex flex-col ml-[16px]">
						<ProClassInfoItem title="Loại" value={`${data?.TypeName}`} />

						{!!data?.Price && <ProClassInfoItem title="Giá" value={`${parseToMoney(data?.Price)}đ`} />}
						{!data?.Price && <ProClassInfoItem title="Giá" value="Miễn phí" />}
					</div>
				</div>
			</Modal>
		</>
	)
}

export default ModalDetail
