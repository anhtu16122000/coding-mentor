import { List } from 'antd'
import moment from 'moment'
import React from 'react'

const ListNotificate = (props) => {
	const { data, onClick } = props
	const getHeight = document.querySelector('#wrap-list') as HTMLDivElement
	return (
		<List
			style={{ height: `${getHeight?.offsetHeight - 110}px` }}
			className="overflow-y-auto scrollbar"
			itemLayout="horizontal"
			dataSource={data}
			renderItem={(item: INotification) => {
				return (
					<List.Item onClick={() => onClick(item)} className="cursor-pointer p-2 rounded-xl my-2 hover:bg-[#e2e8f0] transition-all">
						<List.Item.Meta
							title={
								<div className="flex items-center justify-between">
									<p className="font-bold text-tw-blue line-clamp-1">{item.Title}</p>
									<p className="font-bold">{moment(item.CreatedOn).format('DD/MM/YYYY')}</p>
								</div>
							}
							description={<p className="font-bold line-clamp-3 text-tw-black">{item.Content}</p>}
						/>
					</List.Item>
				)
			}}
		/>
	)
}

export default ListNotificate
