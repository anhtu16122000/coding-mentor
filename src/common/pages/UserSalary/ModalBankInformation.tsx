import { Modal } from 'antd'
import React, { useState } from 'react'
import { RiBankCard2Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { PrimaryTooltip } from '~/common/components'
import { is } from '~/common/utils/common'
import { RootState } from '~/store'

const ModalBankInformation = (props) => {
	const { item } = props

	const [visible, setVisible] = useState<boolean>(false)

	function toggle() {
		setVisible(!visible)
	}

	const userInfo = useSelector((state: RootState) => state.user.information)

	return (
		<>
			{(is(userInfo).admin || is(userInfo).accountant) && (
				<PrimaryTooltip place="left" content="Thông tin ngân hàng" id={`BANK-${item?.Id}`}>
					<div onClick={toggle} className="text-[#0A89FF] cursor-pointer hover:text-[#157ddd] active:text-[#1576cf] mr-[8px]">
						<RiBankCard2Line size={22} />
					</div>
				</PrimaryTooltip>
			)}

			<Modal open={visible} title="Thông tin ngân hàng" footer={null} onCancel={toggle}>
				{is(userInfo).admin && (
					<div className="">
						<div className="flex items-center">
							<div>Ngân hàng:</div>
							<div className="font-[600] ml-[4px]">{item?.BankName || 'Chưa có thông tin'}</div>
						</div>

						<div className="flex items-center mt-[8px]">
							<div>Chi nhánh:</div>
							<div className="font-[600] ml-[4px]">{item?.BankBranch || 'Chưa có thông tin'}</div>
						</div>

						<div className="flex items-center mt-[8px]">
							<div>Số tài khoản:</div>
							<div className="font-[600] ml-[4px]">{item?.BankAccountNumber || 'Chưa có thông tin'}</div>
						</div>

						<div className="flex items-center mt-[8px]">
							<div>Tên người nhận:</div>
							<div className="font-[600] ml-[4px]">{item?.BankAccountName || 'Chưa có thông tin'}</div>
						</div>
					</div>
				)}
			</Modal>
		</>
	)
}

export default ModalBankInformation
