import { Form, Modal, Spin, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { UploadFileApi } from '~/api/common/upload-image'
import { ShowNoti } from '~/common/utils'
import { PlusOutlined } from '@ant-design/icons'

const UploadImageField = (props: IUploadImageField) => {
	const { style, label, name, isRequired, className, disabled, rules, multiple, form, setIsLoadingImage } = props
	const [loadingImage, setLoadingImage] = useState(false)
	const [previewOpen, setPreviewOpen] = useState(false)
	const [previewImage, setPreviewImage] = useState('')
	const [previewTitle, setPreviewTitle] = useState('')
	const [fileList, setFileList] = useState([])

	const handleChange_img = async (info: any) => {
		!!setIsLoadingImage && setIsLoadingImage(true)
		setLoadingImage(true)
		try {
			let res = await UploadFileApi.uploadImage(info)
			if (res.status == 200) {
				if (multiple) {
					setFileList((pre) => [...pre, { url: res.data.data }])
				} else {
					setFileList(() => [{ url: res.data.data }])
				}
				ShowNoti('success', 'Upload ảnh thành công')
				form.setFieldValue(name, res.data.data)
			}
		} catch (error) {
			ShowNoti('error', error.message)
			return error
		} finally {
			setLoadingImage(false)
			!!setIsLoadingImage && setIsLoadingImage(false)
		}
	}

	function removeImage(item) {
		const filterImage = fileList.filter((img) => {
			return img.url !== item.url
		})
		form.setFieldsValue({ [name]: '' })
		setFileList(filterImage)
	}

	useEffect(() => {
		if (name) {
			if (form.getFieldValue(name)) {
				setFileList([{ url: form.getFieldValue(name) }])
			} else {
				setFileList([])
			}
		}
	}, [form.getFieldValue(name)])

	const getBase64 = (file): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = (error) => reject(error)
		})

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj)
		}

		setPreviewImage(file.url || (file.preview as string))
		setPreviewOpen(true)
		setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
	}

	const handleCancel = () => setPreviewOpen(false)

	return (
		<div className="flex">
			<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
				<Upload
					maxCount={1}
					name="avatar"
					className="avatar-uploader relative"
					listType="picture-card"
					showUploadList={false}
					disabled={disabled}
					multiple={multiple}
					fileList={fileList}
					onPreview={handlePreview}
					customRequest={(event) => handleChange_img(event.file)}
					onRemove={(item) => removeImage(item)}
				>
					{multiple ? (
						<div className="bg-upload">
							<PlusOutlined />
						</div>
					) : fileList.length == 1 ? null : (
						<div className="bg-upload">
							<PlusOutlined />
						</div>
					)}

					{fileList.map((image) => {
						return <img src={image.url} alt="avatar" style={{ width: '100%' }} />
					})}

					{loadingImage && (
						<div className="absolute top-0 left-0 all-center w-full h-full bg-[#0000003d] z-10">
							<Spin className="loading-white" />
						</div>
					)}
				</Upload>
			</Form.Item>

			<Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
				<img alt="example" style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</div>
	)
}

export default UploadImageField
