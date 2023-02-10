import React, { useRef } from 'react'
import { Card } from 'antd'
import { PDFExport } from '@progress/kendo-react-pdf'
import { FaRegFilePdf } from 'react-icons/fa'

const CertificateStudent = (props) => {
	const pdfExportComponent = useRef<PDFExport>(null)
	const { certificate } = props

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
					<div className="container">
						<div className="relative">
							<img src="/images/template-certificate.png" />
							<div className="absolute bottom-[50%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
								<input
									className="bg-transparent w-full pt-5 pb-2 text-5xl font-medium uppercase text-[#ab1d38] text-center placeholder:text-[#ab1d38] focus:outline-none"
									value={certificate[0].Content.trim()}
									disabled
								/>
							</div>
							<div className="absolute bottom-[15%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
								<input
									className="w-full pt-4 pb-2 text-3xl font-medium uppercase text-center bg-transparent focus:outline-none"
									value="Nguyễn Phạm Hoàng Long"
									disabled
								/>
							</div>
						</div>
					</div>
				</PDFExport>
			)}
		</Card>
	)
}

export default CertificateStudent
