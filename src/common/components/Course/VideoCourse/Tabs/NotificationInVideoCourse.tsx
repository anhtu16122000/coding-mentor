import { Form, Modal } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { BiTimeFive } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { NotificationInVideoCourseApi } from '~/api/course/video-course/notification-in-video-course'
import InputText from '~/common/components/FormControl/InputTextField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import ModalFooter from '~/common/components/ModalFooter'
import PrimaryButton from '~/common/components/Primary/Button'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'

export interface INotificationInVideoCourseProps {
	videoCourseID: number
}

export default function NotificationInVideoCourse(props: INotificationInVideoCourseProps) {
	const { videoCourseID } = props
	const [dataSource, setDataSource] = useState<INotificationInVideoCourse[]>()
	const [todoApi, setTodoApi] = useState({ pageIndex: 1, pageSize: PAGE_SIZE, videoCourseId: videoCourseID })
	const [visibleModal, setVisibleModal] = useState(false)

	const onOpenModal = () => {
		setVisibleModal(true)
	}
	const onCloseModal = () => {
		setVisibleModal(false)
	}

	const getDataSource = async () => {
		try {
			let res = await NotificationInVideoCourseApi.getAll(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
			if (res.status == 204) {
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
		}
	}

	useEffect(() => {
		getDataSource()
	}, [todoApi])

	const _onFinish = async (data) => {
		try {
			let res = await NotificationInVideoCourseApi.addNotification({ ...data, VideoCourseId: videoCourseID })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				onCloseModal()
				setTodoApi({ ...todoApi })
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const user = useSelector((state: RootState) => state.user.information)
	function isAdmin() {
		return user?.RoleId == 1
	}

	function isManager() {
		return user?.RoleId == 4
	}

	function isAcademic() {
		return user?.RoleId == 7
	}

	function showCreate() {
		return isAdmin() || isAcademic() || isManager()
	}

	const [form] = Form.useForm()

	return (
		<div>
			{showCreate() && (
				<PrimaryButton background="green" className="mb-tw-4" type="button" icon="add" onClick={onOpenModal}>
					Thêm thông báo
				</PrimaryButton>
			)}

			<div>
				{dataSource?.map((item, index) => {
					return (
						<div key={index} className="bg-[#f0f0f0] px-[14px] py-[8px] rounded-lg mb-tw-4 last:mb-tw-0">
							<div className="flex gap-2 justify-start items-end">
								<p className="text-2xl font-bold">{item.CreatedBy} </p>
							</div>
							<p className="text-[#949494] text-[14px]">{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>

							<p className="font-bold text-[16px] mt-[8px]">{item.Title}</p>
							<p>{item.Content}</p>
						</div>
					)
				})}
			</div>

			<Modal title={'Thêm thông báo'} onCancel={onCloseModal} open={visibleModal} footer={<ModalFooter onOK={() => form.submit()} />}>
				<Form form={form} layout="vertical" onFinish={_onFinish}>
					<div className="grid grid-flow-row antd-custom-wrap">
						<div className="grid-cols-1">
							<InputText label="Tiêu đề" name="Title" placeholder="Nhập tiêu đề" rules={formRequired} isRequired />
						</div>

						<div className="grid-cols-1">
							<TextBoxField
								rows={7}
								label="Nội dung thông báo"
								name="Content"
								placeholder="Nhập nội dung thông báo"
								isRequired
								rules={formRequired}
							/>
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	)
}
