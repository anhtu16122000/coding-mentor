import React from 'react'
import Avatar from '~/common/components/Avatar'

export const userInfoColumn = {
	title: 'Thông tin',
	dataIndex: 'Code',
	render: (value, item) => (
		<div className="flex items-center">
			<Avatar className="h-[36px] w-[36px] rounded-full shadow-sm" uri={item?.Avatar} />
			<div className="ml-[8px]">
				<h2 className="text-[16px] font-[600]">{item?.FullName}</h2>
				<h3 className="text-[14px] font-[400]">{item?.UserCode}</h3>
			</div>
		</div>
	)
}
