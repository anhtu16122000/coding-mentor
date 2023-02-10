import { Card, Skeleton } from 'antd'
import React from 'react'

function LoadingExerciseDetails() {
	return (
		<div className="p-[16px]">
			<Card>
				<div className="p-[16px]">
					<div>
						<Skeleton active />
					</div>

					<div className="mt-[24px] flex">
						<Skeleton active paragraph={false} className="w-[16px]" />
						<Skeleton active paragraph={false} className="ml-[16px] w-[40%] w600:w-[20%]" />
					</div>
					<div className="mt-[16px] flex">
						<Skeleton active paragraph={false} className="w-[16px]" />
						<Skeleton active paragraph={false} className="ml-[16px] w-[70%] w600:w-[50%]" />
					</div>
					<div className="mt-[16px] flex">
						<Skeleton active paragraph={false} className="w-[16px]" />
						<Skeleton active paragraph={false} className="ml-[16px] w-[20%] w600:w-[10%]" />
					</div>
					<div className="mt-[16px] flex">
						<Skeleton active paragraph={false} className="w-[16px]" />
						<Skeleton active paragraph={false} className="ml-[16px] w-[30%] w600:w-[15%]" />
					</div>
				</div>
			</Card>

			<Card className="mt-[16px]">
				<div className="p-[16px]">
					<div>
						<Skeleton active />
					</div>
					<div className="mt-[24px] flex">
						<Skeleton active paragraph={false} className="w-[16px]" />
						<Skeleton active paragraph={false} className="ml-[16px] w-[40%] w600:w-[20%]" />
					</div>
					<div className="mt-[16px] flex">
						<Skeleton active paragraph={false} className="w-[16px]" />
						<Skeleton active paragraph={false} className="ml-[16px] w-[70%] w600:w-[50%]" />
					</div>
					<div className="mt-[16px] flex">
						<Skeleton active paragraph={false} className="w-[16px]" />
						<Skeleton active paragraph={false} className="ml-[16px] w-[20%] w600:w-[10%]" />
					</div>
					<div className="mt-[16px] flex">
						<Skeleton active paragraph={false} className="w-[16px]" />
						<Skeleton active paragraph={false} className="ml-[16px] w-[30%] w600:w-[15%]" />
					</div>
				</div>
			</Card>
		</div>
	)
}

export default LoadingExerciseDetails
