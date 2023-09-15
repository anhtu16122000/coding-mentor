import { Modal, Form, Input } from 'antd'
import React, { FC, useEffect, useRef, useState } from 'react'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import ButtonAdd from '~/common/components/DirtyButton/Button-Add'
import PrimaryButton from '~/common/components/Primary/Button'
import ButtonCancel from '~/common/components/DirtyButton/Button-Cancel'
import ButtonSave from '~/common/components/DirtyButton/Button-Save'
import ModalFooter from '~/common/components/ModalFooter'
import { packedApi } from '~/api/packed'

// import ReactCrop from 'react-image-crop'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop'
import { useDebounceEffect } from './useDebounceEffect'
import { canvasPreview } from './canvasPreview'
import UploadImageField from '~/common/components/FormControl/UploadImageField'
import { UploadFileApi } from '~/api/common/upload-image'
import MiniImageCrop from './MiniImageCrop'
import InputNumberField from '~/common/components/FormControl/InputNumberField'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 90
			},
			aspect,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	)
}

const CreatePackage: FC<ICreateExam> = (props) => {
	const { onRefresh, isEdit, defaultData, className, onOpen } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (visible) {
			!!onOpen && onOpen()
		}
	}, [visible])

	async function putPackage(param) {
		try {
			const response = await packedApi.put(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	async function postPackage(param) {
		try {
			const response = await packedApi.post(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const onFinish = async (values) => {
		const DATA_SUBMIT = { ...values }

		setLoading(true)

		if (!isEdit) {
			postPackage(DATA_SUBMIT)
		}

		if (!!isEdit) {
			putPackage({ ...DATA_SUBMIT, ID: defaultData.Id })
		}
	}

	function openEdit() {
		form.setFieldsValue({ Code: defaultData?.Code })
		form.setFieldsValue({ Description: defaultData?.Description })
		form.setFieldsValue({ Name: defaultData?.Name })
		setVisible(true)
	}

	const user = useSelector((state: RootState) => state.user.information)

	// ----------------------------------------------------------------

	const [src, setSrc] = useState(null)
	// const [crop, setCrop] = useState({ aspect: 3 / 4 }) // Đặt tỷ lệ 3:4 ở đây

	// const onSelectFile = (e) => {
	// 	if (e.target.files && e.target.files.length > 0) {
	// 		const reader = new FileReader()
	// 		reader.addEventListener('load', () => setSrc(reader.result))
	// 		reader.readAsDataURL(e.target.files[0])
	// 	}
	// }

	const onImageLoaded = (image) => {
		// You can do something when the image is loaded, if needed.
	}

	const onCropComplete = (crop) => {
		// You can do something when the crop is completed, if needed.
	}

	// const onCropChange = (newCrop) => {
	// 	setCrop(newCrop)
	// }

	// ----================================

	return (
		<>
			{user?.RoleId == 1 && !!!isEdit && (
				<div data-tut="reactour-create" className="flex-shrink-0">
					<ButtonAdd icon="outline" onClick={() => setVisible(true)}>
						Tạo mới
					</ButtonAdd>
				</div>
			)}

			{user?.RoleId == 1 && !!isEdit && (
				<PrimaryButton className={className} onClick={openEdit} type="button" background="yellow" icon="edit">
					Cập nhật
				</PrimaryButton>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật bộ đề' : 'Tạo bộ đề'}
				width={400}
				open={visible}
				onCancel={() => !loading && setVisible(false)}
				footer={<ModalFooter loading={loading} onOK={() => form.submit()} onCancel={() => setVisible(false)} />}
			>
				<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					{/* <UploadImageField form={form} /> */}

					<div className="grid grid-cols-4 gap-x-4">
						<Form.Item className="col-span-4" label="Hình thu nhỏ" name="Thumbnail" rules={formRequired}>
							<MiniImageCrop
								className=""
								onChange={(event) => {
									console.log('--- event: ', event)

									form.setFieldValue('Thumbnail', event?.uri)
								}}
							/>
						</Form.Item>

						<Form.Item className="col-span-4" label="Tên" name="Name" rules={formRequired}>
							<Input disabled={loading} className="primary-input" />
						</Form.Item>

						<InputNumberField className="col-span-4" label="Giá" name="Price" />

						<Form.Item className="col-span-4" label="Mô tả" name="Description">
							<Input.TextArea rows={5} disabled={loading} className="primary-input" />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreatePackage
