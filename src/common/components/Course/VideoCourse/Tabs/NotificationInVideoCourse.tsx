import { Form, Modal } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NotificationInVideoCourseApi } from '~/api/course/video-course/notification-in-video-course'
import InputText from '~/common/components/FormControl/InputTextField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import PrimaryButton from '~/common/components/Primary/Button'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'

export interface INotificationInVideoCourseProps {
	videoCourseID: number
}

export default function NotificationInVideoCourse(props: INotificationInVideoCourseProps) {
	const RoleID = useSelector((state: RootState) => state.user.information.RoleId)
	const { videoCourseID } = props
	const [dataSource, setDataSource] = useState<INotificationInVideoCourse[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState({ pageIndex: 1, pageSize: PAGE_SIZE, videoCourseId: videoCourseID })
	const [visibleModal, setVisibleModal] = useState(false)

	const onOpenModal = () => {
		setVisibleModal(true)
	}
	const onCloseModal = () => {
		setVisibleModal(false)
	}

	const getDataSource = async () => {
		setIsLoading({ type: '', status: true })
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
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		getDataSource()
	}, [todoApi])

	const renderNotificationItem = (item, index) => {
		return (
			<div key={index} className="bg-tw-gray px-4 py-2 rounded-lg mb-tw-4 last:mb-tw-0">
				<div className="flex gap-2 justify-start items-end">
					<p className="text-2xl font-bold">{item.CreatedBy} </p>
					<p className="text-sm">{moment(item.CreatedOn).format('DD/MM/YYYY')}</p>
				</div>
				<p className="font-bold text-tw-blue">{item.Title}</p>
				<p>{item.Content}</p>
			</div>
		)
	}

	const _onFinish = async (data) => {
		setIsLoading({ type: '', status: true })
		try {
			let res = await NotificationInVideoCourseApi.addNotification({ ...data, VideoCourseId: videoCourseID })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				onCloseModal()
				setTodoApi({ ...todoApi })
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	return (
		<div>
			{RoleID == '1' && (
				<PrimaryButton
					background="green"
					className="mb-tw-4"
					type="button"
					children={<span>Thêm thông báo mới</span>}
					icon="add"
					onClick={() => {
						onOpenModal()
					}}
				/>
			)}
			<div>{dataSource?.map((item, index) => renderNotificationItem(item, index))}</div>

			<Modal
				title={'Thêm thông báo'}
				onCancel={() => {
					onCloseModal()
				}}
				visible={visibleModal}
				footer={null}
			>
				<Form layout="vertical" onFinish={_onFinish}>
					<div className="grid grid-flow-row antd-custom-wrap">
						<div className="grid-cols-1">
							<InputText label="Tiêu đề" name="Title" placeholder="Nhập tiêu đề" />
						</div>
						<div className="grid-cols-1">
							<TextBoxField rows={7} label="Nội dung thông báo" name="Content" placeholder="Nhập nội dung thông báo" />
						</div>
						<div className="grid-cols-1 flex justify-center">
							<PrimaryButton background="blue" type="submit" children={<span>Lưu</span>} icon="save" />
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	)
}
