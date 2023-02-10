import React from 'react'
import { AiOutlineFileDone } from 'react-icons/ai'
import { FaRegClock } from 'react-icons/fa'
import ReactHTMLParser from 'react-html-parser'
import { TbFileAlert, TbFileCertificate, TbFileInvoice } from 'react-icons/tb'

const PreviewInfo = (props) => {
	const { data } = props

	return (
		<>
			<div className="bottom-header-exam">
				<div className="header-exam-total">Tổng số câu: {data?.NumberExercise}</div>
				<div className="header-exam-info">
					<div className="header-exam-info-item mr-2 ">
						<FaRegClock size={14} className="mr-2" />
						<div className="mt-[2px]">{data?.Time} Phút</div>
					</div>
					<div className="header-exam-info-item">
						<AiOutlineFileDone size={14} className="mr-2" />
						<div className="mt-[2px]">Cần {data?.PassPoint} điểm để đạt</div>
					</div>
				</div>
			</div>

			<div className="preview-exam-detail">
				<div className="prev-ex-de-item">
					<div className="prev-ex-de-inner">
						<div className="ex-de-in-icon bg-[#eef6e5]">
							<TbFileInvoice size={26} color="#619e10" />
						</div>
						<div className="ex-de-in-content">
							<div className="ex-de-co-title">Dễ</div>
							<div className="ex-de-co-content text-[#619e10]">{data?.EasyExercise}</div>
						</div>
					</div>
				</div>

				<div className="prev-ex-de-item">
					<div className="prev-ex-de-inner">
						<div className="ex-de-in-icon bg-[#e6efff]">
							<TbFileAlert size={26} color="#2972d8" />
						</div>
						<div className="ex-de-in-content">
							<div className="ex-de-co-title">Trung bình</div>
							<div className="ex-de-co-content text-[#2972d8]">{data?.NormalExercise}</div>
						</div>
					</div>
				</div>

				<div className="prev-ex-de-item">
					<div className="prev-ex-de-inner">
						<div className="ex-de-in-icon bg-[#f8f0e6]">
							<TbFileCertificate size={26} color="#be931b" />
						</div>
						<div className="ex-de-in-content">
							<div className="ex-de-co-title">Khó</div>
							<div className="ex-de-co-content text-[#be931b]">{data?.DifficultExercise}</div>
						</div>
					</div>
				</div>
			</div>

			{!!data?.Description && (
				<div className="col-span-8 mt-3 whitespace-pre-wrap">
					<div className="text-[14px] font-[700]">Hướng dẫn làm bài:</div>
					{ReactHTMLParser(data?.Description)}
				</div>
			)}
		</>
	)
}

export default PreviewInfo
