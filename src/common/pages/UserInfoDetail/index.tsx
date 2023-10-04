import React from 'react'
import { MainLayout } from '~/common'
import { Form, Modal, Skeleton, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { userInformationApi } from '~/api/user/user'
import UploadImageField from '~/common/components/FormControl/UploadImageField'
import PrimaryButton from '~/common/components/Primary/Button'
import TabStudentDetail from '~/common/components/Student/TabStudentDetail'
import { ShowNoti } from '~/common/utils'
import Avatar from '~/common/components/Avatar'
import { BsFillCameraFill } from 'react-icons/bs'

function UserInfoDetail() {
	const router = useRouter()
	const [form] = Form.useForm()

	const [studentDetail, setStudentDetail] = useState<IUserResponse>()
	const [isVisibleModal, setIsVisibleModal] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const getStudentDetail = async () => {
		try {
			const res = await userInformationApi.getByID(router.query.UserID)
			if (res.status === 200) {
				setStudentDetail(res.data.data)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (router.query.UserID) {
			getStudentDetail()
		}
	}, [router.query.UserID])

	const onFinish = async (data) => {
		setIsLoading(true)
		try {
			let res = await userInformationApi.update({
				...data,
				UserInformationId: studentDetail.UserInformationId
			})
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getStudentDetail()
				setIsVisibleModal(false)
			}
		} catch (error) {
			setIsLoading(false)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	if (!studentDetail) {
		return <Skeleton />
	}

	return (
		<div className="student-detail">
			<div className="contain">
				<div className="general-info">
					<div className="head">
						<div className="background"></div>
						<div className="more-info">
							<div className="name">{studentDetail.FullName}</div>
							<span className="email">{studentDetail.Email}</span>
						</div>

						<div className="avatar relative">
							<div className="bg-[#ffffff] rounded-full p-[5px] shadow-sm m-[4px]">
								<Avatar uri={studentDetail?.Avatar} alt="user-avt" className="rounded-full w-[132px] h-[132px] object-cover shadow-sm" />
							</div>
							<div
								className="bottom-[8px] border-[2px] border-[#fff] shadow-sm absolute flex items-center justify-center right-[8px] bg-[#3d88ec] rounded-full w-[36px] h-[36px]"
								onClick={() => setIsVisibleModal(true)}
							>
								<Tooltip title="Tải ảnh lên">
									<BsFillCameraFill size={20} color="#fff" />
								</Tooltip>
							</div>
						</div>
					</div>

					<div className="body">
						<TabStudentDetail StudentDetail={studentDetail} />
					</div>
				</div>
			</div>

			<Modal title="Cập nhật avatar" width={400} open={isVisibleModal} onCancel={() => setIsVisibleModal(false)} footer={null}>
				<Form form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-4 gap-x-4">
						<div className="col-span-4 flex justify-center items-center">
							<UploadImageField form={form} label="" name="Avatar" setIsLoadingImage={setIsLoading} />
						</div>

						<div className="col-span-4 flex justify-center items-center">
							<PrimaryButton background="blue" loading={isLoading} type="submit" children={<span>Lưu</span>} icon="save" />
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	)
}

export default UserInfoDetail
