import { Form, Modal, Skeleton, Tabs, TabsProps, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { userInformationApi } from '~/api/user/user'
import UploadImageField from '~/common/components/FormControl/UploadImageField'
import PrimaryButton from '~/common/components/Primary/Button'
import TabStudentContract from '~/common/components/Student/TabStudentContract'
import TabStudentDetail from '~/common/components/Student/TabStudentDetail'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { TabBill } from './TabBill'
import { TabClassList } from './TabClassList'
import { TabClassListHistory } from './TabClassListHistory'
import { TabDiscountHistory } from './TabDiscountHistory'
import { TabStudyRoute } from './TabStudyRoute'
import { TabTestAppointment } from './TabTestAppointment'
import { StudentNote } from '~/common/components'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import { BsFillCameraFill } from 'react-icons/bs'
import Avatar from '~/common/components/Avatar'

export interface IStudentDetailInfoPageProps {}

export default function StudentDetailInfoPage(props: IStudentDetailInfoPageProps) {
	const [studentDetail, setStudentDetail] = useState<IUserResponse>()
	const [isVisibleModal, setIsVisibleModal] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const [form] = Form.useForm()
	const userInformation = useSelector((state: RootState) => state.user.information)

	const getStudentDetail = async () => {
		try {
			const res = await userInformationApi.getByID(router.query.StudentID)
			if (res.status === 200) {
				setStudentDetail(res.data.data)
			} else {
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const items: TabsProps['items'] =
		userInformation?.RoleId === '3' || userInformation?.RoleId === '8'
			? [
					{
						key: '1',
						label: `Chi tiết`,
						children: <TabStudentDetail StudentDetail={studentDetail} />
					},
					{
						key: '2',
						label: `Hợp đồng`,
						children: <TabStudentContract StudentDetail={studentDetail} />
					},
					{
						key: '3',
						label: `Lộ trình`,
						children: <TabStudyRoute StudentDetail={studentDetail} />
					},
					{
						key: '4',
						label: `Thanh toán`,
						children: <TabBill StudentDetail={studentDetail} />
					},
					{
						key: '5',
						label: `Lịch sử học`,
						children: <TabClassListHistory StudentDetail={studentDetail} />
					}
			  ]
			: [
					{
						key: '1',
						label: `Chi tiết`,
						children: <TabStudentDetail StudentDetail={studentDetail} />
					},
					{
						key: '2',
						label: `Hợp đồng`,
						children: <TabStudentContract StudentDetail={studentDetail} />
					},
					{
						key: '3',
						label: `Lớp học`,
						children: <TabClassList StudentDetail={studentDetail} />
					},
					{
						key: '4',
						label: `Lộ trình`,
						children: <TabStudyRoute StudentDetail={studentDetail} />
					},
					{
						key: '5',
						label: `Thanh toán`,
						children: <TabBill StudentDetail={studentDetail} />
					},
					{
						key: '6',
						label: `Mã khuyến mãi`,
						children: <TabDiscountHistory StudentDetail={studentDetail} />
					},
					{
						key: '7',
						label: `Kiểm tra đầu vào`,
						children: <TabTestAppointment StudentDetail={studentDetail} />
					},
					{
						key: '8',
						label: `Lịch sử học`,
						children: <TabClassListHistory StudentDetail={studentDetail} />
					},
					{
						key: '9',
						label: `Ghi chú`,
						children: <StudentNote studentId={studentDetail?.UserInformationId} />
					}
			  ]

	const onChange = (key: string) => {}

	useEffect(() => {
		if (router.query.StudentID) {
			getStudentDetail()
		}
	}, [router.query.StudentID])

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
		<>
			{!!studentDetail.FullName && (
				<Head>
					<title>
						{appConfigs.appName} - {studentDetail.FullName}
					</title>
				</Head>
			)}

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
									<Avatar uri={studentDetail?.Avatar} alt="user-avt" className="rounded-full shadow-sm" />
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
							<Tabs defaultActiveKey="1" items={items} onChange={onChange} />
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
		</>
	)
}
