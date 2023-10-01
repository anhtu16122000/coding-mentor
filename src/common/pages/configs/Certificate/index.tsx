import React, { useEffect, useState } from 'react'
import { Card, List, Modal, Skeleton, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { nanoid } from 'nanoid'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '~/common/components/Primary/Button'
import { AiOutlineEye } from 'react-icons/ai'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import ModalViewCertificateExam from './UpdateCertificate/ModalViewCetificateExam'
import Lottie from 'react-lottie-player'
import deleteJson from '~/common/components/json/15120-delete.json'
import { certificateConfigApi } from '~/api/certificate/certificate-config'

const CertificatePage = () => {
	const router = useRouter()

	const [queryPage, setQueryPage] = useState<{ pageSize: number; pageIndex: number }>({
		pageSize: 10,
		pageIndex: 1
	})

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
								></CertificateItem>
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

	return (
		<>
			<Card
				bodyStyle={{ padding: '16px' }}
				hoverable
				cover={
					<img
						onClick={() => router.push({ pathname: '/configs/certificates/detail', query: { slug: Id, key: nanoid() } })}
						alt={name}
						src={background?.length > 0 ? background : '/images/new-bg.png'}
					/>
				}
			>
				<div>
					<div
						className="text-[18px] cursor-pointer font-[600] mb-2"
						onClick={() => router.push({ pathname: '/configs/certificates/detail', query: { slug: Id, key: nanoid() } })}
					>
						<p>{name}</p>
					</div>
					<div className="flex justify-end items-center">
						<div className="flex items-center justify-end gap-3">
							<Tooltip title="Xem trước mẫu chứng nhận">
								<button
									className="text-2xl text-tw-green btn-enter-course-video"
									onClick={() => {
										setOpen(true)
									}}
								>
									<AiOutlineEye size="24" />
								</button>
							</Tooltip>
							<Tooltip title="Cập nhật mẫu chứng nhận">
								<button
									onClick={() => router.push({ pathname: '/configs/certificates/detail', query: { slug: Id, key: nanoid() } })}
									className="text-2xl text-tw-primary btn-enter-course-video"
								>
									<FiEdit size="24" />
								</button>
							</Tooltip>
							<Tooltip title="Xóa mẫu chứng nhận">
								<button
									onClick={() => {
										setVisible(true)
									}}
									className="text-2xl text-tw-primary btn-enter-course-video"
								>
									<FiTrash2 color="#C94A4F" size="24" />
								</button>
							</Tooltip>
						</div>
					</div>
				</div>
			</Card>

			{/* <div
				contentEditable="true"
				onClick={() => router.push({ pathname: '/configs/certificate/detail', query: { slug: Id, key: nanoid() } })}
			>
				<img
					src={background?.length > 0 ? background : '/images/new-bg.png'}
					className="object-cover cursor-pointer  w-full h-56 rounded-xl rounded-br-none rounded-bl-none linear duration-400"
				/>
			</div>
			<div
				className="text-[18px] cursor-pointer font-[600] mb-2"
				onClick={() => router.push({ pathname: '/configs/certificate/detail', query: { slug: Id, key: nanoid() } })}
			>
				<p>{name}</p>
			</div> */}

			<ModalViewCertificateExam open={open} setOpen={setOpen} background={background} content={content} backside={backside} />
			<Modal
				title={'Xóa mẫu chứng nhận'}
				cancelText="Hủy bỏ"
				okText="Đồng ý"
				onOk={async () => {
					await deleteCertificateById(Id)
					setVisible(false)
				}}
				visible={visible}
				onCancel={() => setVisible(false)}
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
