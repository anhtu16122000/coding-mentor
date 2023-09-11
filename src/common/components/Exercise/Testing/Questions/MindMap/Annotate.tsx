import React from 'react'

const MindMapAnnotate = () => {
	return (
		<>
			<div className="h-[1px] bg-[#00000015] w-full mt-[8px] mb-[14px]" />

			<div className="flex items-center">
				<div className="flex items-center">
					<div className="bg-[#1890ff] w-[16px] h-[16px] rounded-[4px] mr-[4px]" />
					<div className="font-[600]">Đáp án đúng</div>
				</div>

				<div className="flex items-center ml-[16px]">
					<div className="bg-[#0baa0e] w-[16px] h-[16px] rounded-[4px] mr-[4px]" />
					<div className="font-[600]">Chọn đúng</div>
				</div>

				<div className="flex items-center ml-[16px]">
					<div className="bg-[#e00e0e] w-[16px] h-[16px] rounded-[4px] mr-[4px]" />
					<div className="font-[600]">Chọn sai</div>
				</div>
			</div>
		</>
	)
}

export default MindMapAnnotate
