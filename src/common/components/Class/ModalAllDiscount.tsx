import { List, Modal, Tooltip } from 'antd'
import React, { useMemo, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import AvatarComponent from '../AvatarComponent'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const ModalAllDiscount = (props) => {
	const { classesSelected, programsSelected, form, setDetailDiscount, detailDiscount } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const discount = useSelector((state: RootState) => state.discount.Discount)

	// Tính tổng lớp + chương trình đã chọn
	const totalSelected = useMemo(() => {
		return classesSelected.length + programsSelected.length
	}, [classesSelected, programsSelected])

	const disabledButtonApply = (data) => {
		if (data.UsedQuantity < data.Quantity) {
			if (data.PackageType === 2) {
				if (totalSelected > 1) {
					return false
				} else {
					return true
				}
			} else {
				if (totalSelected > 1) {
					return true
				} else {
					return false
				}
			}
		} else {
			return true
		}
	}

	const createNoteButtonApply = (data) => {
		if (data.UsedQuantity < data.Quantity) {
			if (data.PackageType === 2) {
				if (totalSelected > 1) {
					return 'Áp dụng'
				} else {
					return 'Chỉ áp dụng khi giỏ hàng có từ 2 sản phẩm trở lên'
				}
			} else {
				if (totalSelected > 1) {
					return 'Chỉ áp dụng khi giỏ hàng có 1 sản phẩm'
				} else {
					return 'Áp dụng'
				}
			}
		} else {
			return 'Mã khuyến mãi không khả dụng'
		}
	}

	const handleAddDiscount = (data) => {
		setDetailDiscount(data)
		form.setFieldsValue({ DiscountId: data.Id })
		setIsModalOpen(false)
		ShowNoti('success', 'Áp dụng thành công')
	}
	return (
		<div>
			<Tooltip title="Xem mã giảm giá">
				<button type="button" onClick={() => setIsModalOpen(true)} className="text-tw-primary">
					<AiOutlinePlusCircle size={18} />
				</button>
			</Tooltip>
			<Modal
				title="Danh sách mã khuyến mãi"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={
					<>
						<PrimaryButton type="button" icon="cancel" background="blue" onClick={() => setIsModalOpen(false)}>
							Đóng
						</PrimaryButton>
					</>
				}
			>
				<List
					className="modal-review-class-program"
					itemLayout="horizontal"
					dataSource={discount}
					renderItem={(item) => (
						<List.Item
							extra={
								<div className="flex items-center">
									{!!detailDiscount && item?.Id === detailDiscount?.Id ? (
										<IconButton
											icon="remove"
											color={'red'}
											type="button"
											tooltip={'Xóa'}
											onClick={() => {
												setDetailDiscount(null)
											}}
										/>
									) : null}
									<IconButton
										disabled={(!!detailDiscount && item?.Id === detailDiscount?.Id) || disabledButtonApply(item)}
										icon="add"
										color={(!!detailDiscount && item?.Id === detailDiscount?.Id) || disabledButtonApply(item) ? 'disabled' : 'blue'}
										type="button"
										tooltip={createNoteButtonApply(item)}
										onClick={() => handleAddDiscount(item)}
									/>
								</div>
							}
						>
							<div className="wrapper-item-class">
								<div className="flex items-center justify-center flex-col mr-3">
									{!!detailDiscount && item.Id === detailDiscount?.Id ? (
										<span className={`tag blue`} style={{ marginBottom: 8, textAlign: 'center' }}>
											Áp dụng
										</span>
									) : null}

									<AvatarComponent className="img-discount" url={'/images/sale.png'} type="default" />
								</div>
								<div className="wrapper-info-class">
									<p>
										<span className="title">Mã:</span>
										<span className="font-normal ml-1">{item?.Code}</span>
									</p>
									<p>
										<span className="title">Gói:</span>
										<span className="font-normal ml-1">{item?.PackageTypeName}</span>
									</p>
									<p>
										<span className="title">Loại:</span>
										<span className="font-normal ml-1">{item?.TypeName}</span>
									</p>
									{item.Type === 2 ? (
										<>
											<p>
												<span className="title">Giảm:</span>
												<span className="font-normal ml-1">{item?.Value}%</span>
											</p>
											<p>
												<span className="title">Tối đa:</span>
												<span className="font-normal ml-1">{Intl.NumberFormat('ja-JP').format(item?.MaxDiscount)}</span>
											</p>
										</>
									) : (
										<p>
											<span className="title">Giảm:</span>
											<span className="font-normal ml-1">{Intl.NumberFormat('ja-JP').format(item?.Value)}</span>
										</p>
									)}
								</div>
							</div>
						</List.Item>
					)}
				/>
			</Modal>
		</div>
	)
}

export default ModalAllDiscount
