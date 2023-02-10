import React, { useMemo, useRef } from 'react'
import { Card } from 'antd'
import { PDFExport } from '@progress/kendo-react-pdf'
import { FaRegFilePdf } from 'react-icons/fa'
import CertificatePDF from './CertificatePDF'

const CertificateStudent = (props) => {
	const pdfExportComponent = useRef<PDFExport>(null)
	const { certificate } = props

	const data = useMemo(() => {
		if (certificate) {
			return JSON.parse(certificate[0]?.Content || null)
		}
	}, [certificate])

	return (
		<Card
			title="Thông tin chứng chỉ"
			extra={
				<button
					onClick={() => {
						if (pdfExportComponent.current) {
							pdfExportComponent.current.save()
						}
					}}
					className="flex items-center justify-center bg-tw-primary text-white py-2 px-3 rounded-md mb-3"
				>
					<FaRegFilePdf />
					<span className="ml-2">Export PDF</span>
				</button>
			}
		>
			{certificate.length > 0 && (
				<PDFExport landscape={true} fileName="Certificate.pdf" ref={pdfExportComponent}>
					<CertificatePDF data={data} />
				</PDFExport>
			)}
		</Card>
	)
}

export default CertificateStudent
