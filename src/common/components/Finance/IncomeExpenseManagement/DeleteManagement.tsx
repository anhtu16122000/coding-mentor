import { Modal } from 'antd'
import React, { FC, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'

import { IoClose } from 'react-icons/io5'
import PrimaryButton from '../../Primary/Button'

interface IDeleteManagement {
	onRefresh?: Function
	defaultData?: any
}

const DeleteManagement: FC<IDeleteManagement> = ({ onRefresh, defaultData }) => {
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	console.log('defaultData', defaultData)
	async function handleDelete() {
		setLoading(true)
		try {
			const response = await RestApi.delete('/PaymentSession', defaultData?.Id)
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
		setLoading(false)
	}

	return (
		<>
			<PrimaryTooltip id={`pay-${defaultData?.Code}`} place="left" content="Xóa">
				<div onClick={() => setVisible(true)} className="text-[#C94A4F] all-center hover:opacity-70 cursor-pointer">
					<IoClose size={26} />
				</div>
			</PrimaryTooltip>

			<Modal
				width={500}
				title={'Xóa phiếu thu chi'}
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<PrimaryButton loading={loading} onClick={handleDelete} background="red" icon="remove" type="button">
						Xóa
					</PrimaryButton>
				}
			>
				<p>
					Bạn có muốn xóa phiếu thu chi của học viên: <span className="text-[red] font-[700]">{defaultData?.FullName || ''}</span>
				</p>
			</Modal>
		</>
	)
}

export default DeleteManagement
