import { Form, Modal } from 'antd'
import { useState } from 'react'
import { VideoCourseLessonUploadFileApi } from '~/api/course/video-course/video-course-file'
import { ShowNoti } from '~/common/utils'
import UploadFileField from '../../FormControl/UploadFileField'
import PrimaryButton from '../../Primary/Button'

interface Props {
	item?: object
	lessonID: number
	onFetchData: Function
	getDataSource: Function
}

export default function ModalAddFileVideoCourse(props: Props) {
	const { item, lessonID, onFetchData, getDataSource } = props
	const [visible, setVisible] = useState(false)
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })

	const onCloseModal = () => {
		setVisible(false)
	}

	const onOpenModal = () => {
		setVisible(true)
	}

	const onUploadFile = async (info) => {
		try {
			let res = await VideoCourseLessonUploadFileApi.upload(info)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const _onFinish = async (data) => {
		setIsLoading({ type: 'SUBMIT', status: true })
		try {
			let res = await VideoCourseLessonUploadFileApi.add({
				FileName: data.FileUrl.file.originFileObj.name,
				LessonVideoId: lessonID,
				FileUrl: form.getFieldValue('FileUrl')
			})
			if (res.status == 200) {
				onCloseModal()
				onFetchData && onFetchData()
				form.resetFields()
				ShowNoti('success', res.data.message)
				getDataSource()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT', status: false })
		}
	}

	return (
		<div>
			<PrimaryButton
				background="green"
				type="button"
				children={<span>Thêm tài liệu</span>}
				icon="add"
				onClick={() => {
					onOpenModal()
				}}
			/>
			<Modal
				title={'Thêm tài liệu'}
				visible={visible}
				onCancel={() => {
					onCloseModal()
				}}
				footer={null}
			>
				<Form layout="vertical" onFinish={_onFinish}>
					<div className="grid grid-flow-row antd-custom-wrap">
						<div className="grid-cols-1">
							<UploadFileField
								label="Tệp tải lên"
								name="FileUrl"
								form={form}
								buttonText="Bấm để tải tệp lên"
								isRequired={true}
								onChangeFile={onUploadFile}
								rules={[{ required: true, message: 'Xin hãy chọn tệp!' }]}
							/>
						</div>
						<div className="grid-cols-1 flex justify-center">
							<PrimaryButton
								background="blue"
								loading={isLoading.type == 'SUBMIT' && isLoading.status}
								type="submit"
								children={<span>Lưu</span>}
								icon="save"
							/>
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	)
}
