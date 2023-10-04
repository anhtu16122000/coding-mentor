import { Drawer, Empty, Popconfirm, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineCloseCircle, AiOutlineMenu } from 'react-icons/ai'
import { IoIosArrowBack } from 'react-icons/io'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { SeminarRecordApi } from '~/api/course/seminar/record'
import { SeminarApi } from '~/api/course/seminar/seminar'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import CreareYoutubeRecord from './create'

const SeminarRecord = () => {
	const router = useRouter()

	const { seminar } = useRouter().query

	const [loading, setLoading] = useState(true)
	const [records, setRecords] = useState([])

	const user = useSelector((state: RootState) => state.user.information)

	const [video, setVideo] = useState('')

	useEffect(() => {
		if (!!seminar) {
			getRecords()
			getSeminarDetails()
			// getRecordDetails()
		}
	}, [seminar])

	const [currentSeminar, setCurrentSeminar] = useState({ Thumbnail: '' })

	async function getSeminarDetails() {
		try {
			const response = await SeminarApi.getByID(router.query?.seminar)
			if (response.status === 200) {
				setCurrentSeminar(response.data.data)
			} else {
				setCurrentSeminar({ Thumbnail: '' })
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	async function getRecordDetails() {
		try {
			const response = await SeminarRecordApi.getByID(router.query?.seminar)
			if (response.status === 200) {
				setRecords(response.data.data)
			} else {
				setRecords([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	async function getRecords() {
		setLoading(true)
		try {
			const response = await SeminarRecordApi.getBySeminarID(router.query?.seminar)
			if (response.status === 200) {
				setRecords(response.data.data)
				setVideo(response.data.data[0]?.VideoUrl)
			} else {
				setRecords([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function deleteRecord(ID) {
		try {
			const response = await SeminarRecordApi.delete(ID)
			if (response.status === 200) {
				getRecords()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	const [showMenu, setShowMenu] = useState(false)

	return (
		<>
			<header className="flex justify-between align-center h-16 bg-tw-primary">
				<div className="flex justify-start align-center gap-4 px-8">
					<button className="text-[#ffffff] text-2xl" onClick={() => router.push('/webinars')}>
						{<IoIosArrowBack />}
					</button>
					<p className="m-auto in-1-line text-2xl font-bold text-white">{router?.query?.name}</p>
				</div>
				<div className="flex justify-end align-center gap-4 px-8">
					<button onClick={() => setShowMenu(true)} className={`w950:hidden text-[#ffffff] text-2xl `}>
						{false ? <AiOutlineClose /> : <AiOutlineMenu />}
					</button>
				</div>
			</header>

			<div className="grid grid-cols-12 gap-x-4">
				<div className="col-span-12 w950:col-span-9">
					<div className="w-full">
						{!loading && !!video && (
							<iframe
								className="w-full aspect-video"
								src={video}
								title="YouTube video player"
								frameBorder={0}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						)}

						{!loading && !video && (
							<div className="w-full aspect-video bg-[#fff] h-[90vh] flex items-center justify-center">
								<Empty description="Không có dữ liệu" />
							</div>
						)}

						{!!loading && (
							<div className="p-[20px]">
								<Skeleton />
								<Skeleton />
							</div>
						)}
					</div>
				</div>

				<div className="col-span-3 py-3 hidden w950:block">
					<p className="text-base my-auto font-bold">Danh sách bản ghi</p>
					<div className="pr-3">
						{records.map((item, index) => {
							return (
								<div
									key={`main-${index}-${item?.Id}`}
									onClick={() => setVideo(item?.VideoUrl)}
									className={`mt-2 px-3 w-full h-[40px] rounded-[6px] bg-[#e3e9f0] hover:!bg-[#d8dfe8] active:!bg-[#e3e9f0] cursor-pointer flex items-center justify-between ${
										item?.VideoUrl == video && 'bg-[#d5deea]'
									}`}
								>
									<div className={`flex-1 in-1-line none-selection ${item?.VideoUrl == video && 'font-[600] text-[#0077ff]'}`}>
										{item?.Name}
									</div>
									{(user?.RoleId == 1 || user?.RoleId == 2) && (
										<>
											<Popconfirm title={`Xoá bản ghi này?`} onConfirm={() => deleteRecord(item?.Id)}>
												<div onClick={(e) => e.stopPropagation()} className="text-[red] p-2">
													<AiOutlineCloseCircle size={18} className="mb-[-1px]" />
												</div>
											</Popconfirm>
											<CreareYoutubeRecord onRefresh={getRecords} defaultData={item} isEdit={true} />
										</>
									)}
								</div>
							)
						})}

						{(user?.RoleId == 1 || user?.RoleId == 2) && <CreareYoutubeRecord onRefresh={getRecords} defaultData={{}} isEdit={false} />}
					</div>
				</div>
			</div>

			<Drawer
				title={<p className="text-base mb-[-4px] font-bold">Danh sách bản ghi</p>}
				visible={showMenu}
				onClose={() => setShowMenu(false)}
			>
				<div>
					{records.map((item, index) => {
						return (
							<div
								key={`drawer-${index}-${item?.Id}`}
								onClick={() => setVideo(item?.VideoUrl)}
								className="mt-2 px-3 w-full h-[40px] rounded-[6px] bg-[#e3e9f0] hover:!bg-[#d8dfe8] active:!bg-[#e3e9f0] cursor-pointer flex items-center justify-between"
							>
								<div className={`flex-1 in-1-line none-selection ${item?.VideoUrl == video && 'font-[600] text-[#0077ff]'}`}>
									{item?.Name}
								</div>
								{(user?.RoleId == 1 || user?.RoleId == 2) && (
									<>
										<Popconfirm className="w-[200px]" title={`Xoá bản ghi này?`} onConfirm={() => deleteRecord(item?.Id)}>
											<div onClick={(e) => e.stopPropagation()} className="text-[red] p-2">
												<AiOutlineCloseCircle size={18} className="mb-[-1px]" />
											</div>
										</Popconfirm>
										<CreareYoutubeRecord onRefresh={getRecords} defaultData={item} isEdit={true} />
									</>
								)}
								{user?.RoleId != 1 && user?.RoleId != 2 && <MdOutlineKeyboardArrowRight size={16} />}
							</div>
						)
					})}
					{(user?.RoleId == 1 || user?.RoleId == 2) && <CreareYoutubeRecord onRefresh={getRecords} defaultData={{}} isEdit={false} />}
				</div>
			</Drawer>
		</>
	)
}

export default SeminarRecord
