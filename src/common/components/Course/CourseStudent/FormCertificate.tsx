import { Form } from 'antd'
import React from 'react'

const FormCertificate = () => {
	return (
		<div className="relative">
			<img src="/images/certificateTemplate.png" />
			<div className="absolute smartphone:-top-[7%] tablet:top-[3%] laptop:top-[5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="title">
					<input
						placeholder="CERTIFICATE"
						className="font-Montserrat w-full pt-5 pb-2 smartphone:text-[13px] tablet:text-[30px] laptop:text-[52px] font-normal text-center bg-transparent placeholder:text-[#000] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:top-[9.5%] tablet:top-[15%] laptop:top-[17%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="name">
					<input
						placeholder="CHỨNG CHỈ HOÀN THÀNH KHÓA HỌC"
						className="font-Montserrat w-full smartphone:text-[4px] tablet:text-[10px] laptop:text-[16px] font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:top-[18%] tablet:top-[23%] laptop:top-[24.5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="titleSub">
					<input
						placeholder="This certificates that"
						className="font-Montserrat w-full smartphone:text-[5px] tablet:text-[12px] laptop:text-2xl font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:top-[18.5%] tablet:top-[25.5%] laptop:top-[27.4%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="recognize">
					<input
						placeholder="Công nhận"
						className="font-Montserrat italic w-full smartphone:text-[5px] tablet:text-[12px] laptop:text-[20px] font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:bottom-[45%] tablet:bottom-[48%] laptop:bottom-[50%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="Content">
					<input
						placeholder="{TenHocVien}"
						className="w-full pt-5 pb-2 smartphone:text-[10px] tablet:text-[20px] laptop:text-5xl font-medium text-[#ab1d38] text-center bg-transparent placeholder:text-[#ab1d38] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:top-[37.5%] tablet:top-[47%] laptop:top-[49.5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="successEnglish">
					<input
						placeholder="Has successfully completed"
						className="font-Montserrat w-full smartphone:text-[5px] tablet:text-[12px] laptop:text-[19px] font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:top-[40.5%] tablet:top-[50%] laptop:top-[52.5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="successVietNam">
					<input
						placeholder="Đã hoàn thành khóa học"
						className="font-Montserrat italic w-full smartphone:text-[5px] tablet:text-[12px] laptop:text-[19px] font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:top-[49.5%] tablet:top-[60%] laptop:top-[62.5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="courseEnglish">
					<input
						placeholder="DIGITAL TRAINING"
						className="text-[#ab1d38] w-full smartphone:text-[5px] tablet:text-[13px] laptop:text-[20px] font-bold text-center bg-transparent placeholder:text-[#ab1d38] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:top-[52%] tablet:top-[63%] laptop:top-[65.7%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="courseVietNam">
					<input
						placeholder="KỸ NĂNG BÁN HÀNG THỜI KỸ THUẬT SỐ"
						className="italic text-[#ab1d38] w-full smartphone:text-[5px] tablet:text-[13px] laptop:text-[20px] font-bold text-center bg-transparent placeholder:text-[#ab1d38] focus:outline-none"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:bottom-[4%] tablet:bottom-[13%] laptop:bottom-[15%] left-2/4 -translate-x-[50%] -translate-y-[20%] w-[90%]">
				<Form.Item name="director">
					<input
						className="font-Montserrat w-full pt-4 pb-2 smartphone:text-[6px] tablet:text-[15px] laptop:text-2xl font-medium uppercase text-center bg-transparent focus:outline-none placeholder:text-tw-black"
						placeholder="Nhập tên giám đốc"
					/>
				</Form.Item>
			</div>
			<div className="absolute smartphone:bottom-[11%] tablet:bottom-[12.5%] laptop:bottom-[13.3%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
				<Form.Item name="role">
					<input
						className="font-Montserrat w-full smartphone:text-[5px] tablet:text-[12px] laptop:text-[18px] text-center bg-transparent font-medium tracking-tight placeholder:text-[#000] focus:outline-none"
						placeholder="Project Director - Giám đốc dự án"
					/>
				</Form.Item>
			</div>
		</div>
	)
}

export default FormCertificate
