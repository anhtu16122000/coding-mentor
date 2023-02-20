import { Button, Col, Skeleton } from 'antd'
import Router from 'next/router'
import React from 'react'
import { encode } from '~/common/utils/common'

interface IProps {
	groupData: any
}

const GroupItem = ({ groupData }: IProps) => {
	return (
		<Col xs={24} md={12} lg={8}>
			<div className="p-4 rounded-lg shadow-md bg-tw-white">
				<div className="flex items-end gap-[16px]">
					<div className="w-[80px] h-[80px] rounded-lg overflow-hidden shadow-sm">
						<img className="object-cover w-full h-full " src={groupData.BackGround} />
					</div>

					<div className="flex-1">
						<h4 className="text-[14px] font-semibold">{groupData.Name}</h4>
						<Button
							className="rounded-lg w-full mt-2 bg-[#3b82f6] color-white font-semibold"
							onClick={() => {
								Router.push({ pathname: '/news', query: { group: encode(groupData.Id) } })
							}}
						>
							Xem nhóm
						</Button>
					</div>
				</div>
			</div>
		</Col>
	)
}

GroupItem.LoadingSkeleton = () => {
	return (
		<Col xs={24} md={12} lg={8}>
			<div className="p-4 rounded-lg shadow-md bg-tw-white">
				<div className="flex items-end gap-[16px]">
					<div className="overflow-hidden rounded-lg">
						<Skeleton.Image active={true} />
					</div>

					<div className="flex-1">
						<Skeleton className="object-cover w-full h-full" active />
					</div>
				</div>
			</div>
		</Col>
	)
}

export default GroupItem
