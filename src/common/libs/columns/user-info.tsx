import React from 'react'
import Avatar from '~/common/components/Avatar'

export const userInfoColumn = {
	title: 'Thông tin',
	dataIndex: 'Code',
	render: (value, item) => (
		<div className="flex items-center">
			<Avatar className="h-[40px] w-[40px] rounded-full shadow-sm object-cover" uri={item?.Avatar} />
			<div className="ml-[8px]">
				<div className="text-[16px] font-[600]">{item?.FullName}</div>
				<div className="text-[14px] font-[400]">{item?.UserCode}</div>
			</div>
		</div>
	)
}
