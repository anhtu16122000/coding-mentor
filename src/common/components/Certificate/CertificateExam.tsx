import React, { useEffect, useState } from 'react'
import { Card, Popover, Tooltip, Form } from 'antd'
import { certificateConfigApi } from '~/api/certificate/certificate-config'
import { ShowNoti } from '~/common/utils'
import EditorField from '../FormControl/EditorField'
import { Eye } from 'react-feather'
import PrimaryButton from '../Primary/Button'

const CertificateExam = () => {
	const [certificateExam, setCertificateExam] = useState([])
	const [contentCertificate, setContentCertificate] = useState('')
	const [form] = Form.useForm()

	const getGuide = async () => {
		try {
			const response = await certificateConfigApi.getGuide()
			if (response.status === 200) {
				setCertificateExam(response.data.data)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const getData = async () => {
		try {
			const response = await certificateConfigApi.getData()
			if (response.status === 200) {
				setContentCertificate(response.data.data.Content)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		getGuide()
		getData()
	}, [])

	const onChangeEditor = (value) => {
		form.setFieldsValue({
			Content: value
		})
	}

	const handleCopyTextGuide = (value) => {
		navigator.clipboard.writeText(value)
		ShowNoti('success', 'Đã sao chép')
	}

	const [loading, setLoading] = useState(false)

	const onFinish = async (data) => {
		setLoading(true)
		try {
			const response = await certificateConfigApi.setConfig(data)
			if (response.status === 200) {
				ShowNoti('success', response.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const content = (
		<div>
			{certificateExam.map((certificate, index) => {
				return (
					<div onClick={() => handleCopyTextGuide(certificate.split(':')[0])} className="mb-2 select-none" key={index}>
						<Tooltip className="cursor-pointer" placement="left" title={'Nhấn để sao chép'}>
							<span className="font-[700]">{`${certificate.split(':')[0]}:`}</span>
							<span>{certificate.split(':')[1]}</span>
						</Tooltip>
					</div>
				)
			})}
		</div>
	)

	const certificatePopover = (
		<Popover overlayClassName="show-arrow" content={content} placement="bottomRight" trigger="hover">
			<div className="none-selection cursor-pointer h-[36px] inline-flex px-3 items-center bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] text-[#fff] rounded-[6px]">
				<Eye className="mr-2" size={16} />
				<div>Xem mã hướng dẫn</div>
			</div>
		</Popover>
	)

	return (
		<div className="container">
			<Card extra={certificatePopover}>
				<Form layout="vertical" form={form} onFinish={onFinish}>
					<EditorField
						customFieldProps={{
							quickbars_insert_toolbar: false,
							quickbars: false,
							contextmenu: 'none'
						}}
						initialValue={contentCertificate}
						name="Content"
						onChangeEditor={onChangeEditor}
					/>
					<div className="w-full inline-flex items-center justify-center">
						<PrimaryButton loading={loading} disable={loading} type="submit" icon="save" background="blue">
							Lưu chứng chỉ
						</PrimaryButton>
					</div>
				</Form>
			</Card>
		</div>
	)
}

export default CertificateExam
