import { Form, Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import { BsFileEarmarkPlus } from 'react-icons/bs'
import InputText from '~/common/components/FormControl/InputTextField'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '../../Primary/IconButton'

type Props = {
	mode: 'add' | 'remove' | 'cancel' | 'edit' | 'check'
	isLoading: { type: string; status: boolean }
	onSubmit: Function
	item?: IVideoCourseSection
}

const ModalAddSection = (props: Props) => {
	const { onSubmit, isLoading, mode, item } = props
	const [visibleModalSection, setVisibleModalSection] = useState(false)
	const [form] = Form.useForm()

	useEffect(() => {
		if (item) {
			form.setFieldsValue(item)
		}
	}, [item])

	const onOpenModal = () => {
		setVisibleModalSection(true)
	}
	const onCloseModal = () => {
		setVisibleModalSection(false)
	}

	const onFinish = (data) => {
		if (mode == 'add') {
			if (onSubmit) {
				onSubmit(data).then((res) => {
					if (res) {
						setVisibleModalSection(false)
						form.resetFields()
					}
				})
			}
		} else {
			if (onSubmit) {
				onSubmit({ ...data, Id: item.Id }).then((res) => {
					if (res) {
						setVisibleModalSection(false)
						form.resetFields()
					}
				})
			}
		}
	}

	return (
		<div className="antd-custom-wrap">
			{mode == 'add' ? (
				<div className="px-1 flex justify-center">
					<button
						onClick={() => {
							onOpenModal()
						}}
						className="w-fit my-4 flex items-center justify-center"
					>
						<BsFileEarmarkPlus size={18} className="text-tw-black font-bold mr-2" />{' '}
						<span className="text-tw-black text-bold text-base ">Thêm chương</span>
					</button>
				</div>
			) : (
				<IconButton
					type="button"
					color={mode == 'edit' ? 'green' : 'red'}
					icon={mode}
					onClick={() => {
						onOpenModal()
					}}
					className="mt-2"
					tooltip={mode == 'edit' ? 'Sửa chương' : 'Xóa chương'}
				/>
			)}
			<Modal
				title={mode == 'add' ? 'Thêm chương' : mode == 'edit' ? 'Sửa chương' : 'Xóa chương'}
				visible={visibleModalSection}
				onCancel={() => {
					onCloseModal()
				}}
				footer={null}
			>
				<Form className="antd-custom-wrap" layout="vertical" form={form} onFinish={onFinish}>
					<div className="grid grid-flow-row">
						{mode == 'remove' ? (
							<div className="grid-cols-1">
								<p className="text-base mb-4">Bạn có chắc muốn xóa chương này?</p>
							</div>
						) : (
							<div className="grid-cols-1">
								<InputText name="Name" label="Chương" placeholder="Nhập tên chương" />
							</div>
						)}

						<div className="grid-cols-1 flex justify-center">
							<PrimaryButton
								disable={isLoading.type == 'SUBMIT_SECTION' && isLoading.status}
								loading={isLoading.type == 'SUBMIT_SECTION' && isLoading.status}
								background={mode == 'add' ? 'blue' : mode == 'edit' ? 'blue' : 'red'}
								type="submit"
								children={<span>{mode == 'remove' ? 'Xác nhận' : 'Lưu'}</span>}
								icon={mode == 'add' ? 'save' : mode == 'edit' ? 'save' : 'remove'}
							/>
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	)
}

export default ModalAddSection
