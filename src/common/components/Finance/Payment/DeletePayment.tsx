import { Modal } from 'antd'
import React, { FC, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'

import { IoClose } from 'react-icons/io5'
import PrimaryButton from '../../Primary/Button'

interface IDeletePayment {
	onRefresh?: Function
	defaultData?: any
}

const DeletePayment: FC<IDeletePayment> = ({ onRefresh, defaultData }) => {
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	async function deletePayment() {
		setLoading(true)
		try {
			const response = await RestApi.delete('/Bill', defaultData?.Id)
			if (response.status == 200) {
				!!onRefresh && onRefresh()
				setVisible(false)
				ShowNostis.success('Thành công')
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
		setLoading(false)
	}

	return (
		<>
			<PrimaryTooltip id={`pay-${defaultData?.Code}`} place="left" content="Xóa">
				<div onClick={() => setVisible(true)} className="ml-[16px] mb-[-1px] text-[#C94A4F] all-center hover:opacity-70 cursor-pointer">
					<IoClose size={26} />
				</div>
			</PrimaryTooltip>

			<Modal
				width={500}
				title={'Xóa thanh toán'}
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<PrimaryButton
						// className={`${buttonFull ? 'flex-1' : ''}`}
						loading={loading}
						onClick={deletePayment}
						background="red"
						icon="remove"
						type="button"
					>
						Xóa
					</PrimaryButton>
				}
			>
				<p>
					Bạn có muốn xóa mã: <span className="text-[red] font-[700]">{defaultData?.Code || ''}</span>
				</p>
			</Modal>
		</>
	)
}

export default DeletePayment
