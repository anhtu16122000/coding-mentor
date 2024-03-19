import { Input, Select } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { rollUpApi } from '~/api/learn/rollup'
import { scheduleApi } from '~/api/learn/schedule'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import InputTextField from '../FormControl/InputTextField'
import IconButton from '../Primary/IconButton'
import PrimaryTable from '../Primary/Table'
import _ from 'lodash'
import { isMapIterator } from 'util/types'
import { getDate } from '~/common/utils/super-functions'
import { date } from 'yup/lib/locale'

const InputNote = ({ value, onChange, index }) => {
	const [note, setNote] = useState('')

	const user = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		setNote(value)
	}, [value])

	function onChangeNote(params, index) {
		setNote(params.target?.value)
		onChange(params, index)
	}

	return (
		<Input
			disabled={user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
			onChange={(val) => onChangeNote(val, index)}
			value={note}
			className="rounded-lg mb-0"
		/>
	)
}

export const RollUpPage = () => {
	const router = useRouter()
	const user = useSelector((state: RootState) => state.user.information)
	const [loading, setLoading] = useState(false)
	const initParameters = { classId: router.query.class, scheduleId: null, studentIds: null, pageIndex: 1, pageSize: PAGE_SIZE }
	const initParametersSchedule = { classId: router.query.class }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [apiParametersSchedule, setApiParametersSchedule] = useState(initParametersSchedule)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [scheduleId, setScheduleId] = useState(null)
	const [dataSchedule, setDataSchedule] = useState<{ title: string; value: string }[]>([])
	const [studentIds, setStudentIds] = useState(null)
	const [defaultSchedule, setDefaultSchedule] = useState(null)

	const getSchedule = async (params) => {
		try {
			const res = await scheduleApi.getAll(params)
			if (res.status === 200) {
				let temp = [{ title: 'Bỏ chọn', value: null }]
				let scheduleCompleteds = []
				let today = new Date()
				res?.data?.data?.forEach((item, index) => {
					const startDate: Date = new Date(moment(item?.StartTime).format('YYYY-MM-DD HH:mm'))
					if (startDate < today) {
						scheduleCompleteds.push(item?.Id)
					}
					temp.push({
						title: `[Buổi ${index + 1}][${moment(item?.StartTime).format('MM/DD')}] ${moment(item?.StartTime).format('HH:mm')} - ${moment(
							item?.EndTime
						).format('HH:mm')}`,
						value: item?.Id
					})
				})
				let _defaultSchedule = scheduleCompleteds.length == 0 ? null : scheduleCompleteds[scheduleCompleteds.length - 1]
				setDefaultSchedule(_defaultSchedule)
				setApiParameters({ ...apiParameters, scheduleId: _defaultSchedule })
				setScheduleId(_defaultSchedule)
				setDataSchedule(temp)
			}
			if (res.status === 204) {
				setDataSchedule([])
			}
		} catch (error) {
		} finally {
		}
	}
	const getRollUp = async (params) => {
		try {
			setLoading(true)
			const res = await rollUpApi.getAll(params)
			if (res.status === 200) {
				if (scheduleId) {
					setDataTable(res.data.data)
					setTotalRow(res.data.totalRow)
				} else {
					setDataTable([])
				}
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}
	const getStudent = async () => {
		try {
			setLoading(true)
			const res = await rollUpApi.getStudent()
			if (res.status === 200) {
				let _studentIds = res.data.data.map((x) => x.UserInformationId)
				setStudentIds(_studentIds)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}
	const handleChangeStatus = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Status: info }
		setDataTable(temp)
	}

	const handleChangeLearningStatus = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], LearningStatus: info }
		setDataTable(temp)
	}

	const handleChangeNote = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Note: info.target.value }
		setDataTable(temp)
	}

	const handleUpdateRollUp = async (data) => {
		try {
			const res = await rollUpApi.add(data)
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const handleChangeRollUp = (data) => {
		const dataSubmit = {
			StudentId: data?.StudentId,
			ScheduleId: data?.ScheduleId,
			Status: data?.Status,
			LearningStatus: data?.LearningStatus,
			Note: data?.Note
		}
		handleUpdateRollUp(dataSubmit)
	}
	useEffect(() => {
		if (router?.query?.class) {
			getSchedule(apiParametersSchedule)
		}
	}, [router?.query?.class])

	useEffect(() => {
		if (user.RoleId == 3 || user.RoleId == 8) {
			getStudent()
			apiParameters.studentIds = studentIds == null ? '0' : studentIds.join(',')
			setApiParameters(apiParameters)
		}
		if (apiParameters) {
			getRollUp(apiParameters)
		}
	}, [router?.query?.class, apiParameters])

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullName',
			width: 200,
			render: (text) => <p className="font-semibold text-[#D21320]">{text}</p>
		},
		{
			title: 'Điểm danh',
			width: 180,
			dataIndex: 'Status',
			render: (text, item, index) => (
				<div className="antd-custom-wrap">
					<Select
						className="w-[220px] ml-tw-4"
						onChange={(val) => handleChangeStatus(val, index)}
						options={[
							{ value: 1, label: 'Có mặt' },
							{ value: 2, label: 'Vắng có phép' },
							{ value: 3, label: 'Vắng không phép' },
							{ value: 4, label: 'Đi muộn' },
							{ value: 5, label: 'Về sớm' },
							{ value: 6, label: 'Nghĩ lễ' }
						]}
						disabled={user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
						value={item?.Status}
					/>
				</div>
			)
		},
		{
			title: 'Học lực',
			width: 180,
			dataIndex: 'LearningStatus',
			render: (text, item, index) => (
				<div className="antd-custom-wrap">
					<Select
						className="w-[220px] ml-tw-4"
						onChange={(val) => handleChangeLearningStatus(val, index)}
						options={[
							{ value: 1, label: 'Giỏi' },
							{ value: 2, label: 'Khá' },
							{ value: 3, label: 'Trung bình' },
							{ value: 4, label: 'Kém' },
							{ value: 5, label: 'Theo dõi đặc biệt' },
							{ value: 6, label: 'Có cố gắng' },
							{ value: 7, label: 'Không cố gắng' },
							{ value: 8, label: 'Không nhận xét' }
						]}
						disabled={user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
						value={item?.LearningStatus}
					/>
				</div>
			)
		},
		{
			title: 'Đánh giá',
			width: 180,
			dataIndex: 'Note',
			render: (text, item, index) => (
				<div className="antd-custom-wrap">
					<InputNote index={index} onChange={(val, inx) => handleChangeNote(val, inx)} value={text} />
				</div>
			)
		},
		{
			title: '',
			width: 100,
			dataIndex: 'Action',
			render: (text, item, index) => (
				<>
					{user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? (
						<IconButton tooltip="Cập nhật" color="green" icon="save" type="button" onClick={() => handleChangeRollUp(item)} size={22} />
					) : (
						''
					)}
				</>
			)
		}
	]
	return (
		<>
			<PrimaryTable
				loading={loading}
				total={totalRow}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
				TitleCard={
					<div className="extra-table">
						<div className="flex items-center antd-custom-wrap">
							Buổi học:
							<Select
								value={defaultSchedule}
								className="w-[250px] ml-tw-4"
								onChange={(data) => {
									setScheduleId(data)
									setDefaultSchedule(data)
									setApiParameters({ ...apiParameters, scheduleId: data })
								}}
							>
								{dataSchedule &&
									dataSchedule?.length > 0 &&
									dataSchedule?.map((item, index) => (
										<>
											<Select.Option key={index} value={item.value}>
												{item.title}
											</Select.Option>
										</>
									))}
							</Select>
						</div>
					</div>
				}
				data={dataTable}
				columns={columns}
			/>
		</>
	)
}
