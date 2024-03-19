import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import PrimaryButton from '../Primary/Button'
import { billApi } from '~/api/business/bill'
import { parseToMoney } from '~/common/utils/common'
import { MdAdd } from 'react-icons/md'
import PrimaryTooltip from '../PrimaryTooltip'
import { IoClose } from 'react-icons/io5'

const ModalReserve = (props) => {
	const { onSubmit, curReserve, totalPrice, discount } = props

	const { studentId } = props

	const [visible, setVisible] = useState(false)
	const [data, setData] = useState([])

	useEffect(() => {
		if (studentId) {
			getStudentReserves()
		}
	}, [studentId])

	async function getStudentReserves() {
		try {
			const res = await billApi.getStudentReserve({ studentId: studentId })
			if (res.status == 200) {
				setData(res.data?.data)
			} else {
				setData([])
			}
		} catch (error) {}
	}

	function getRealPrice() {
		let thatPrice = curReserve?.MoneyRemaining

		if (totalPrice < thatPrice) {
			thatPrice = totalPrice
		}

		if (discount && totalPrice > 0) {
			thatPrice = totalPrice - discount
		}

		return thatPrice > curReserve?.MoneyRemaining ? curReserve?.MoneyRemaining : thatPrice
	}

	return (
		<>
			{!!data && data.length > 0 && totalPrice > 0 && (
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-1">
						<span className="title">Tiền bảo lưu</span>

						<PrimaryTooltip place="right" id="rev-09-07-66" content="Sử dụng tiền bảo lưu">
							<button type="button" onClick={() => setVisible(true)} className="text-tw-primary !mt-[-4px]">
								<AiOutlinePlusCircle size={18} />
							</button>
						</PrimaryTooltip>
					</div>

					<span className="title text-tw-primary">{parseToMoney(!curReserve ? 0 : getRealPrice())}</span>
				</div>
			)}

			<Modal
				title="Danh sách tiền bảo lưu"
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<>
						<PrimaryButton type="button" icon="cancel" background="red" onClick={() => setVisible(false)}>
							Đóng
						</PrimaryButton>
					</>
				}
			>
				<div className="gap-[8px] flex flex-col">
					{data.map((item, index) => {
						return (
							<div
								key={`reserve-${studentId}-${item?.Id}`}
								className="p-[16px] flex items-center bg-[#f3f3f3] hover:bg-[#ededed] rounded-[8px]"
							>
								<div className="flex-1">
									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Lớp:</div>
										<div>{item?.ClassName}</div>
									</div>

									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Số tiền bảo lưu:</div>
										<div>{parseToMoney(item?.Price)}</div>
									</div>

									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Số tiền đã sử dụng:</div>
										<div>{parseToMoney(item?.MoneyUsed)}</div>
									</div>

									<div className="flex font-[600] items-center text-[#D21320] text-[14px]">
										<div className="mr-[4px]">Số tiền còn lại:</div>
										<div>{parseToMoney(item?.MoneyRemaining)}</div>
									</div>

									{curReserve?.Id != item.Id && (
										<div className="ml-[-1px] mt-[4px]">
											{item?.Status == 1 && <div className="tag blue">{item?.StatusName}</div>}
											{item?.Status == 2 && <div className="tag yellow">{item?.StatusName}</div>}
										</div>
									)}

									{curReserve?.Id == item.Id && (
										<div className="ml-[-1px] mt-[4px]">
											<div className="tag green">Đang sử dụng</div>
										</div>
									)}
								</div>

								{curReserve?.Id != item.Id && (
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

								{curReserve?.Id == item.Id && (
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

export default ModalReserve
