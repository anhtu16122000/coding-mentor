import { Input } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { studentAssessmentApi } from '~/api/student-assessment'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import InputTextField from '../FormControl/InputTextField'
import IconButton from '../Primary/IconButton'
import PrimaryTable from '../Primary/Table'

export const StudentAssessment = () => {
	const router = useRouter()
	const user = useSelector((state: RootState) => state.user.information)
	const initParameters = { classId: router.query.class, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [loading, setLoading] = useState(false)
	const [dataTable, setDataTable] = useState([])
	const [totalRow, setTotalRow] = useState(1)

	const handleChangeListening = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Listening: info.target.value }
		setDataTable(temp)
	}

	const handleChangeSpeaking = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Speaking: info.target.value }
		setDataTable(temp)
	}

	const handleChangeReading = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Reading: info.target.value }
		setDataTable(temp)
	}

	const handleChangeWriting = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Writing: info.target.value }
		setDataTable(temp)
	}

	const handleChangeNote = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Note: info.target.value }
		setDataTable(temp)
	}

	const handleUpdateStudentAssessment = async (data) => {
		try {
			const res = await studentAssessmentApi.add(data)
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				getStudentAssessment(apiParameters)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const handleChangeStudentAssessment = (data) => {
		const dataSubmit = {
			ScheduleId: data?.ScheduleId,
			Listening: data?.Listening,
			Speaking: data?.Speaking,
			Reading: data?.Reading,
			Writing: data?.Writing,
			Note: data?.Note
		}

		handleUpdateStudentAssessment(dataSubmit)
	}

	const getStudentAssessment = async (params) => {
		try {
			setLoading(true)
			const res = await studentAssessmentApi.getAll(params)
			if (res.status === 200) {
				if (router?.query?.class) {
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

	useEffect(() => {
		if (apiParameters) {
			getStudentAssessment(apiParameters)
		}
	}, [router?.query?.class, apiParameters])

	const columns = [
		{
			title: 'Ngày',
			width: 150,
			dataIndex: 'Time',
			render: (text, item) => <>{moment(item?.StartTime).format('DD/MM/YYYY')}</>
		},
		{
			title: 'Ca',
			width: 150,
			dataIndex: 'Times',
			render: (text, item) => (
				<>
					{moment(item?.StartTime).format('HH:mm')} - {moment(item?.EndTime).format('HH:mm')}
				</>
			)
		},
		{
			title: 'Listening',
			width: 100,
			dataIndex: 'Listening',
			render: (text, item, index) => (
				<div className="antd-custom-wrap">
					<Input
						disabled={
							moment() >= moment(item?.StartTime) && (user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7)
								? false
								: true
						}
						onChange={(val) => handleChangeListening(val, index)}
						value={item?.Listening}
						className="rounded-lg h-[36px]"
					/>
				</div>
			)
		},
		{
			title: 'Speaking',
			width: 100,
			dataIndex: 'Speaking',
			render: (text, item, index) => (
				<>
					<div className="antd-custom-wrap">
						<Input
							disabled={
								moment() >= moment(item?.StartTime) && (user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7)
									? false
									: true
							}
							onChange={(val) => handleChangeSpeaking(val, index)}
							value={item?.Speaking}
							className="rounded-lg h-[36px]"
						/>
					</div>
				</>
			)
		},
		{
			title: 'Reading',
			width: 100,
			dataIndex: 'Reading',
			render: (text, item, index) => (
				<>
					<div className="antd-custom-wrap">
						<Input
							disabled={
								moment() >= moment(item?.StartTime) && (user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7)
									? false
									: true
							}
							onChange={(val) => handleChangeReading(val, index)}
							value={item?.Reading}
							className="rounded-lg h-[36px]"
						/>
					</div>
				</>
			)
		},
		{
			title: 'Writing',
			width: 100,
			dataIndex: 'Writing',
			render: (text, item, index) => (
				<>
					<div className="antd-custom-wrap">
						<Input
							disabled={
								moment() >= moment(item?.StartTime) && (user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7)
									? false
									: true
							}
							onChange={(val) => handleChangeWriting(val, index)}
							value={item?.Writing}
							className="rounded-lg h-[36px]"
						/>
					</div>
				</>
			)
		},
		{
			title: 'Ghi chú',
			width: 180,
			dataIndex: 'Note',
			render: (text, item, index) => (
				<>
					<InputTextField
						disabled={
							moment() >= moment(item?.StartTime) && (user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7)
								? false
								: true
						}
						onChange={(val) => handleChangeNote(val, index)}
						value={item?.Note}
						className="rounded-lg mb-0"
						name=""
						label=""
					/>
				</>
			)
		},
		{
			title: '',
			width: 100,
			dataIndex: 'Action',
			render: (text, item, index) => (
				<>
					{moment() >= moment(item?.StartTime) && (user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7) ? (
						<IconButton
							tooltip="Cập nhật"
							color={`green`}
							icon="save"
							type="button"
							onClick={() => handleChangeStudentAssessment(item)}
							size={22}
						/>
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
				TitleCard={<div className="extra-table">Đánh giá học viên</div>}
				data={dataTable}
				columns={columns}
			/>
		</>
	)
}
