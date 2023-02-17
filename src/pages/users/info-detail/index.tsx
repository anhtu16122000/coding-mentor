import React from 'react'
import { MainLayout } from '~/common'
import { Form, Modal, Skeleton, Tabs, TabsProps, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { userInformationApi } from '~/api/user'
import UploadImageField from '~/common/components/FormControl/UploadImageField'
import PrimaryButton from '~/common/components/Primary/Button'
import TabStudentContract from '~/common/components/Student/TabStudentContract'
import TabStudentDetail from '~/common/components/Student/TabStudentDetail'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'

export interface IUserInfoDetailProps {}

export default function UserInfoDetail(props: IUserInfoDetailProps) {
	const [studentDetail, setStudentDetail] = useState<IUserResponse>()
	const [isVisibleModal, setIsVisibleModal] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const [form] = Form.useForm()
	const userInformation = useSelector((state: RootState) => state.user.information)

	const getStudentDetail = async () => {
		try {
			const res = await userInformationApi.getByID(router.query.UserID)
			if (res.status === 200) {
				setStudentDetail(res.data.data)
			}
			if (res.status === 204) {
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
						<div className="avatar">
							<img src={studentDetail.Avatar} alt="" />
							<div
								className="overlay"
								onClick={() => {
									setIsVisibleModal(true)
								}}
							>
								<Tooltip title="Tải ảnh lên">
									<FiUpload size={30} color="#d9d9d9" />
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
UserInfoDetail.Layout = MainLayout
