import { Form, Modal } from 'antd'
import { useEffect, useState } from 'react'
import InputText from '~/common/components/FormControl/InputTextField'
import PrimaryButton from '~/common/components/Primary/Button'
import UploadImageField from '../../FormControl/UploadImageField'
import Lottie from 'react-lottie-player'

import deleteJson from '~/common/components/json/15120-delete.json'

type Props = {
	mode: 'add' | 'remove' | 'cancel' | 'edit' | 'check'
	isLoading: { type: string; status: boolean }
	onSubmit: Function
	item?: IVideoCourseSection
	prerequisiteCourse: Array<ISelectOptionList>
}

const ModalAddVideoCourse = (props: Props) => {
	const { onSubmit, isLoading, mode, item, prerequisiteCourse } = props
	const [visibleModalAdd, setVisibleModalAdd] = useState(false)
	const [isUpload, setIsUpload] = useState(false)
	const [form] = Form.useForm()

	useEffect(() => {
		if (item) {
			form.setFieldsValue(item)
		}
	}, [item])

	const onOpenModal = () => {
		setVisibleModalAdd(true)
	}
	const onCloseModal = () => {
		setVisibleModalAdd(false)
	}

	const onFinish = (data) => {
		if (mode == 'add') {
			if (onSubmit) {
				onSubmit({ ...data, Description: '', Stags: [] }).then((res) => {
					if (res) {
						setVisibleModalAdd(false)
						form.resetFields()
					}
				})
			}
		} else {
			if (onSubmit) {
				onSubmit({ ...data, Description: '', Stags: [], Id: item.Id }).then((res) => {
					if (res) {
						setVisibleModalAdd(false)
						form.resetFields()
					}
				})
			}
		}
	}

	return (
		<>
			{mode == 'add' ? (
				<div className="px-1 flex justify-center">
					<PrimaryButton background="green" type="button" children={<span>Thêm khóa học</span>} icon="add" onClick={() => onOpenModal()} />
				</div>
			) : (
				<PrimaryButton
					background={mode == 'edit' ? 'green' : 'red'}
					type="button"
					children={<span>{mode == 'edit' ? 'Cập nhật khóa học' : 'Xóa khóa học'}</span>}
					icon={mode}
					onClick={() => onOpenModal()}
				/>
			)}

			<Modal
				title={mode == 'add' ? 'Thêm khóa học' : mode == 'edit' ? 'Cập nhật khóa học' : 'Xóa khóa học'}
				visible={visibleModalAdd}
				onCancel={() => onCloseModal()}
				footer={null}
			>
				<Form layout="vertical" form={form} onFinish={onFinish}>
					<div className="grid grid-flow-row antd-custom-wrap">
						{mode == 'remove' ? (
							<div className="grid-cols-1 flex flex-col items-center justify-center">
								<Lottie loop animationData={deleteJson} play className="w-[120px] mt-[-10px]" />
								<p className="text-center text-[16px] mt-3 mb-4">
									Bạn có chắc muốn xóa khóa học <span className="text-[red]">{item?.Name}</span>
								</p>
							</div>
						) : (
							<>
								<div className="grid-cols-1">
									<InputText name="Name" label="Tên khóa học" placeholder="Nhập tên khóa học" />
								</div>
								<div className="grid-cols-1">
									<UploadImageField name="Thumbnail" form={form} label="Ảnh đại diện" setIsLoadingImage={(status) => setIsUpload(status)} />
								</div>
							</>
						)}
						<div className="grid-cols-1 flex justify-center">
							<PrimaryButton className="mr-2" icon="cancel" type="button" background="red" onClick={onCloseModal}>
								Hủy
							</PrimaryButton>
							<PrimaryButton
								disable={(isLoading.type == 'SUBMIT_SECTION' && isLoading.status) || isUpload}
								loading={isLoading.type == 'SUBMIT_SECTION' && isLoading.status}
								background={mode == 'add' ? 'blue' : mode == 'edit' ? 'blue' : 'blue'}
								type="submit"
								children={<span>{mode == 'remove' ? 'Xác nhận' : 'Lưu'}</span>}
								icon={mode == 'add' ? 'save' : mode == 'edit' ? 'save' : 'remove'}
							/>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default ModalAddVideoCourse
