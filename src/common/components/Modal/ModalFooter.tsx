import { Button, Popconfirm } from 'antd'
import { useRouter } from 'next/router'
import React, { MouseEventHandler, useState } from 'react'
import { AiOutlineCloseCircle, AiOutlineSave } from 'react-icons/ai'
import { VscSignOut } from 'react-icons/vsc'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'

interface IProps {
	buttonFull?: boolean
	loading: boolean
	onCancel: MouseEventHandler<HTMLElement>
	onOK: MouseEventHandler<HTMLElement>
	isEdit?: boolean
	groupId?: number | string
}

const ModalFooter = (props: IProps) => {
	const { buttonFull = false, loading, onCancel, onOK, isEdit = false, groupId } = props
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const handleConfirm = async () => {
		setIsLoading(true)
		try {
			await RestApi.delete('/NewsFeedGroup/', groupId)

			ShowNostis.success('Thành công')
			router.push('/')
		} catch (error) {
			console.log('🚀 ~ file: ModalFooter.tsx:27 ~ handleDeleteGroup ~ error', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex items-center gap-1">
			{isEdit && (
				<Popconfirm title="Bạn có chắc muốn xoá group hay không ?" onConfirm={handleConfirm}>
					<Button className={`${buttonFull && 'flex-1'}`} style={{ background: '#ff595e' }} loading={isLoading}>
						<VscSignOut className="text-[18px] mr-2" /> Xoá Nhóm
					</Button>
				</Popconfirm>
			)}
			{!isEdit && (
				<Button className={`${buttonFull && 'flex-1'}`} style={{ background: '#ff595e' }} onClick={onCancel}>
					<AiOutlineCloseCircle className="text-[18px] mr-2" /> Huỷ
				</Button>
			)}
			<Button className={buttonFull ? 'flex-1' : ''} onClick={onOK} style={{ background: '#0a89ff' }} loading={loading}>
				<AiOutlineSave className="text-[18px] mr-2" /> {isEdit ? 'Chỉnh sửa' : 'Lưu'}
			</Button>
		</div>
	)
}

export default ModalFooter
