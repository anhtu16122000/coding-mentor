import { Skeleton } from 'antd'
import React from 'react'

const ProListLoading = () => {
	return (
		<div className="grid grid-cols-1 gap-3 mb-[16px]">
			{[1, 2, 3].map((item, index) => {
				return (
					<div key={`grid-load-${index}`} className="col-span-1 rounded-[6px] border-[1px] border-[#e7e7e7] p-[8px] grid grid-cols-8 gap-4">
						<div className="col-span-5 w700:col-span-3 flex">
							<div>
								<Skeleton paragraph={false} active className="w-[50px] mt-[0px] loading-none-border loading-m-0" />
								<Skeleton paragraph={false} active className="w-[50px] loading-none-border loading-m-0" />
								<Skeleton paragraph={false} active className="w-[50px] loading-none-border loading-m-0" />
							</div>
							<div className="ml-[8px]">
								<Skeleton paragraph={false} active className="w-[150px] loading-m-0" />
								<Skeleton paragraph={false} active className="w-[80px] loading-m-0 mt-[14px]" />
							</div>
						</div>
						<div className="col-span-2 hidden w350:block">
							<Skeleton paragraph={false} active className="w-[50px] loading-m-0" />
							<Skeleton paragraph={false} active className="w-[80px] loading-m-0 mt-[14px]" />
						</div>
						<div className="col-span-2 hidden w700:block">
							<Skeleton paragraph={false} active className="w-[70px] loading-m-0" />
							<Skeleton paragraph={false} active className="w-[50px] loading-m-0 mt-[14px]" />
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default ProListLoading
