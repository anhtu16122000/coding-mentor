import { Empty, Modal, Skeleton, Table } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { AiOutlineEye } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { examResultApi } from '~/api/exam/result'
import PrimaryButton from '~/common/components/Primary/Button'
import { RootState } from '~/store'

const EntryHistories = (props) => {
	const { item, isEntry } = props

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
		if (!!isEntry) {
			getdata()
		}
	}, [visible, isEntry])

	const [loadingResult, setLoadingResult] = useState<boolean>(true)

	async function getdata() {
		setLoadingResult(true)

		let SId = userInfo?.RoleId == '3' ? userInfo?.UserInformationId : item?.StudentId

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

	const checkStatus = (statusID, statusName, Avatar) => {
		const rs = ['yellow', 'blue', 'green', 'red']
		return (
			<span className={`tag ${rs[statusID - 1]}`} style={{ marginBottom: 8, textAlign: 'center' }}>
				{statusName}
			</span>
		)
	}

	const _columnGrades = [
		{
			title: 'Ngày làm',
			dataIndex: 'CreatedOn',
			render: (value, item, index) => {
				return <>{moment(value).format('HH:mm DD/MM/YYYY')}</>
			}
		},
		{
			title: 'Điểm trắc nghiệm',
			dataIndex: 'MyPoint',
			render: (value, item, index) => {
				return (
					<div className="font-[700]">
						{value} / {item?.Point}
					</div>
				)
			}
		},
		{
			title: 'Thời gian làm',
			dataIndex: 'TimeSpent',
			render: (value, item, index) => {
				return (
					<div className="font-[700]">
						{value} / {item?.Time} phút
					</div>
				)
			}
		},
		{
			title: 'Đề',
			dataIndex: 'Name'
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			render: (value, item, index) => {
				return <div className="flex items-center pt-[2px]">{checkStatus(item.Status, item.StatusName, item.Thumbnail)}</div>
			}
		},
		{
			title: '',
			dataIndex: 'Status',
			render: (value, item, index) => {
				return (
					<div className="flex items-center mt-[-2px]">
						<div onClick={() => window.open(`/exam-result/?test=${item?.Id}`, '_blank')} className="pe-i-d-green !px-[8px] !h-[26px]">
							<AiOutlineEye size={18} />
							<div className="pe-i-d-c-title">Xem kết quả</div>
						</div>
					</div>
				)
			}
		}
	]

	const TableHistories = () => {
		return (
			<>
				{data.map((result, index) => {
					return (
						<div
							key={`res-${index}-${result?.Id}`}
							className="flex border-[1px] p-[8px] rounded-[6px] border-[#f1f1f1] hover:border-[#1b73e8] flex-col items-start col-span-1"
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
								<div onClick={() => window.open(`/exam-result/?test=${result?.Id}`, '_blank')} className="pe-i-d-green !px-[8px] !h-[26px]">
									<AiOutlineEye size={18} />
									<div className="pe-i-d-c-title">Xem kết quả</div>
								</div>
							</div>
						</div>
					)
				})}
			</>
		)
	}

	const TableEntryHistories = () => {
		return (
			<div className="mb-[24px]">
				<div className="mb-[8px] font-[600] text-[16px]">Kết quả làm bài</div>
				{data.map((result, index) => {
					return <Table pagination={false} size="small" columns={_columnGrades} dataSource={data} />
				})}
			</div>
		)
	}

	return (
		<>
			{!isEntry && (
				<PrimaryButton className="mb-[8px]" onClick={toggle} background="green" icon="file" type="button">
					Lịch sử làm bài
				</PrimaryButton>
			)}

			{isEntry && (
				<>
					{loadingResult && <Skeleton active paragraph={false} />}

					{!loadingResult && data.length == 0 && <div className="tag red">Chưa làm bài</div>}

					<TableEntryHistories />
				</>
			)}

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
							<TableHistories />
						</div>
					)}
				</div>
			</Modal>
		</>
	)
}

export default EntryHistories
