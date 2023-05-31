import React from 'react'
import { MdWifi } from 'react-icons/md'
import { TiHome } from 'react-icons/ti'

const ProClassType = (props) => {
	const { data } = props

	return (
		<>
			{data?.Type == 2 && (
				<div className="class-type bg-primary">
					<MdWifi size={16} className="mb-[-1px]" />
					<p>Online</p>
				</div>
			)}

			{data?.Type == 1 && (
				<div className="class-type bg-[#f51d92]">
					<TiHome size={16} />
					<p>Offline</p>
				</div>
			)}
		</>
	)
}

export default ProClassType
