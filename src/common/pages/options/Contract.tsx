import { Card, Popover, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { MdSave } from 'react-icons/md'
import { contractApi } from '~/api/contract'
import EditorField from '~/common/components/FormControl/EditorField'
// import TitlePage from '~/src/components/TitlePage'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

const Contract = () => {
	const [contract, setContract] = useState(null)
	const [contractContent, setContractContent] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	// const { showNoti } = useWrap()

	const codeEditorList = [
		{ label: '{khoahoc}', desc: ' Lớp học' },
		{ label: '{chuongtrinh}', desc: ' Chương trình' },
		{ label: '{batdau}', desc: ' Thời gian bắt đầu' },
		{ label: '{ketthuc}', desc: ' Thời gian kết thúc' },
		{ label: '{hinhthucthanhtoan}', desc: 'Hình thức thanh toán' },
		{ label: '{hovaten}', desc: ' Họ và tên' },
		{ label: '{sodienthoai}', desc: ' Số điện thoại' },
		{ label: '{email}', desc: 'Email khách hàng' },
		{ label: '{cmnd}', desc: ' CMND' },
		{ label: '{ngaycap}', desc: ' Ngày cấp' },
		{ label: '{noicap}', desc: ' Nơi cấp' },
		{ label: '{diachi}', desc: ' Địa chỉ' },
		{ label: '{lydo}', desc: ' Lý do xuất phiếu' },
		{ label: '{dachi}', desc: ' Số tiền chi ra' },
		{ label: '{dathu}', desc: ' Số tiền thu vào' },
		{ label: '{nguoinhanphieu}', desc: ' Người nhận phiếu ký tên' },
		{ label: '{nhanvienxuat}', desc: ' Nhân viên xuất phiếu ký tên' },
		{ label: '{ngay}', desc: ' Ngày' },
		{ label: '{thang}', desc: ' Tháng' },
		{ label: '{nam}', desc: ' Năm' }
	]

	const fetchContract = async () => {
		setIsLoading(true)
		try {
			let res = await contractApi.getAll({})
			if (res.status === 200) {
				if (typeof res.data.data === 'object' && res.data.data !== null) {
					setContract(res.data.data)
				}
			} else if (res.status === 204) {
				// showNoti('danger', 'Không tìm thấy')
				setContract({})
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchContract()
	}, [])

	const changeContractContent = (value) => {
		setContractContent(value)
	}
	const updateContract = async () => {
		if (!contractContent) {
			ShowNoti('error', 'Bạn chưa sưa đổi')
			return
		}
		setIsLoading(true)
		try {
			let res = await contractApi.update({
				...contract,
				ContractContent: contractContent
			})
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setContractContent('')
			setIsLoading(false)
		}
	}

	return (
		<div className="row">
			{/* <TitlePage title="Hợp đồng" /> */}
			<div className="col-12">
				<Card
					className={`${isLoading ? 'custom-loading' : ''}`}
					style={{ position: 'relative' }}
					extra={
						<Popover
							placement="bottomRight"
							content={
								<div className="invoice-editor-list">
									{codeEditorList.map((c, idx) => (
										<Tooltip title="Nhấn để sao chép" placement="left" className="invoice-editor-item">
											<p
												key={idx}
												onClick={() => {
													navigator.clipboard.writeText(c.label)
													ShowNoti('success', 'Sao chép thành công')
												}}
											>
												<span>{c.label}:</span>
												{`${c.desc}`}
											</p>
										</Tooltip>
									))}
								</div>
							}
						>
							<a className="btn-code-editor" style={{ position: 'relative' }} type="primary">
								Mã hướng dẫn
							</a>
						</Popover>
					}
				>
					{/* <EditorBase content={contract?.ContractContent} handleChangeDataEditor={changeContractContent} /> */}
					<EditorField name="ContractContent" onChangeEditor={changeContractContent} />
					<div className="pt-3 d-flex justify-content-center">
						<div style={{ paddingRight: 5 }}>
							<button type="submit" className="btn btn-primary" disabled={isLoading} onClick={updateContract}>
								<MdSave size={18} className="mr-2" />
								Xác nhận
								{isLoading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
					<Spin className="custom-loading-icon" size="large" />
				</Card>
			</div>
		</div>
	)
}

export default Contract
