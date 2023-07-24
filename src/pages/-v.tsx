import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/36395-lonely-404.json'
import moment from 'moment'

// const buildTimestamp = preval`module.exports = new Date().getTime();`

const VersionPage = () => {
	const [buildTime, setBuildTime] = useState('Loading...')

	useEffect(() => {}, [])

	return (
		<div className="w-full h-[100vh] max-w-[1200px] mx-auto p-[16px]">
			<h1 className="font-[600] uppercase text-[26px]">Thông tin hệ thống</h1>

			<div className="w-full">
				<div className="bg-[#fff] rounded-[6px] flex items-center shadow-sm border-[#dedede] border-solid border-[1px] p-[16px]">
					<div className="uppercase">
						<div className="font-[500]">Build ID</div>
						<div className="text-[22px] font-[700] text-[#1b73e8]">{process.env.NEXT_PUBLIC_BUILD_ID}</div>
					</div>

					<div className="uppercase ml-[64px]">
						<div className="font-[500]">Cập nhật lúc</div>
						<div className="text-[22px] font-[700] text-[#1b73e8]">
							{moment(new Date(process.env.NEXT_PUBLIC_BUILD_TIME)).format('HH:mm DD:MM/YYYY')}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VersionPage
