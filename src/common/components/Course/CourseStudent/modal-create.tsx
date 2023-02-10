import { Form, Modal, Input } from 'antd'
import React, { useState, useRef, useMemo } from 'react'
import { FaRegFilePdf } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi'
import { certificateApi } from '~/api/certificate/certificate'
import { ShowNoti, wait } from '~/common/utils'
import PrimaryButton from '../../Primary/Button'
import { PDFExport } from '@progress/kendo-react-pdf'
import moment from 'moment'
import FormCertificate from './FormCertificate'
import CertificatePDF from './CertificatePDF'

const ModalCreate = (props) => {
	const { parentData, getCertificate } = props
	const pdfExportComponent = useRef<PDFExport>(null)

	const [form] = Form.useForm()

	const [isModalVisible, setIsModalVisible] = useState({ studentCode: '', status: false })
	const [showEditor, setShowEditor] = useState(false)

	const showModal = async (data) => {
		setIsModalVisible({ studentCode: data.studentCode, status: true })

		await wait(10)
		setShowEditor(true)
	}

	const handleCancel = () => {
		setIsModalVisible({ studentCode: '', status: false })
	}

	const onFinish = async (data) => {
		const JsonContent = {
			Content: data.Content,
			courseEnglish: data.courseEnglish,
			courseVietNam: data.courseVietNam,
			director: data.director,
			name: data.name,
			recognize: data.recognize,
			role: data.role,
			successEnglish: data.successEnglish,
			successVietNam: data.successVietNam,
			title: data.title,
			titleSub: data.titleSub
		}
		const updateContent = {
			Id: parentData.Id,
			Content: JSON.stringify(JsonContent)
		}
		try {
			const response = await certificateApi.updateCertificate(updateContent)
			if (response.status === 200) {
				ShowNoti('success', response.data.message)
				getCertificate()
				setIsModalVisible({ studentCode: '', status: false })
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const data = useMemo(() => {
		if (parentData.Content) {
			return JSON.parse(parentData.Content || null)
		}
	}, [parentData])

	useMemo(() => {
		if (data) {
			form.resetFields()
			form.setFieldValue('title', `${data.title}`)
			form.setFieldValue('name', `${data.name}`)
			form.setFieldValue('titleSub', `${data.titleSub}`)
			form.setFieldValue('recognize', `${data.recognize}`)
			form.setFieldValue('Content', `${data.Content}`)
			form.setFieldValue('successEnglish', `${data.successEnglish}`)
			form.setFieldValue('successVietNam', `${data.successVietNam}`)
			form.setFieldValue('courseEnglish', `${data.courseEnglish}`)
			form.setFieldValue('courseVietNam', `${data.courseVietNam}`)
			form.setFieldValue('director', `${data.director}`)
			form.setFieldValue('role', `${data.role}`)
		}
	}, [data])
	return (
		<>
			<button onClick={() => showModal(parentData)} className="text-[#4CAF50] hover:text-[#449a48] focus:text-[#38853b]">
				<FiEdit size={22} />
			</button>

			<Modal
				centered
				title="Thông tin chứng chỉ"
				visible={isModalVisible.status && isModalVisible.studentCode === parentData.studentCode}
				onCancel={handleCancel}
				width={1200}
				footer={null}
			>
				<PrimaryButton
					className="mb-3"
					type="button"
					background="green"
					onClick={() => {
						if (pdfExportComponent.current) {
							pdfExportComponent.current.save()
						}
					}}
				>
					<FaRegFilePdf />
					<span className="ml-2">Export PDF</span>
				</PrimaryButton>

				<div className="absolute opacity-0">
					<PDFExport landscape={true} fileName={`certificate-${moment(new Date()).format('YYMMDD_HHmm')}.pdf`} ref={pdfExportComponent}>
						<div className="container">
							<CertificatePDF data={data} />
						</div>
					</PDFExport>
				</div>

				<Form
					layout="vertical"
					form={form}
					onFinish={onFinish}
					initialValues={{
						Id: data?.Id,
						title: data?.title,
						name: data?.name,
						titleSub: data?.titleSub,
						recognize: data?.recognize,
						Content: data?.Content,
						successEnglish: data?.successEnglish,
						successVietNam: data?.successVietNam,
						courseEnglish: data?.courseEnglish,
						courseVietNam: data?.courseVietNam,
						director: data?.director,
						role: data?.role
					}}
				>
					<Form.Item hidden name="Id" initialValue={parentData?.Id}>
						<Input className="primary-input" />
					</Form.Item>

					{showEditor && (
						// <Form.Item name="Content" initialValue={parentData?.Content}>
						<div className="container">
							<FormCertificate />
						</div>
						// </Form.Item>
					)}

					<div className="flex items-center justify-center mt-4">
						<PrimaryButton onClick={handleCancel} className="mr-3" background="red" icon="cancel" type="button">
							Hủy
						</PrimaryButton>
						<PrimaryButton className="relative z-50 flex items-center justify-center" background="blue" icon="save" type="submit">
							Lưu
						</PrimaryButton>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default ModalCreate
