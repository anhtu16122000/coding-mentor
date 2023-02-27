import { Card, Empty, Popover, Skeleton, Spin, Upload, UploadProps } from 'antd'
import axios from 'axios'
import fileDownload from 'js-file-download'
import { ContextMenu } from 'primereact/contextmenu'
import { useEffect, useRef, useState } from 'react'
import { CgCloseO } from 'react-icons/cg'
import { FiMoreHorizontal } from 'react-icons/fi'
import { RiDownload2Fill } from 'react-icons/ri'
import Lottie from 'react-lottie-player'
import { ShowNoti } from '~/common/utils'
import { getFileThumbnails } from '~/common/utils/main-function'

import { documentLibraryApi } from '~/api/document-library'
import loadingJson from '~/common/components/json/31696-file-upload.json'
import PrimaryButton from '../Primary/Button'
import LibraryContextItem from './LibraryContextItem'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const { Dragger } = Upload

const DEFAULT_FILTER = { directoryId: '', pageIndex: 1, pageSize: 9999 }

const LibraryLessons = ({ curriculumId, activatedUnit, setActivatedUnit }) => {
	const cm = useRef(null)
	const userInformation = useSelector((state: RootState) => state.user.information)

	const [lessonActivated, setLessonActivated] = useState({ Id: '', FileUrl: '', FileName: '', FileType: '' })
	const [showPop, setShowPop] = useState('')
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [filters, setFilters] = useState(DEFAULT_FILTER)
	const [timeStamp, setTimeStamp] = useState(0)
	const [downLoading, setDownLoading] = useState(false)
	const items = [
		{
			template: (item, options) => {
				return (
					<LibraryContextItem onClick={() => _delete(lessonActivated?.Id)} Icon={<CgCloseO size={20} className="mr-2" />} title="Xoá" />
				)
			}
		},
		{
			template: (item, options) => {
				return (
					<LibraryContextItem
						onClick={() => {
							if (lessonActivated?.FileUrl) {
								handleClick(lessonActivated?.FileUrl, formatFileName(lessonActivated?.FileName) + '.' + lessonActivated?.FileType)
							} else {
								ShowNoti('error', 'Không tìm thấy link file')
							}
						}}
						Icon={
							downLoading ? (
								<div className="mr-2 inline-flex">
									<Spin className="loading-black" />
								</div>
							) : (
								<RiDownload2Fill size={20} className="mr-2" />
							)
						}
						title="Tải xuống"
					/>
				)
			}
		}
	]

	async function _delete(id) {
		setLoading(true)
		try {
			console.log('ID: ', id)
			const response = await documentLibraryApi.delete(id)
			if (response.status === 200) {
				getData()
				cm.current.hide()
				ShowNoti('success', response.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (activatedUnit) {
			setData([])
			setLessonActivated({ Id: '', FileUrl: '', FileName: '', FileType: '' })
			setFilters({ ...filters, directoryId: activatedUnit?.Id })
		}
	}, [activatedUnit])

	useEffect(() => {
		if (filters !== DEFAULT_FILTER) {
			getData()
		}
	}, [filters])

	async function getData() {
		if (!!activatedUnit?.Id) {
			setLoading(true)
			try {
				const response = await documentLibraryApi.getAll(filters)
				if (response.status === 200) {
					setData(response.data.data)
				} else {
					setData([])
				}
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setLoading(false)
			}
		}
	}

	// ----------------------------------------------------------------

	async function addFile(data) {
		if (!!activatedUnit?.Id) {
			try {
				const response = await documentLibraryApi.add({ DirectoryId: activatedUnit.Id, FileUrl: data })
				if (response.status == 200) {
					getData()
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	async function uploadFile(params) {
		if (!!activatedUnit?.Id) {
			try {
				const formData = new FormData()
				formData.append('file', params)
				const response = await documentLibraryApi.addFile(formData)
				if (response.status == 200) {
					addFile(response.data.data)
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	const props: UploadProps =
		isAdmin() || isTeacher() || isManager() || isAcademic()
			? {
					name: 'file',
					multiple: true,
					customRequest: (event) => uploadFile(event.file),
					onChange(info) {
						data.push({ fileName: info.file.name, isUploading: true })
						setTimeStamp(new Date().getTime())
						setData(data)
					},
					showUploadList: false
			  }
			: { showUploadList: false }

	const handleClick = async (url, filename) => {
		setDownLoading(true)
		await axios.get(url, { responseType: 'blob' }).then((res) => {
			fileDownload(res.data, filename)
		})
		setDownLoading(false)
	}

	function formatFileName(fileName) {
		const res = fileName.replace('.png', '').replace('.jpg', '').replace('.jpeg', '').replace('.pdf', '').replace('.png', '')
		const ress = res.replace('.webp', '').replace('.mp4', '').replace('.avi', '').replace('.pptx', '').replace('.ppt', '')
		const resss = ress.replace('.docs', '').replace('.doc', '').replace('.xls', '').replace('.xlsx', '').replace('.mp3', '')
		return resss.replace('.zip', '').replace('.rar', '').replace('.json', '').replace('.xml', '')
	}

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	return (
		<div className="relative">
			<ContextMenu model={items} ref={cm} />
			{data.length !== 0 && loading && (
				<div className="absolute top-0 left-0 all-center w-full h-full bg-[#0000000c] mb-4 z-[99999] rounded-[6px]">
					<Spin className="loading-blue" />
				</div>
			)}
			<Card
				className="shadow-sm h-full mb-[-10px]"
				extra={
					<div className="flex">
						{!!lessonActivated?.FileUrl && (
							<PrimaryButton
								background="blue"
								type="button"
								icon="download"
								loading={downLoading}
								className="mr-3"
								onClick={() => {
									if (lessonActivated?.FileUrl) {
										handleClick(lessonActivated?.FileUrl, formatFileName(lessonActivated?.FileName) + '.' + lessonActivated?.FileType)
									} else {
										ShowNoti('error', 'Không tìm thấy link file')
									}
								}}
							>
								Tải xuống
							</PrimaryButton>
						)}
						{(isAdmin() || isManager() || isTeacher() || isAcademic()) && !!activatedUnit?.Id && (
							<Upload {...props}>
								<PrimaryButton type="button" icon="upload" background="green">
									Thêm
								</PrimaryButton>
							</Upload>
						)}
					</div>
				}
				title={
					<div className="curriculum-detail-less-card-title">
						<div className="flex-1 in-1-line mb-2 w550:mb-0">Danh sách tài liệu</div>
					</div>
				}
			>
				<Dragger
					disabled={!activatedUnit?.Id}
					key={`draggable-${activatedUnit?.Id}`}
					id={`id-draggable-${activatedUnit?.Id}`}
					{...props}
					openFileDialogOnClick={false}
					className="scrollable min-h-[calc(100vh-400px)] w1250:max-h-[calc(100vh-400px)] mr-[-22px] pr-[12px] z-[999]"
				>
					<>
						{data.length !== 0 && (
							<div className="curriculum-detail-lessons pb-3">
								{data.map((item, index) => {
									return (
										<div
											key={`ischau-curriculum-detail-${index}`}
											onClick={() => setLessonActivated(item)}
											onContextMenu={(e) => {
												setLessonActivated(item)
												cm.current.show(e)
											}}
											className={`curriculum-detail-docs-lesson-item ${lessonActivated?.Id == item?.Id && 'lesson-activated'}`}
										>
											<div className="lesson-item-thumb">
												{!item?.isUploading && getFileThumbnails(item?.FileType, item?.FileUrl)}
												{!!item?.isUploading && (
													<div className="w-full h-full col-center">
														<Lottie loop animationData={loadingJson} play className="inner h-[120px] mx-auto" />
														<div className="font-[500] text-primary">Đang tải lên</div>
													</div>
												)}
											</div>

											<div className="lesson-item-footer">
												<div className="docs-file-name">{item?.FileName}</div>
											</div>

											<div className="lesson-menu">
												<Popover
													trigger="click"
													open={showPop == item?.Id}
													onOpenChange={(event) => setShowPop(event ? item?.Id : '')}
													placement="right"
													content={() => {
														return (
															<>
																{(isAdmin() || isManager() || isTeacher() || isAcademic()) && (
																	<>
																		<LibraryContextItem
																			onClick={() => _delete(item?.Id)}
																			Icon={<CgCloseO size={20} className="mr-2" />}
																			title="Xoá"
																		/>
																		<hr className="border-[#00000014] my-1" />
																	</>
																)}
																<LibraryContextItem
																	onClick={() => {
																		if (item?.FileUrl) {
																			handleClick(item?.FileUrl, formatFileName(item?.FileName) + '.' + item?.FileType)
																		} else {
																			ShowNoti('error', 'Không tìm thấy link file')
																		}
																	}}
																	Icon={
																		downLoading ? (
																			<div className="mr-2 inline-flex">
																				<Spin className="loading-black" />
																			</div>
																		) : (
																			<RiDownload2Fill size={20} className="mr-2" />
																		)
																	}
																	title="Tải xuống"
																/>
															</>
														)
													}}
												>
													<FiMoreHorizontal size={18} />
												</Popover>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</>

					<>
						{data.length == 0 && !loading && (
							<div className="w-full all-center">
								<Empty />
							</div>
						)}

						{data.length == 0 && loading && (
							<div className="z-[99999] w-full">
								<Skeleton />
								<Skeleton className="mt-3" />
							</div>
						)}
					</>
				</Dragger>
				{!activatedUnit?.Id && (
					<div className="scrollable min-h-[calc(100vh-400px)] w1250:max-h-[calc(100vh-400px)] mr-[-22px] pr-[12px] z-[999]">
						{data.length == 0 && !loading && (
							<div className="w-full all-center">
								<Empty />
							</div>
						)}

						{data.length == 0 && loading && (
							<div className="z-[99999] w-full">
								<Skeleton />
								<Skeleton className="mt-3" />
							</div>
						)}
					</div>
				)}
			</Card>
		</div>
	)
}

export default LibraryLessons
