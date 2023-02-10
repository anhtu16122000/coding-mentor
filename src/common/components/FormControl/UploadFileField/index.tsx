import { Form, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { GrDocumentImage, GrDocumentPdf, GrDocumentPpt, GrDocumentWord, GrDocumentZip } from 'react-icons/gr'
import { SiMicrosoftexcel } from 'react-icons/si'
import { UploadFileApi } from '~/api/common/upload-image'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../../Primary/Button'

export default function UploadFileField(props: IUploadFileField) {
	const { style, label, name, isRequired, className, disabled, rules, multiple, onChangeFile, form, buttonText, max } = props
	// onChangeFile xử lý upload file nếu dùng api khác /api/base
	const [loadingFile, setLoadingFile] = useState(false)
	const [files, setFiles] = useState<{ FileExtension: string; FileName: string }[]>([])

	useEffect(() => {
		if (!!form.getFieldValue(name) == false) {
			setFiles([])
		}
	}, [form.getFieldValue(name)])

	const handleUploadFile = async (info) => {
		try {
			let res = await UploadFileApi.uploadImage(info.file.originFileObj)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
		}
	}

	const handleChange_file = (info) => {
		setLoadingFile(true)

		if (onChangeFile) {
			onChangeFile(info).then((res) => {
				if (res) {
					if (res.status == 200) {
						form.setFieldsValue({ [name]: res.data.data })
						setLoadingFile(false)
					}
				}
			})
		} else {
			handleUploadFile(info).then((res) => {
				if (res) {
					if (res.status == 200) {
						form.setFieldsValue({ [name]: res.data.data })
						setLoadingFile(false)
					}
				}
			})
		}
	}

	const renderFilesName = (_, __, originFileObj, actions) => {
		return files.map((item) => {
			console.log('ITem: ', item)
			return (
				<div className="flex justify-between items-center mt-3">
					<div className="flex gap-2">
						{(item.FileExtension == 'xlsx' || item.FileExtension == 'xls') && <SiMicrosoftexcel size={24} />}
						{(item.FileExtension == 'doc' || item.FileExtension == 'docx' || item.FileExtension == 'txt') && <GrDocumentWord size={24} />}
						{item.FileExtension == 'pdf' && <GrDocumentPdf size={24} />}
						{item.FileExtension == 'zip' && <GrDocumentZip size={24} />}
						{(item.FileExtension == 'ppt' || item.FileExtension == 'pps') && <GrDocumentPpt size={24} />}
						{(item.FileExtension == 'png' || item.FileExtension == 'jpg') && <GrDocumentImage size={24} />}
						<p className="mt-">{item.FileName}</p>
					</div>
					<div></div>
				</div>
			)
		})
	}

	return (
		<div>
			<Form.Item name={name} style={style} label={label} className={`${className} w-full`} required={isRequired} rules={rules}>
				<Upload
					maxCount={max}
					className="avatar-uploader"
					showUploadList={true}
					disabled={disabled}
					multiple={multiple}
					itemRender={renderFilesName}
					name="file"
					customRequest={(event) => handleChange_file(event.file)}
					onChange={(event) => {
						let temp = []
						event.fileList.forEach((item) => {
							temp.push({ FileExtension: item.name.split('.')[item.name.split('.').length - 1], FileName: item.name })
						})
						setFiles(temp)
					}}
				>
					<PrimaryButton loading={loadingFile} background="green" type="button" children={<span>{buttonText}</span>} icon="upload" />
				</Upload>
			</Form.Item>
		</div>
	)
}
