import React, { useEffect, useState } from 'react'
import AvatarComponent from '../AvatarComponent'
import IconButton from '../Primary/IconButton'
import { FiPlus } from 'react-icons/fi'
import { AiFillMinusCircle } from 'react-icons/ai'
import SelectField from '../FormControl/SelectField'
import { Select, Form } from 'antd'
import { ShowNoti } from '~/common/utils'
import { studyTimeApi } from '~/api/configs/study-time'

const dayOfWeek = [
	{
		title: 'Thứ 2',
		value: 1
	},
	{
		title: 'Thứ 3',
		value: 2
	},
	{
		title: 'Thứ 4',
		value: 3
	},
	{
		title: 'Thứ 5',
		value: 4
	},
	{
		title: 'Thứ 6',
		value: 5
	},
	{
		title: 'Thứ 7',
		value: 6
	},
	{
		title: 'Chủ nhật',
		value: 0
	}
]

const RenderItemProgram = ({ item, type, onDelete, onChangeItem }) => {
	const [studyTimes, setStudyTimes] = useState([])

	const [selectedStudy, setSelectedStudy] = useState([
		{
			ExectedDay: null,
			StudyTimeId: null,
			Note: '',
			TimeStamp: new Date().getTime()
		}
	])

	useEffect(() => {
		onChangeItem({ ...item, Expectations: selectedStudy })
	}, [selectedStudy])

	useEffect(() => {
		if (item) {
			getStudyTime()
		}
	}, [])

	const getStudyTime = async () => {
		try {
			const res = await studyTimeApi.getAll({ pageSize: 9999 })
			if (res.status == 200) {
				setStudyTimes(res.data.data)
			} else {
				setStudyTimes([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const addStudyTime = () => {
		selectedStudy.push({ ExectedDay: null, Note: '', StudyTimeId: null, TimeStamp: new Date().getTime() })
		setSelectedStudy([...selectedStudy])
	}

	const handleRemoveListTimeFrame = (TimeStamp) => {
		if (selectedStudy.length != 1) {
			const filterSelectedStudy = selectedStudy.filter((timeFrame) => {
				return timeFrame.TimeStamp !== TimeStamp
			})

			setSelectedStudy(filterSelectedStudy)
		} else {
			ShowNoti('error', 'Vui lòng chọn ít nhất 1 khung thời gian')
		}
	}

	const handleDisableSelect = (data, value) => {
		const checkExist = selectedStudy.find((item) => {
			if (item.ExectedDay == null) {
				return item.StudyTimeId == value
			} else {
				return item.ExectedDay == data.ExectedDay && item.StudyTimeId == value
			}
		})

		return !!checkExist
	}

	return (
		<div className="flex flex-col w-full bg-[#f3f3f3] p-[8px] rounded-[6px] relative">
			<div className="wrapper-item-class">
				<AvatarComponent className="img-class" url={item?.Thumbnail} type="class" />
				<div className="wrapper-info-class">
					<p>
						<span className="title">Chương trình:</span>
						<span className="font-normal ml-1">{item?.Name}</span>
					</p>
					<p>
						<span className="title">Giá:</span>
						<span className="font-normal ml-1">{Intl.NumberFormat('ja-JP').format(item?.Price)}</span>
					</p>
				</div>

				{type !== '1-1' && (
					<IconButton
						className="absolute top-[8px] right-[2px]"
						icon="remove"
						color="red"
						type="button"
						tooltip="Xóa"
						onClick={() => onDelete(item)}
					/>
				)}
			</div>

			<div className="w-full h-[1px] bg-[#d9d9d9] mt-[8px]" />

			<div className="relative mt-[8px]">
				<div className="flex items-center justify-between mb-[4px]">
					<div className="font-[600] mt-[8px]">Ca học</div>

					<div className="btn-add-study-time" onClick={addStudyTime}>
						<FiPlus size={22} className="ml-[-4px]" />
						<div className="ml-[4px]">Thêm ca</div>
					</div>
				</div>

				<div className="">
					{!!studyTimes &&
						selectedStudy.map((timeFrame, timeIndex) => {
							function handleChangeDate(params) {
								const temp = { ...selectedStudy[timeIndex], ExectedDay: params }
								selectedStudy[timeIndex] = temp
								setSelectedStudy([...selectedStudy])
							}

							function handleChangeTime(params) {
								const temp = { ...selectedStudy[timeIndex], StudyTimeId: params }
								selectedStudy[timeIndex] = temp
								setSelectedStudy([...selectedStudy])
							}

							return (
								<div className="flex items-center" key={`xs-${timeFrame?.TimeStamp}`}>
									<button type="button" className="mr-[8px]" onClick={() => handleRemoveListTimeFrame(timeFrame?.TimeStamp)}>
										<AiFillMinusCircle size={22} />
									</button>

									<div className="flex-1 grid grid-cols-2 gap-[8px]">
										<div className="col-span-1">
											<SelectField
												placeholder="Chọn thứ"
												optionList={dayOfWeek}
												name={`ExectedDay-${timeFrame?.TimeStamp}`}
												label="Thứ"
												onChangeSelect={(value) => handleChangeDate(value)}
											/>
										</div>

										<div className="col-span-1">
											<Form.Item name={`StudyTimeId-${timeFrame?.TimeStamp}`} label={'Ca'} required={true}>
												<Select
													className={`primary-input`}
													showSearch
													allowClear
													placeholder={'Chọn ca học'}
													optionFilterProp="children"
													onChange={(value) => handleChangeTime(value)}
												>
													{studyTimes &&
														studyTimes.map((item, idx) => {
															return (
																<Select.Option disabled={handleDisableSelect(timeFrame, item?.Id)} key={idx} value={item.value}>
																	{item?.Name}
																</Select.Option>
															)
														})}
												</Select>
											</Form.Item>
										</div>
									</div>
								</div>
							)
						})}
				</div>
			</div>
		</div>
	)
}

export default RenderItemProgram
