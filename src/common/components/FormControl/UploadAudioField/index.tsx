import { Form, Upload } from 'antd'
import { useEffect, useState } from 'react'
import PrimaryButton from '../../Primary/Button'

export default function UploadAudioField(props: IUploadFileField & { loading?: boolean }) {
	const { style, label, name, isRequired, className, disabled, rules, multiple, form, loading, max } = props

	const [audioPreview, setAudioPreview] = useState(null)

	useEffect(() => {
		if (!!form.getFieldValue(name)) {
			setAudioPreview(form.getFieldValue(name))
		}
	}, [form.getFieldValue(name)])

	function removeFile() {
		setAudioPreview('')
		form.setFieldsValue({ [name]: '' })
	}

	// Sau khi chọn thì đừng upload, đợi nó submit thì hãy upload nhe mấy fen
	return (
		<>
			<Form.Item name={name} style={style} label={label} className={`${className}`} required={isRequired} rules={rules}>
				<Upload
					maxCount={max || 1}
					showUploadList={false}
					disabled={disabled}
					multiple={multiple || false}
					name="file"
					accept="audio/*"
					className="cc-flex-upload"
					beforeUpload={(event) => {
						const audioURL = URL.createObjectURL(event)
						setAudioPreview(audioURL)
					}}
				>
					<PrimaryButton loading={loading} background="green" type="button" icon="upload">
						{!!audioPreview ? 'Chọn lại' : 'Chọn âm thanh'}
					</PrimaryButton>

					{!!audioPreview && (
						<PrimaryButton disable={loading} background="red" icon="remove" type="button" className="ml-[8px]" onClick={removeFile}>
							Xoá file
						</PrimaryButton>
					)}
				</Upload>
			</Form.Item>

			{audioPreview && (
				<div className="mt-[-8px] flex items-center col-span-4">
					<audio controls controlsList="nodownload noplaybackrate">
						<source src={audioPreview} type="audio/mp3" />
						Trình duyệt của bạn không hỗ trợ. Vui lòng sử dụng Chrome.
					</audio>
				</div>
			)}
		</>
	)
}
