import { Skeleton } from 'antd'
import React from 'react'

const ProGridLoading = () => {
	return (
		<div className="card-class-container mb-[16px]">
			{[1, 2, 3].map((item, index) => {
				return (
					<div key={`grid-load-${index}`} className="col-span-1 rounded-[6px] border-[1px] border-[#e7e7e7] p-[16px]">
						<div className="bg-[rgba(190, 190, 190, 0.2)] rounded-t-[6px] m-[-16px] mb-[8px]">
							<Skeleton paragraph={false} active className="mt-[-26px] loading-t-border" />
							<Skeleton paragraph={false} active className="mt-[-20px] loading-none-border" />
							<Skeleton paragraph={false} active className="mt-[-20px] loading-none-border" />
							<Skeleton paragraph={false} active className="mt-[-20px] loading-none-border" />
							<Skeleton paragraph={false} active className="mt-[-20px] loading-none-border" />
							<Skeleton paragraph={false} active className="mt-[-20px] loading-none-border" />
							<Skeleton paragraph={false} active className="mt-[-20px] loading-none-border" />
						</div>
						<Skeleton active className="mt-[0px]" />
					</div>
				)
			})}
		</div>
	)
}

export default ProGridLoading
