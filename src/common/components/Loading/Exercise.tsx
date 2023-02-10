import { Card, List, Skeleton } from 'antd'
import React from 'react'

function LoadingExercise() {
	return (
		<div className="p-[16px]">
			<List
				grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
				dataSource={[1, 2, 3]}
				renderItem={(item, index) => (
					<Card className="cc-exam-item !bg-[#fff]">
						<Skeleton active paragraph={false} className="w-[80%]" />
						<Skeleton active paragraph={false} className="w-[80px] mt-[8px]" />
						<div className="cc-exam-item-info !mt-[16px]" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
							<Skeleton active paragraph={false} className="w-[90px]" />
							<Skeleton active paragraph={false} className="w-[70px] mt-[8px]" />
							<Skeleton active paragraph={false} className="w-[40px] mt-[8px]" />
						</div>
						<Skeleton.Button className="mt-[14px]" style={{ width: 110, borderRadius: 6 }} active />
					</Card>
				)}
			/>
		</div>
	)
}

export default LoadingExercise
