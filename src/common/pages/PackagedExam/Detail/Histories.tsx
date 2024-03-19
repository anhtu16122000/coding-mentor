import { Empty, Modal, Skeleton } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { AiOutlineEye } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { examResultApi } from '~/api/exam/result'
import { RootState } from '~/store'

const PackageHistories = (props) => {
	const { item } = props

	const userInfo = useSelector((state: RootState) => state.user.information)

	const [visible, setVisible] = useState<boolean>(false)
	const [data, setData] = useState([])

	function toggle() {
		setVisible(!visible)
	}

	useEffect(() => {
		if (visible) {
			getdata()
		}
	}, [visible])

	const [loadingResult, setLoadingResult] = useState<boolean>(true)

	async function getdata() {
		setLoadingResult(true)

		let SId = userInfo?.RoleId == '3' ? userInfo?.UserInformationId : null

		try {
			const res = await examResultApi.getAll({ valueId: item?.Id, studentId: SId || null, pageIndex: 1, pageSize: 9999 })
			if (res.status == 200) {
				setData(res.data?.data)
			} else {
				setData([])
			}
		} catch (error) {
		} finally {
			setLoadingResult(false)
		}
	}

	return (
		<>
			<div onClick={toggle} className="pe-i-d-green !px-[8px] !h-[26px] ml-[8px]">
				<div className="pe-i-d-c-title !ml-0">Lịch sử</div>
			</div>

			<Modal open={visible} width={900} footer={null} title="Lịch sử làm bài" onCancel={toggle}>
				<div className="">
					{loadingResult && <Skeleton />}
					{!loadingResult && data.length == 0 && (
						<div className="">
							<Empty />
						</div>
					)}
					{!loadingResult && data.length > 0 && (
						<div className="gap-[8px] grid grid-cols-1 w600:grid-cols-2 w900:grid-cols-3">
							{data.map((result, index) => {
								return (
									<div
										key={`res-${index}-${result?.Id}`}
										className="flex border-[1px] p-[8px] rounded-[6px] border-[#f1f1f1] hover:border-[#D21320] flex-col items-start col-span-1"
									>
										<div className="flex items-center">
											<div>Học viên:</div>
											<div className="font-[600] ml-[4px]">{result?.StudentName}</div>
										</div>

										<div className="flex items-center">
											<div>Nộp bài: </div>
											<div className="font-[600]">{moment(result?.CreatedOn)?.format('HH:mm DD/MM/YYYY')}</div>
										</div>

										<div className="flex items-center">
											<div>Điểm: </div>
											<div className="font-[600] ml-[4px]">
												{result?.MyPoint} / {result?.Point}
											</div>
										</div>

										<div className="flex items-center">
											<div>Thời gian làm: </div>
											<div className="font-[600] ml-[4px]">
												{result?.TimeSpent} / {result?.Time} phút
											</div>
										</div>

										<div className="flex items-center mt-[8px]">
											<div
												onClick={() => window.open(`/exam-result/?test=${result?.Id}`, '_blank')}
												className="pe-i-d-green !px-[8px] !h-[26px]"
											>
												<AiOutlineEye size={18} />
												<div className="pe-i-d-c-title">Xem kết quả</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			</Modal>
		</>
	)
}

export default PackageHistories
