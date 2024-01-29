import React, { FC, useState } from 'react'
import styles from './styles.module.scss'
import { Modal } from 'antd'
import { DateRange } from 'react-date-range'
import { vi } from 'date-fns/locale'
import ChaoButton from '../Button'
import { IoClose } from 'react-icons/io5'
import moment from 'moment'

function getCurrentAndPast7Days() {
	// Lấy ngày hiện tại
	const currentDate = new Date()

	// Lấy ngày cách đây 7 ngày
	const past7DaysDate = new Date(currentDate)
	past7DaysDate.setDate(currentDate.getDate() - 7)

	// Trả về kết quả dưới dạng đối tượng chứa cả hai ngày
	return {
		currentDate: new Date(currentDate).getTime(),
		past7DaysDate: new Date(past7DaysDate).getTime()
	}
}

function getYesterday() {
	// Lấy ngày hiện tại
	const currentDate = new Date()

	// Trừ đi 1 ngày để lấy ngày hôm qua
	const yesterdayDate = new Date(currentDate)
	yesterdayDate.setDate(currentDate.getDate() - 1)

	return yesterdayDate
}

function getMidnightDate(timestamp) {
	// Tạo một đối tượng Date từ timestamp
	const date = new Date(timestamp)

	// Đặt giờ, phút, giây về 0
	date.setHours(0, 0, 0, 0)

	// Trả về ngày với giờ, phút, giây đã được đặt về 0
	return new Date(date).getTime()
}

function getEndOfDate(timestamp) {
	// Tạo một đối tượng Date từ timestamp
	const date = new Date(timestamp)

	// Đặt giờ, phút, giây về 0
	date.setHours(23, 59, 59, 0)

	// Trả về ngày với giờ, phút, giây đã được đặt về 0
	return new Date(date).getTime()
}

type TProps = {
	useISOString?: boolean

	showYesterday?: boolean
	showToday?: boolean
	showPast7Days?: boolean
	showSelected?: boolean

	onSubmit: Function
}

const DateFilter: FC<TProps> = (props) => {
	const { onSubmit, useISOString, showYesterday = true, showToday = true, showPast7Days = true, showSelected = true } = props

	const [curTab, setCurTab] = useState<number>(0)
	const [visible, setVisible] = useState<boolean>(false)
	const [dateRange, setDateRange] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection'
		}
	])

	// Nếu ngày bắt đầu khác ngày kết thúc thì hiện 2 cái
	function getDateString() {
		if (moment(dateRange[0]?.startDate).format('DD/MM/YYYY') == moment(dateRange[0]?.endDate).format('DD/MM/YYYY')) {
			return moment(dateRange[0]?.startDate).format('DD/MM/YYYY')
		}
		return `${moment(dateRange[0]?.startDate).format('DD/MM/YYYY')} - ${moment(dateRange[0]?.endDate).format('DD/MM/YYYY')}`
	}

	function handleSubmit(params: { start: number; end: number }) {
		if (!onSubmit) {
			return
		}

		if (!useISOString) {
			onSubmit({ ...params, timestamp: new Date().getTime() })
		} else {
			// Nhớ thêm 7 giờ vào thời gian, do toISOString nó tự về múi giờ 0
			onSubmit({
				start: new Date(params?.start + 7 * 60 * 60 * 1000).toISOString(),
				end: new Date(params?.end + 7 * 60 * 60 * 1000).toISOString(),
				timestamp: new Date().getTime()
			})
		}

		setDateRange([
			{
				startDate: new Date(params?.start),
				endDate: new Date(params?.end),
				key: 'selection'
			}
		])
	}

	function handleChange(type: 'all' | 'toDay' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'range') {
		switch (type) {
			case 'all':
				setCurTab(0)
				handleSubmit({
					start: null,
					end: null
				})
				break

			case 'toDay':
				setCurTab(1)
				handleSubmit({
					start: getMidnightDate(new Date().getTime()),
					end: getEndOfDate(new Date().getTime())
				})
				break

			case 'yesterday':
				setCurTab(2)
				const yesterday = getYesterday()
				handleSubmit({
					start: getMidnightDate(yesterday),
					end: getEndOfDate(new Date(yesterday).getTime())
				})
				break

			case 'thisWeek':
				setCurTab(3)
				const past7Days = getCurrentAndPast7Days()
				handleSubmit({
					start: getMidnightDate(past7Days?.past7DaysDate),
					end: getEndOfDate(past7Days?.currentDate)
				})
				break

			case 'range':
				setVisible(false)
				handleSubmit({
					start: getMidnightDate(dateRange[0]?.startDate),
					end: getEndOfDate(dateRange[0]?.endDate)
				})
				break

			default:
				setCurTab(0)
				handleSubmit({
					start: null,
					end: null
				})
				break
		}
	}

	return (
		<>
			<div>
				<div className={styles.container}>
					<div onClick={() => handleChange('all')} className={`item ${curTab == 0 ? 'active' : ''}`}>
						<div>Tất cả</div>
					</div>

					{showToday && (
						<div onClick={() => handleChange('toDay')} className={`item ${curTab == 1 ? 'active' : ''}`}>
							<div>Hôm nay</div>
						</div>
					)}

					{showYesterday && (
						<div onClick={() => handleChange('yesterday')} className={`item ${curTab == 2 ? 'active' : ''}`}>
							<div>Hôm qua</div>
						</div>
					)}

					{showPast7Days && (
						<div onClick={() => handleChange('thisWeek')} className={`item ${curTab == 3 ? 'active' : ''}`}>
							<div>7 ngày qua</div>
						</div>
					)}

					<div
						onClick={() => {
							setCurTab(4)
							setVisible(true)
						}}
						className={`item ${curTab == 4 ? 'active' : ''}`}
					>
						<div>Tuỳ chỉnh</div>
					</div>
				</div>

				{curTab !== 0 && showSelected && <div className="text-[12px] mt-[4px] text-[#1b73e8]">Đang xem: {getDateString()}</div>}
			</div>

			<Modal
				open={visible}
				width={360}
				title={
					<>
						<div>Chọn khoảng thời gian</div>
						<div className="text-[12px] opacity-70 text-[#1b73e8]">Đã chọn: {getDateString()}</div>
					</>
				}
				closable={false}
				footer={
					<div className="w-full flex items-center justify-center gap-[8px]">
						<ChaoButton type="delete" icon={<IoClose size={22} />} onClick={() => setVisible(false)}>
							Đóng
						</ChaoButton>
						<ChaoButton onClick={() => handleChange('range')} type="save">
							Áp dụng
						</ChaoButton>
					</div>
				}
			>
				<div className="mt-[-24px] mb-[-24px] mx-[-10px]">
					<DateRange
						locale={vi}
						showDateDisplay={false}
						editableDateInputs={false}
						onChange={(item) => setDateRange([item.selection])}
						moveRangeOnFirstSelection={false}
						ranges={dateRange}
					/>
				</div>
			</Modal>
		</>
	)
}

export default DateFilter
