import { Divider, Skeleton } from 'antd'
import React from 'react'

const LoadingQBank = () => {
	return (
		<>
			<div className="bg-[#fff] rounded-[8px] p-[16px] mt-[16px] shadow-sm">
				<div className="flex items-center justify-between">
					<Skeleton active paragraph={false} className="flex-1 max-w-[250px]" />
					<Skeleton active paragraph={false} className="w-[100px]" />
				</div>
				<div className="flex items-center">
					<Skeleton active paragraph={false} className="w-[100px]" />
					<Skeleton active paragraph={false} className="w-[80px] ml-[8px]" />
					<Skeleton active paragraph={false} className="w-[90px] ml-[8px]" />
				</div>

				<Divider className="ant-divider-16 !w-auto !min-w-fit" />

				<div className="flex items-center">
					<Skeleton active paragraph={false} className="w-[20px]" />
					<Skeleton active paragraph={false} className="w-[280px] ml-[8px]" />
				</div>

				<div className="flex items-center mt-[16px]">
					<Skeleton active paragraph={false} className="w-[30px]" />
					<Skeleton active paragraph={false} className="w-[160px] ml-[8px]" />
				</div>
				<div className="flex items-center">
					<Skeleton active paragraph={false} className="w-[30px]" />
					<Skeleton active paragraph={false} className="w-[210px] ml-[8px]" />
				</div>
				<div className="flex items-center">
					<Skeleton active paragraph={false} className="w-[30px]" />
					<Skeleton active paragraph={false} className="w-[100px] ml-[8px]" />
				</div>
				<div className="flex items-center">
					<Skeleton active paragraph={false} className="w-[30px]" />
					<Skeleton active paragraph={false} className="w-[190px] ml-[8px]" />
				</div>
			</div>

			<div className="bg-[#fff] rounded-[8px] p-[16px] mt-[16px] shadow-sm">
				<div className="flex items-center justify-between">
					<Skeleton active paragraph={false} className="flex-1 max-w-[200px]" />
					<Skeleton active paragraph={false} className="w-[100px]" />
				</div>
				<div className="flex items-center">
					<Skeleton active paragraph={false} className="w-[100px]" />
					<Skeleton active paragraph={false} className="w-[80px] ml-[8px]" />
					<Skeleton active paragraph={false} className="w-[90px] ml-[8px]" />
				</div>

				<Divider className="ant-divider-16 !w-auto !min-w-fit" />

				<Skeleton active paragraph={false} className="w-[210px]" />
				<Skeleton active paragraph={false} className="w-[160px]" />
				<Skeleton.Image active className="w-[180px] mt-[4px]" />

				<div className="flex items-center mt-[24px]">
					<Skeleton active paragraph={false} className="w-[30px]" />
					<Skeleton active paragraph={false} className="w-[100px] ml-[8px]" />
				</div>
				<div className="flex items-center">
					<Skeleton active paragraph={false} className="w-[30px]" />
					<Skeleton active paragraph={false} className="w-[190px] ml-[8px]" />
				</div>
			</div>
		</>
	)
}

export default LoadingQBank
