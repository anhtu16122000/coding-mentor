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
import { TabBill } from './TabBill'
import { TabClassList } from './TabClassList'
import { TabClassListHistory } from './TabClassListHistory'
import { TabDiscountHistory } from './TabDiscountHistory'
import { TabStudyRoute } from './TabStudyRoute'
import { TabTestAppointment } from './TabTestAppointment'

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
			}
			if (res.status === 204) {
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
					}
			  ]

	const onChange = (key: string) => {
		console.log(key)
	}

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
							<img src={studentDetail.Avatar || '/default-avatar.png'} alt="" />
							<div className="overlay" onClick={() => setIsVisibleModal(true)}>
								<Tooltip title="Tải ảnh lên">
									<FiUpload size={30} color="#d9d9d9" />
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
	)
}
