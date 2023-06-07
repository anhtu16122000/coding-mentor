import { Divider, Modal } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { FaInfoCircle, FaUser, FaUserEdit, FaUserPlus } from 'react-icons/fa'
import { PrimaryTooltip } from '~/common/components'
import InfoItem from '~/common/components/InfoItem'
import { log } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'

const PaymentDetail = (props: { data: any }) => {
	const { data } = props

	const [visible, setVisible] = useState<boolean>(false)

	function toggle() {
		log.Yellow('data', data)
		setVisible(!visible)
	}

	return (
		<>
			<PrimaryTooltip id={`i-pay-${data?.Code}`} place="left" content="Thông tin">
				<div onClick={toggle} className="px-[4px] cursor-pointer text-[#F41E92] active:text-[#cf187d]">
					<FaInfoCircle size={20} />
				</div>
			</PrimaryTooltip>

			<Modal open={visible} onCancel={toggle} title={<div>Mã đơn: {data?.Code}</div>} footer={null}>
				<InfoItem title="Tổng tiền" value={parseToMoney(data?.TotalPrice)} />
				<InfoItem title="Đã thanh toán" value={parseToMoney(data?.Paid)} />
				<InfoItem title="Chưa thanh toán" value={parseToMoney(data?.Debt)} />

				<Divider className="ant-divider-16" />

				{!!data?.DiscountCode && (
					<>
						<InfoItem title="Mã giảm giá" value={data?.DiscountCode} />
						<InfoItem title="Giảm giá" value={parseToMoney(data?.Reduced)} />

						<Divider className="ant-divider-16" />
					</>
				)}

				<div className="flex items-center">
					<div className="w-[42px] h-[42px] bg-[#e1e1e1] flex items-center justify-center rounded-full shadow-sm mr-[16px]">
						<FaUser size={20} />
					</div>
					<div>
						<InfoItem title="Người thanh toán" value={data?.FullName} />
						<InfoItem title="Mã" value={data?.UserCode} />
					</div>
				</div>

				<Divider className="ant-divider-16" />

				<div className="flex items-center">
					<div className="w-[42px] h-[42px] bg-[#e1e1e1] flex items-center justify-center rounded-full shadow-sm mr-[16px]">
						<FaUserPlus size={23} />
					</div>
					<div>
						<InfoItem title="Ngưởi tạo" value={data?.CreatedBy} />
						<InfoItem title="Ngày tạo" value={moment(data?.CreatedOn).format('HH:mm DD/MM/YYYY')} />
					</div>
				</div>

				<Divider className="ant-divider-16" />

				<div className="flex items-center">
					<div className="w-[42px] h-[42px] bg-[#e1e1e1] flex items-center justify-center rounded-full shadow-sm mr-[16px]">
						<FaUserEdit size={23} />
					</div>
					<div>
						<InfoItem title="Cập nhật gần nhất" value={data?.ModifiedBy} />
						<InfoItem title="Thời gian" value={moment(data?.ModifiedOn).format('HH:mm DD/MM/YYYY')} />
					</div>
				</div>
			</Modal>
		</>
	)
}

export default PaymentDetail
