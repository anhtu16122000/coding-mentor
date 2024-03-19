import { Modal } from 'antd'
import { useEffect, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'
import { MdAdd } from 'react-icons/md'
import { billApi } from '~/api/business/bill'
import { parseToMoney } from '~/common/utils/common'
import PrimaryButton from '../Primary/Button'
import PrimaryTooltip from '../PrimaryTooltip'

const ModalTuitionOption = (props) => {
	const { onSubmit, curTuition, totalPrice, discount } = props

	const { studentId } = props

	const [visible, setVisible] = useState(false)
	const [data, setData] = useState([])

	useEffect(() => {
		if (studentId) {
			getTuitions()
		}
	}, [studentId])

	async function getTuitions() {
		try {
			const res = await billApi.getTuitionOption({ studentId: studentId })
			if (res.status == 200) {
				setData(res.data?.data)
			} else {
				setData([])
			}
		} catch (error) {}
	}

	function getRealPrice() {
		// Code: '3THANGGIAM500'
		// Description: 'Đóng 3 tháng giảm ngay 500k học phí'
		// Discount: 50000
		// DiscountType: 1
		// DiscountTypeName: 'Giảm theo số tiền'
		// Id: 1
		// Months: 3

		let thatPrice = curTuition?.Discount

		return thatPrice > 0 ? thatPrice : 0
	}

	return (
		<>
			{!!data && data.length > 0 && totalPrice > 0 && (
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-1">
						<span className="title">Gói học phí</span>

						<PrimaryTooltip place="right" id="rev-09-07-66" content="Chọn gói học phí">
							<button type="button" onClick={() => setVisible(true)} className="text-tw-primary !mt-[-4px]">
								<AiOutlinePlusCircle size={18} />
							</button>
						</PrimaryTooltip>
					</div>

					{curTuition?.Months && <span className="title text-tw-primary">{curTuition?.Months} tháng</span>}

					{curTuition?.Months && (
						<span className="title text-tw-primary">
							Giảm: {parseToMoney(!curTuition ? 0 : getRealPrice())}
							{curTuition?.DiscountType == 2 && '%'}
						</span>
					)}
				</div>
			)}

			<Modal
				title="Danh sách tiền bảo lưu"
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<PrimaryButton type="button" icon="cancel" background="red" onClick={() => setVisible(false)}>
						Đóng
					</PrimaryButton>
				}
			>
				<div className="gap-[8px] flex flex-col">
					{data.map((item, index) => {
						return (
							<div
								key={`tuition-${studentId}-${item?.Id}`}
								className="p-[16px] flex items-center bg-[#f3f3f3] hover:bg-[#ededed] rounded-[8px]"
							>
								<div className="flex-1">
									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Mã:</div>
										<div>{item?.Code}</div>
									</div>

									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Số tháng:</div>
										<div>{parseToMoney(item?.Months)}</div>
									</div>

									<div className="flex font-[600] items-center text-[#D21320] text-[14px]">
										<div className="mr-[4px]">Số tiền giảm:</div>
										<div>
											{parseToMoney(item?.Discount)}
											{item?.DiscountType == 2 && '%'}
										</div>
									</div>

									{item?.Description && (
										<div className="flex items-center">
											<div>{item?.Description}</div>
										</div>
									)}

									{curTuition?.Id != item.Id && (
										<div className="ml-[-1px] mt-[4px] flex items-center">
											{item?.DiscountType == 1 && <div className="tag blue">{item?.DiscountTypeName}</div>}
											{item?.DiscountType == 2 && <div className="tag yellow">{item?.DiscountTypeName}</div>}
										</div>
									)}

									{curTuition?.Id == item.Id && (
										<div className="ml-[-1px] mt-[4px]">
											<div className="tag green">Đang sử dụng</div>
										</div>
									)}
								</div>

								{curTuition?.Id != item.Id && (
									<PrimaryTooltip id={`add-${studentId}-${item?.Id}`} content="Sử dụng" place="left">
										<div
											onClick={() => {
												onSubmit(item)
												setVisible(false)
											}}
											className="hover:bg-[#e6e6e6] cursor-pointer p-[8px] rounded-[8px]"
										>
											<MdAdd size={28} />
										</div>
									</PrimaryTooltip>
								)}

								{curTuition?.Id == item.Id && (
									<PrimaryTooltip id={`rm-${studentId}-${item?.Id}`} content="Bỏ chọn" place="left">
										<div onClick={() => onSubmit(null)} className="hover:bg-[#e6e6e6] cursor-pointer p-[8px] rounded-[8px]">
											<IoClose size={28} color="red" />
										</div>
									</PrimaryTooltip>
								)}
							</div>
						)
					})}
				</div>
			</Modal>
		</>
	)
}

export default ModalTuitionOption
