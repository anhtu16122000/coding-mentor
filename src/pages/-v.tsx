import React from 'react'
import moment from 'moment'

const VersionPage = () => {
	return (
		<div className="w-full h-[100vh] max-w-[1200px] mx-auto p-[16px]">
			<h1 className="font-[600] uppercase text-[26px]">Thông tin hệ thống</h1>

			<div className="w-full">
				<div className="bg-[#fff] rounded-[6px] flex items-center shadow-sm border-[#dedede] border-solid border-[1px] p-[16px]">
					<div className="uppercase">
						<div className="font-[500]">Build ID</div>
						<div className="text-[22px] font-[700] text-[#D21320]">{process.env.NEXT_PUBLIC_BUILD_ID}</div>
					</div>

					<div className="uppercase ml-[64px]">
						<div className="font-[500]">Cập nhật lúc</div>
						<div className="text-[22px] font-[700] text-[#D21320]">
							{moment(new Date(process.env.NEXT_PUBLIC_BUILD_TIME)).format('HH:mm DD:MM/YYYY')}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VersionPage
