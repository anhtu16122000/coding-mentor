import { Empty, Skeleton } from 'antd'
import React from 'react'

function EmptyData(props) {
	return (
		<div className="pt-5 pb-5">
			{props?.loading && (
				<div style={{ width: '90%' }}>
					<Skeleton round={true} active />
				</div>
			)}
			{!props?.loading && <Empty description={false} children={<div className="disable">Không có dữ liệu</div>} />}
		</div>
	)
}

export default EmptyData
