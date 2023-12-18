import { Empty, Modal, Popconfirm, Popover, Skeleton, Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { BiTrash } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { is } from '~/common/utils/common'
import { RootState } from '~/store'
import FormPackageSection from './FormModal'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { packageSkillApi } from '~/api/packed/packages-skill'
import { ShowNostis } from '~/common/utils'
import FormPackageSkill from './FormModalSkill'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import Lottie from 'react-lottie-player'
import warning from '~/common/components/json/100468-warning.json'
import { PrimaryTooltip } from '~/common/components'
import PackageHistories from './Histories'
import Avatar from '~/common/components/Avatar'
import PrimaryButton from '~/common/components/Primary/Button'
import Ratings from './Ratings'

const PackageDetailItem = ({ thisId, item, onDelete, deleting, currentPackage, onRefresh }) => {
	const userInfo = useSelector((state: RootState) => state.user.information)

	const popRef = useRef(null)

	const [loading, setLoading] = useState<boolean>(true)
	const [skills, setSkills] = useState([])

	useEffect(() => {
		getPackageSkill()
	}, [])

	async function getPackageSkill() {
		try {
			const res = await packageSkillApi.getAll({ pageIndex: 1, pageSize: 9999, packageSectionId: item?.Id })
			if (res.status == 200) {
				setSkills(res.data?.data)
			} else {
				setSkills([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function delPackageSkill(item) {
		try {
			const res = await packageSkillApi.delete(item?.Id)
			if (res.status == 200) {
				getPackageSkill()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const [creatingTest, setCreatingTest] = useState<any>(false)
	function gotoTest(params) {
		if (params?.Id) {
			window.open(`/take-an-exam/?exam=${params?.Id}`, '_blank')
		}
	}

	function makeTest(exam, skillItem) {
		setCreatingTest(skillItem)
		setPreview(false)

		if (is(userInfo).admin || is(userInfo).manager) {
			createAdminTest(exam)
		}

		if (is(userInfo).student) {
			getDraft(exam, skillItem)
		}
	}

	async function getDraft(ExamId, HWId) {
		try {
			// 1 - Làm bài thử 2 - Làm bài hẹn test 3 - Bài tập về nhà 4 - Bộ đề
			const res = await doingTestApi.getDraft({ valueId: HWId, type: 4 })
			if (res.status == 200) {
				setCurrentData({ ExamId: ExamId, HWId: HWId, draft: res.data?.data })
				setExamWarning(true)
			} else {
				createDoingTest(ExamId, HWId)
			}
		} catch (error) {
		} finally {
			setCreatingTest(null)
		}
	}

	async function createAdminTest(exam) {
		try {
			const res = await doingTestApi.post({ IeltsExamId: exam, ValueId: 0, Type: 1 })
			if (res?.status == 200) {
				gotoTest(res.data?.data)
			}
		} catch (error) {
		} finally {
			setCreatingTest(false)
			setCreatingTest(null)
		}
	}

	async function createDoingTest(ExamId, HWId) {
		try {
			const res = await doingTestApi.post({ IeltsExamId: ExamId, ValueId: HWId?.Id, Type: 4 })

			if (res?.status == 200) {
				gotoTest(res.data?.data)
			}
		} catch (error) {}
	}

	const [examWarning, setExamWarning] = useState<boolean>(false)
	const [currentData, setCurrentData] = useState<any>(null)

	// ----------------------------------------------------------------

	const [preview, setPreview] = useState<boolean>(false)

	const [previewLoading, setPreviewLoading] = useState<boolean>(false)

	const [ranks, setRanks] = useState([])
	const [curSkill, setCurSkill] = useState(null)

	async function getPreview(skillId) {
		setPreview(true)
		setPreviewLoading(true)
		try {
			const res: any = await packageSkillApi.getRank(skillId)
			if (res.status == 200) {
				setRanks(res.data?.data?.Items)
			} else {
				setRanks([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setPreviewLoading(false)
		}
	}

	return (
		<div key={thisId} id={thisId} className="pe-d-default">
			{(is(userInfo).admin || is(userInfo).manager) && (
				<Popover
					ref={popRef}
					overlayClassName="show-arrow"
					content={
						<div>
							<Popconfirm disabled={deleting} onConfirm={onDelete} title={`Xoá: ${item?.Name}`} placement="left">
								<div className="pe-menu-item">
									<BiTrash size={18} color="#E53935" className="ml-[-3px]" />
									<div className="ml-[8px]">Xoá</div>
								</div>
							</Popconfirm>

							<FormPackageSection
								packageId={currentPackage}
								onOpen={() => popRef?.current?.close()}
								onRefresh={onRefresh}
								defaultData={item}
								isEdit
							/>
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

			<div className="p-[8px]">
				<div className="text-[18px] font-[600]">{item?.Name}</div>
			</div>

			{(is(userInfo).admin || is(userInfo).manager) && (
				<div className="flex flex-col w-full items-start pl-[8px]">
					<FormPackageSkill packageSectionId={item?.Id} onRefresh={getPackageSkill} />
				</div>
			)}

			<div className="pb-[16px]">
				{!loading && skills.length == 0 && <Empty />}
				{!loading && skills.length > 0 && (
					<div className="p-[8px] mt-[8px] grid grid-cols-1 w600:grid-cols-2 gap-[8px] no-select">
						{skills.map((itemSkill, iSkill) => {
							return (
								<div key={`ski-${iSkill}`} className="col-span-1 flex items-center bg-[#f2f2f2] hover:bg-[#e8e8e8] p-[8px] rounded-[6px]">
									<div className="font-[600] flex-1">{itemSkill?.Name}</div>
									<div className="flex items-center h-[26px]">
										<Ratings SkillsId={itemSkill?.Id} />

										<div
											// onClick={() => {
											// 	setCurSkill(itemSkill)
											// 	getPreview(itemSkill?.Id)
											// }}
											onClick={() => makeTest(itemSkill?.IeltsExamId, itemSkill)}
											className="pe-i-d-cart !px-[8px] !h-[26px]"
										>
											<div className="pe-i-d-c-title !ml-0">
												{creatingTest?.Id == itemSkill?.Id && <Spin className="!ml-[0px] mr-[8px] loading-base" />}
												{is(userInfo).student ? 'Làm bài' : 'Làm thử'}
											</div>
										</div>

										<PrimaryTooltip place="left" id={`hw-his-${item?.Id}`} content="Lịch sử làm bài">
											<PackageHistories item={itemSkill} />
										</PrimaryTooltip>

										{(is(userInfo).admin || is(userInfo).manager) && (
											<Popconfirm onConfirm={() => delPackageSkill(itemSkill)} title={`Xoá: ${itemSkill?.Name}`} placement="left">
												<div onClick={null} className="pe-i-d-red !px-[8px] !h-[26px] ml-[8px]">
													<div className="pe-i-d-c-title !ml-0">Xoá</div>
												</div>
											</Popconfirm>
										)}
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>

			<Modal width={400} open={examWarning} onCancel={() => setExamWarning(false)} footer={null}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Lottie loop animationData={warning} play style={{ width: 160, height: 160, marginBottom: 8 }} />
					<div style={{ fontSize: 18 }}>Bạn có muốn tiếp tục làm bản trước đó?</div>

					<div className="none-selection" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
						<div onClick={() => createDoingTest(currentData?.ExamId, currentData?.HWId)} className="exercise-btn-cancel">
							<div>Làm bài mới</div>
						</div>

						<div
							onClick={() => {
								gotoTest(currentData?.draft)
								setExamWarning(false)
							}}
							className="exercise-btn-continue"
						>
							<div>Làm tiếp</div>
						</div>
					</div>
				</div>
			</Modal>

			{/* <Modal
				title="Tổng quan"
				width={400}
				open={preview}
				onCancel={() => setPreview(false)}
				footer={
					<div>
						<PrimaryButton
							background="red"
							icon="cancel"
							type="button"
							onClick={() => {
								setCurSkill(null)
								setPreview(false)
							}}
						>
							Đóng
						</PrimaryButton>
						<PrimaryButton
							className="ml-[8px]"
							background="blue"
							icon="edit"
							type="button"
							onClick={() => makeTest(curSkill?.IeltsExamId, curSkill)}
						>
							Làm bài
						</PrimaryButton>
					</div>
				}
			>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div className="border-[1px] border-[#dfdfdf] p-[8px] rounded-[6px]">
						<div className="font-[600] text-[16px] mb-[8px]">Bảng xếp hạng</div>

						{previewLoading && <Skeleton active />}
						{!previewLoading && ranks.length == 0 && (
							<div className="">
								<Empty />
							</div>
						)}

						{!previewLoading && ranks.length > 0 && (
							<div className="gap-[8px]">
								{ranks.map((rank, index) => {
									return (
										<div key={`exam-rank-${index}-${rank?.Id}`} className="bg-[#f2f2f2] p-[8px] rounded-[6px] flex">
											<div className="flex flex-col items-start">
												<div className="flex">
													<Avatar className="w-[50px] h-[50px] rounded-full" uri={rank?.StudentThumbnail} />
													<div className="ml-[8px]">
														<div className="font-[600] text-[18px]">{rank?.StudentName}</div>
														<div className="font-[500]">
															Điểm: {rank?.MyPoint} - Top: {rank?.Rank}
														</div>
													</div>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>
				</div>
			</Modal> */}
		</div>
	)
}

export default PackageDetailItem
