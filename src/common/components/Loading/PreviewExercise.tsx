import { Card, Skeleton } from 'antd'
import React from 'react'

function LoadingPreviewExercise() {
	return (
		<div className="w-full">
			<div className="flex w-full justify-between">
				<Skeleton active paragraph={false} className="w-[50%]" />
				<Skeleton active paragraph={false} className="w-[100px]" />
			</div>

			<div className="flex w-full justify-between mt-[8px]">
				<Skeleton active paragraph={false} className="w-[60px]" />
				<div className="w-[150px] flex">
					<Skeleton active paragraph={false} className="flex-[1] mr-[16px]" />
					<Skeleton active paragraph={false} className="flex-[2]" />
				</div>
			</div>

			<div className="flex w-full mt-[16px]">
				<Card className="flex-1 mr-[16px]">
					<div className="flex flex-row items-center">
						<Skeleton.Avatar active />
						<div className="flex-1 ml-[16px]">
							<Skeleton active paragraph={false} className="w-[50px]" />
							<Skeleton active paragraph={false} className="w-[20px] mt-[8px]" />
						</div>
					</div>
				</Card>
				<Card className="flex-1 mr-[16px]">
					<div className="flex flex-row items-center">
						<Skeleton.Avatar active />
						<div className="flex-1 ml-[16px]">
							<Skeleton active paragraph={false} className="w-[50px]" />
							<Skeleton active paragraph={false} className="w-[20px] mt-[8px]" />
						</div>
					</div>
				</Card>
				<Card className="flex-1">
					<div className="flex flex-row items-center">
						<Skeleton.Avatar active />
						<div className="flex-1 ml-[16px]">
							<Skeleton active paragraph={false} className="w-[50px]" />
							<Skeleton active paragraph={false} className="w-[20px] mt-[8px]" />
						</div>
					</div>
				</Card>
			</div>

			<div className="flex flex-row items-center justify-center mt-[32px]">
				<Skeleton active paragraph={false} className="w-[120px] highter-skeleton" />
				<Skeleton active paragraph={false} className="ml-[8px] w-[70px] highter-skeleton" />
			</div>
		</div>
	)
}

export default LoadingPreviewExercise
