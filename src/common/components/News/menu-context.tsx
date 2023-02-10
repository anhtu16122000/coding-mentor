import { Popconfirm } from 'antd'
import React, { FC } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { FaEdit } from 'react-icons/fa'

const MenuContext: FC<{ onDelete: Function; data: any; onEdit: Function; showEdit?: boolean }> = (props) => {
	const { onDelete, onEdit, showEdit } = props

	return (
		<div className="cc-comment-menu-main w-[110px]">
			<Popconfirm showArrow={false} placement="right" onConfirm={() => onDelete()} title="Xoá?" cancelText="Hủy" okText="Xóa">
				<div className="cc-comment-menu-item">
					<AiFillDelete className="text-[#E53935]" size={18} />
					<span>Xoá</span>
				</div>
			</Popconfirm>

			{showEdit && (
				<>
					<div className="cc-hr my-[4px] mx-[4px]" />
					<div className="cc-comment-menu-item" onClick={() => onEdit()}>
						<FaEdit className="text-[#1E88E5] ml-[2px]" size={18} />
						<span>Chỉnh sửa</span>
					</div>
				</>
			)}
		</div>
	)
}

export default MenuContext
