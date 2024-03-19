import React, { useEffect, useRef, useState } from 'react'
import { Card, List, Modal, Popover, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { nanoid } from 'nanoid'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '~/common/components/Primary/Button'
import { AiOutlineEye } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi'
import ModalViewCertificateExam from './UpdateCertificate/ModalViewCetificateExam'
import Lottie from 'react-lottie-player'
import deleteJson from '~/common/components/json/15120-delete.json'
import { certificateConfigApi } from '~/api/certificate/certificate-config'
import { is } from '~/common/utils/common'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { BiTrash } from 'react-icons/bi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import ModalFooter from '~/common/components/ModalFooter'

const CertificatePage = () => {
	const router = useRouter()

	const [queryPage, setQueryPage] = useState({ pageSize: 10, pageIndex: 1 })
	const [isLoading, setIsLoading] = useState(false)
	const [totalRow, setTotalRow] = useState(0)
	const [data, setData] = useState([])

	useEffect(() => {
		getAllCertificate()
	}, [queryPage])

	const getAllCertificate = async () => {
		setIsLoading(true)
		try {
			const res = await certificateConfigApi.getAll(queryPage)

			if (res.status == 200) {
				const { data, totalRow } = res.data
				setTotalRow(totalRow)
				setData(data)
			} else {
				setTotalRow(0)
				setData([])
			}
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)

			ShowNoti('error', err.message)
		}
	}

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		setQueryPage({ ...queryPage, pageIndex: pageNumber })
	}

	const deleteCertificateById = async (Id) => {
		try {
			const res = await certificateConfigApi.deleteById(Id)
			if (res.status == 200) {
				getAllCertificate()
				ShowNoti('success', 'Xóa thành công!')
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	return (
		<div className="antd-custom-wrap">
			<Card
				title={
					<div className=" w-full d-flex justify-between items-center">
						<div>Danh sách chứng chỉ</div>
						<PrimaryButton
							background="green"
							type="button"
							icon="add"
							onClick={() => router.push({ pathname: '/configs/certificates/detail' })}
						>
							Thêm mẫu
						</PrimaryButton>
					</div>
				}
			>
				{isLoading ? (
					<Skeleton />
				) : (
					<List
						itemLayout="horizontal"
						dataSource={data}
						grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
						renderItem={(item) => (
							<List.Item>
								<CertificateItem
									key={item.Id}
									Id={item.Id}
									name={item.Name}
									background={item.Background}
									content={item.Content}
									backside={item.Backside}
									deleteCertificateById={deleteCertificateById}
								/>
							</List.Item>
						)}
						pagination={{
							onChange: getPagination,
							total: totalRow,
							pageSize: queryPage.pageSize,
							size: 'small',
							defaultCurrent: queryPage.pageIndex,
							showTotal: () => (
								<p className="font-weight-black" style={{ marginTop: 2, color: '#000' }}>
									Tổng cộng: {totalRow ? totalRow : 0}
								</p>
							)
						}}
					/>
				)}
			</Card>
		</div>
	)
}

export default CertificatePage

const CertificateItem = ({ Id, name, background, backside, content, deleteCertificateById }) => {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [visible, setVisible] = useState(false)

	const userInfo = useSelector((state: RootState) => state.user.information)

	const popRef = useRef(null)

	return (
		<>
			<div className="border-[1px] relative border-[#c7c7c7] hover:border-[#D21320] rounded-[8px]">
				<img
					className="rounded-[7px]"
					onClick={() => router.push({ pathname: '/configs/certificates/detail', query: { slug: Id, key: nanoid() } })}
					alt={name}
					src={background?.length > 0 ? background : '/images/new-bg.png'}
				/>

				{is(userInfo).admin && (
					<Popover
						ref={popRef}
						overlayClassName="show-arrow"
						content={
							<div>
								<div
									onClick={() => {
										popRef.current.close()
										setVisible(true)
									}}
									className="pe-menu-item"
								>
									<BiTrash size={20} color="#E53935" className="ml-[-3px]" />
									<div className="ml-[8px]">Xoá</div>
								</div>

								<div
									className="pe-menu-item"
									onClick={() => {
										popRef.current.close()
										setOpen(true)
									}}
								>
									<AiOutlineEye size="18" color="#4CAF50" />
									<div className="ml-[8px]">Xem trước</div>
								</div>

								<div
									className="pe-menu-item"
									onClick={() => {
										popRef.current.close()
										router.push({ pathname: '/configs/certificates/detail', query: { slug: Id } })
									}}
								>
									<FiEdit size="18" color="#D21320" />
									<div className="ml-[8px]">Cập nhật</div>
								</div>
							</div>
						}
						placement="leftTop"
						trigger="click"
					>
						<div className="pe-i-d-menu">
							<BsThreeDotsVertical size={16} color="#000" />
						</div>
					</Popover>
				)}
			</div>

			<ModalViewCertificateExam open={open} setOpen={setOpen} background={background} content={content} backside={backside} />

			<Modal
				title="Xóa mẫu chứng nhận"
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<ModalFooter
						onCancel={() => setVisible(false)}
						onOK={async () => {
							await deleteCertificateById(Id)
							setVisible(false)
						}}
						okText="Xác nhận"
					/>
				}
			>
				<div className="grid-cols-1 flex flex-col items-center justify-center">
					<Lottie loop animationData={deleteJson} play className="w-[120px] mt-[-10px]" />
					<p className="text-center text-[16px] mt-3 mb-4">
						Bạn có chắc muốn xóa mẫu chứng nhận <span className="text-[red]">{name}</span>
					</p>
				</div>
			</Modal>
		</>
	)
}
