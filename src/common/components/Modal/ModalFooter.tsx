import { Button } from 'antd'
import React, { MouseEventHandler } from 'react'
import { AiOutlineCloseCircle, AiOutlineSave } from 'react-icons/ai'

interface IProps {
	buttonFull?: boolean
	loading: boolean
	onCancel: MouseEventHandler<HTMLElement>
	onOK: MouseEventHandler<HTMLElement>
	isEdit?: boolean
}

const ModalFooter = (props: IProps) => {
	const { buttonFull = false, loading, onCancel, onOK, isEdit = false } = props

	return (
		<div className="flex items-center gap-1">
			<Button className={`${buttonFull && 'flex-1'}`} style={{ background: '#ff595e' }} onClick={onCancel}>
				<AiOutlineCloseCircle className="text-[18px] mr-2" /> Huỷ
			</Button>
			<Button className={buttonFull ? 'flex-1' : ''} onClick={onOK} style={{ background: '#0a89ff' }} loading={loading}>
				<AiOutlineSave className="text-[18px] mr-2" /> {isEdit ? 'Chỉnh sửa' : 'Lưu'}
			</Button>
		</div>
	)
}

export default ModalFooter
