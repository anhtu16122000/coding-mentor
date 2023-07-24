import { Modal } from 'antd'
import React, { useState } from 'react'
import { classApi } from '~/api/learn/class'
import { ShowNostis } from '~/common/utils'
import ModalFooter from '../../ModalFooter'
import { BiTrash } from 'react-icons/bi'

const DeleteClass = (props) => {
	const { dataRow, onRefresh, onShow } = props

	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	function toggle() {
		if (!visible && !!onShow) {
			onShow()
		}
		setVisible(!visible)
	}

	const onDelete = async () => {
		setIsLoading(true)
		try {
			const res = await classApi.deleteClass(dataRow?.Id)
			if (res.status == 200) {
				ShowNostis.success(res.data.message)
				onRefresh()
				toggle()
			}
		} catch (err) {
			ShowNostis.error(err.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<div onClick={toggle} className="pro-menu-item text-[#f51d92] the-item-pro">
				<BiTrash className="pro-trash ml-[-3px]" />
				<div className="ml-[8px] font-[500]">Xoá</div>
			</div>

			<Modal
				title="Xoá lớp"
				open={visible}
				onCancel={toggle}
				centered
				footer={<ModalFooter loading={isLoading} onCancel={toggle} onOK={onDelete} okText="Xác nhận" />}
			>
				<div className="text-center">
					Xoá lớp <div className="inline font-[500] text-primary">{dataRow?.Name}</div>
				</div>
			</Modal>
		</>
	)
}

export default DeleteClass
