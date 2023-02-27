import { Input, Select } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { transcriptApi } from '~/api/transcript'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import InputTextField from '../FormControl/InputTextField'
import PrimaryButton from '../Primary/Button'
import PrimaryTable from '../Primary/Table'
import { ModalTranscript } from './ModalTranscript'

export const TranscriptPage = () => {
	const router = useRouter()
	const user = useSelector((state: RootState) => state.user.information)
	const [loading, setLoading] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [dataTable, setDataTable] = useState([])
	const [transcriptId, setTranscriptId] = useState(null)
	const [disabled, setDisabled] = useState(true)
	const [dataTranscript, setDataTranscript] = useState<{ title: string; value: string }[]>([])

	const handleChangeListening = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Listening: info.target.value }
		setDataTable(temp)
		setDisabled(false)
	}

	const handleChangeSpeaking = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Speaking: info.target.value }
		setDataTable(temp)
		setDisabled(false)
	}

	const handleChangeReading = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Reading: info.target.value }
		setDataTable(temp)
		setDisabled(false)
	}

	const handleChangeWriting = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Writing: info.target.value }
		setDataTable(temp)
		setDisabled(false)
	}

	const handleChangeMedium = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Medium: info.target.value }
		setDataTable(temp)
		setDisabled(false)
	}

	const handleChangeNote = (info, index) => {
		let temp = [...dataTable]
		temp[index] = { ...temp[index], Note: info.target.value }
		setDataTable(temp)
		setDisabled(false)
	}
	const getTranscriptByClass = async (Id) => {
		try {
			const res = await transcriptApi.getTranscriptByClass(Id)
			if (res.status === 200) {
				let temp = []
				res?.data?.data?.forEach((item) => {
					temp.push({ title: item?.Name, value: item?.Id })
				})
				setDataTranscript(temp)
			}
			if (res.status === 204) {
				setDataTranscript([])
			}
		} catch (error) {}
	}

	const getTranscriptPoint = async (Id) => {
		try {
			setLoading(true)
			const res = await transcriptApi.getTranscriptPoint(Id)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setLoading(false)
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

	const handleUpdatePoint = async (data) => {
		try {
			setIsLoading(true)
			const res = await transcriptApi.updatePoint(data)
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				setIsLoading(false)
			}
		} catch (error) {
			ShowNoti('error', error.message)
			setIsLoading(true)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSave = () => {
		const dataSubmit = {
			Id: transcriptId,
			Items: dataTable
		}
		handleUpdatePoint(dataSubmit)
	}

	useEffect(() => {
		if (transcriptId) {
			getTranscriptPoint(transcriptId)
		}
	}, [transcriptId])

	useEffect(() => {
		if (router?.query?.class) {
			getTranscriptByClass(router?.query?.class)
		}
	}, [router?.query?.class])

	const columns = [
		{
			title: 'Tên học viên',
			dataIndex: 'StudentName',
			width: 180,
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Listening',
			width: 100,
			dataIndex: 'Listening',
			render: (text, item, index) => (
				<div className="antd-custom-wrap">
					<Input
						disabled={user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
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
							disabled={user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
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
							disabled={user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
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
							disabled={user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
							onChange={(val) => handleChangeWriting(val, index)}
							value={item?.Writing}
							className="rounded-lg h-[36px]"
						/>
					</div>
				</>
			)
		},
		{
			title: 'Trung bình',
			width: 100,
			dataIndex: 'Medium',
			render: (text, item, index) => (
				<>
					<div className="antd-custom-wrap">
						<Input
							disabled={user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
							onChange={(val) => handleChangeMedium(val, index)}
							value={item?.Medium}
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
						disabled={user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? false : true}
						onChange={(val) => handleChangeNote(val, index)}
						value={text}
						className="rounded-lg mb-0"
						name=""
						label=""
					/>
				</>
			)
		}
	]
	return (
		<>
			<PrimaryTable
				loading={loading}
				TitleCard={
					user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? (
						<div className="extra-table">
							<ModalTranscript mode="add" onRefresh={() => getTranscriptByClass(router?.query?.class)} setTranscriptId={setTranscriptId} />
						</div>
					) : (
						''
					)
				}
				Extra={
					<>
						<div className="flex items-center">
							<div className="font-bold">Đợt thi:</div>
							<div className="antd-custom-wrap mr-tw-4">
								<Select
									className="w-[220px] ml-tw-4 custom-select-transcript"
									onChange={(val) => setTranscriptId(val)}
									placeholder="Chọn đợt thi"
									value={transcriptId}
								>
									{dataTranscript &&
										dataTranscript?.length > 0 &&
										dataTranscript?.map((item, index) => (
											<>
												<Select.Option key={index} value={item.value}>
													{item.title}
												</Select.Option>
											</>
										))}
								</Select>
							</div>
							{user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? (
								<div className="mr-tw-4">
									<ModalTranscript
										mode="delete"
										Id={transcriptId}
										onRefresh={() => getTranscriptByClass(router?.query?.class)}
										setTranscriptId={setTranscriptId}
									/>
								</div>
							) : (
								''
							)}

							{user.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? (
								<PrimaryButton
									background="green"
									type="button"
									children={<span>Cập nhật điểm</span>}
									icon="save"
									disable={disabled}
									onClick={() => handleSave()}
									loading={isLoading}
								/>
							) : (
								''
							)}
						</div>
					</>
				}
				data={dataTable}
				columns={columns}
			/>
		</>
	)
}
