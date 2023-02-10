import { Card, Empty, Popover, Skeleton, Spin, Upload, UploadProps } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { curriculumDetailApi } from '~/api/curriculum-detail'
import { ShowNoti } from '~/common/utils'
import { FiMoreHorizontal } from 'react-icons/fi'
import { CgCloseO } from 'react-icons/cg'
import { getFileThumbnails } from '~/common/utils/main-function'
import Lottie from 'react-lottie-player'
import axios from 'axios'
import fileDownload from 'js-file-download'
import { ContextMenu } from 'primereact/contextmenu'
import { RiDownload2Fill } from 'react-icons/ri'

import loadingJson from '~/common/components/json/31696-file-upload.json'
import PrimaryButton from '../Primary/Button'
import ContextItem from './ContextItem'

const { Dragger } = Upload

const DEFAULT_FILTER = { curriculumDetailId: '' }

const Lessons = ({ curriculumId, activatedUnit, setActivatedUnit }) => {
	const cm = useRef(null)

	const [lessonActivated, setLessonActivated] = useState({ Id: '', FileUrl: '', FileName: '', FileType: '' })
	const [showPop, setShowPop] = useState('')
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [filters, setFilters] = useState(DEFAULT_FILTER)
	const [timeStamp, setTimeStamp] = useState(0)
	const [downLoading, setDownLoading] = useState(false)
	console.log('lessonActivated: ', lessonActivated)
	const items = [
		{
			template: (item, options) => {
				return <ContextItem onClick={() => _delete(lessonActivated?.Id)} Icon={<CgCloseO size={20} className="mr-2" />} title="Xoá" />
			}
		},
		{
			template: (item, options) => {
				return (
					<ContextItem
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
			const response = await curriculumDetailApi.deleteFile(id)
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
			setFilters({ ...filters, curriculumDetailId: activatedUnit?.Id })
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
				const response = await curriculumDetailApi.getFile(filters.curriculumDetailId)
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

	async function uploadFile(params) {
		if (!!activatedUnit?.Id) {
			try {
				const formData = new FormData()
				formData.append('file', params)
				const response = await curriculumDetailApi.addFile(activatedUnit?.Id, formData)
				if (response.status == 200) {
					getData()
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	const props: UploadProps = {
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

	const handleClick = async (url, filename) => {
		console.log('url: ', url, filename)
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
						{!!activatedUnit?.Id && (
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
																<ContextItem onClick={() => _delete(item?.Id)} Icon={<CgCloseO size={20} className="mr-2" />} title="Xoá" />
																<hr className="border-[#00000014] my-1" />
																<ContextItem
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

export default Lessons
