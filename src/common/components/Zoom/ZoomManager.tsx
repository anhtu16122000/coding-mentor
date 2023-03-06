import React, { FC, useState } from 'react'
import { RiAddCircleLine } from 'react-icons/ri'
import PrimaryTooltip from '../PrimaryTooltip'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import { TbArrowBarToRight } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { MdClose } from 'react-icons/md'
import BaseLoading from '../BaseLoading'
import { IoIosVideocam } from 'react-icons/io'

type TZoomManager = {
	data: any
	onRefresh?: Function
	isPopover?: boolean
}

const url = 'Schedule'

const ZoomManager: FC<TZoomManager> = (props) => {
	const { data, onRefresh, isPopover } = props

	const [loading, setLoading] = useState(null)

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	function _refresh() {
		if (!!onRefresh) onRefresh()
	}

	function isStart15Minutes() {
		if (!!data?.StartTime) {
			const timestamp = new Date(data?.StartTime).getTime()
			const now = new Date().getTime()

			const diffMilliseconds = Math.abs(now - timestamp)
			const diffMinutes = Math.floor(diffMilliseconds / 60000)

			return diffMinutes > -15
		} else {
			return false
		}
	}

	function isEnd15Minutes() {
		if (!!data?.EndTime) {
			const timestamp = new Date(data?.EndTime).getTime()
			const now = new Date().getTime()

			const diffMilliseconds = Math.abs(timestamp - now)
			const diffMinutes = Math.floor(diffMilliseconds / 60000)
			return diffMinutes < 15
		} else {
			return false
		}
	}

	function isTimeWithinRange(currentTime: Date, startTime: Date, endTime: Date): boolean {
		const bufferTime = 15 * 60 * 1000 // số miligiây tương ứng với 15 phút
		return currentTime.getTime() >= startTime.getTime() - bufferTime && currentTime.getTime() <= endTime.getTime() + bufferTime
	}

	// now >= start -15p
	// now <= end +15p

	function tinhSoPhutChenhLech() {
		const timestamp = new Date(data?.EndTime).getTime()
		const now = new Date().getTime()

		const diffMilliseconds = Math.abs(now - timestamp)
		const diffMinutes = Math.floor(diffMilliseconds / 60000)
		return diffMinutes
	}

	async function createZoomRoom() {
		setLoading('create')
		try {
			const response = await RestApi.post(url + '/create-zoom/' + data?.Id, {})
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				_refresh()

				window.open(response.data.data?.StartUrl, '_plank')

				// JoinUrl: 'https://us05web.zoom.us/j/86391688986?pwd=Zi94TXRmdlRyN25mNnE3aUhydXhTdz09'
				// StartUrl: 'https://us05web.zoom.us/s/86391688986?zak=eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6InpjcTdrYks3UjlXODl0TmJGUkQyVGciLCJpc3MiOiJ3ZWIiLCJzayI6IjAiLCJzdHkiOjEsIndjZCI6InVzMDUiLCJjbHQiOjAsIm1udW0iOiI4NjM5MTY4ODk4NiIsImV4cCI6MTY3NzA1OTU2OSwiaWF0IjoxNjc3MDUyMzY5LCJhaWQiOiItMzBqbG9uTlRIdVhTMjhLOWNXOU1BIiwiY2lkIjoiIn0.Tij1jPyxKKh_M92Maf0fCHOlOg80ZbJtlYmOTvv9nJI'
				// ZoomId: '86391688986'
				// ZoomPass: '5J6vvm'
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(null)
		}
	}

	async function closeZoomRoom() {
		setLoading('close')
		try {
			const response = await RestApi.put(url + '/close-zoom/' + data?.Id, {})
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				_refresh()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(null)
		}
	}

	async function recordZoomRoom() {
		setLoading('recording')
		try {
			const response = await RestApi.get(url + '/recording/' + data?.Id, {})
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				// _refresh()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(null)
		}
	}

	function isActive() {
		return data.Status == 2 ? true : false
	}

	function joinRoom() {
		if (!!data?.JoinUrl) window.open(data?.JoinUrl, '_plank')
	}

	if (!isTimeWithinRange(new Date(), new Date(data?.StartTime), new Date(data?.EndTime))) {
		return <></>
	}

	if (!!data?.IsOpenZoom) {
		return (
			<div className="mt-[8px]">
				<PrimaryTooltip id={`joi-tip-${data?.Id}`} content="Tham gia" place="top">
					<div onClick={joinRoom} className="h-[32px] all-center w-full rounded-[6px] bg-[#0A89FF] hover:bg-[#157ddd] active:bg-[#0A89FF]">
						<TbArrowBarToRight size={20} color="#fff" />
						{!!isPopover && <div className="text-[#fff] ml-[8px]">Tham gia</div>}
					</div>
				</PrimaryTooltip>

				{(isAdmin() || isTeacher()) && (
					<PrimaryTooltip id={`new-tip-${data?.Id}`} content="Tạo lại" place="top">
						<div
							onClick={createZoomRoom}
							className="mt-[8px] h-[32px] all-center w-full rounded-[6px] bg-[#FFBA0A] hover:bg-[#e7ab11] active:bg-[#FFBA0A]"
						>
							{!loading && <RiAddCircleLine size={20} color="#fff" />}
							{loading == 'create' && <BaseLoading.White />}
							{!!isPopover && <div className="text-[#fff] ml-[8px]">Tạo lại</div>}
						</div>
					</PrimaryTooltip>
				)}

				{(isAdmin() || isTeacher()) && (
					<PrimaryTooltip id={`close-tip-${data?.Id}`} content="Đóng phòng" place="top">
						<div
							onClick={closeZoomRoom}
							className="mt-[8px] h-[32px] all-center w-full rounded-[6px] bg-[#C94A4F] hover:bg-[#b43f43] active:bg-[#C94A4F]"
						>
							{!loading && <MdClose size={20} color="#fff" />}
							{loading == 'close' && <BaseLoading.White />}
							{!!isPopover && <div className="text-[#fff] ml-[8px]">Đóng phòng</div>}
						</div>
					</PrimaryTooltip>
				)}
			</div>
		)
	}

	if (!data?.IsOpenZoom) {
		return (
			<div className="mt-[8px]">
				<PrimaryTooltip id={`tip-${data?.Id}`} content="Tạo phòng Zoom" place="top">
					<div
						onClick={createZoomRoom}
						className="h-[32px] all-center w-full rounded-[6px] bg-[#4CAF50] hover:bg-[#449a48] active:bg-[#4CAF50]"
					>
						{!loading && <RiAddCircleLine size={20} color="#fff" />}
						{loading == 'create' && <BaseLoading.White />}
						{!!isPopover && <div className="text-[#fff] ml-[8px]">Tạo phòng Zoom</div>}
					</div>
				</PrimaryTooltip>

				{/* {isActive() && (
					<PrimaryTooltip id={`reco-tip-${data?.Id}`} content="Xem bản ghi" place="top">
						<div
							onClick={recordZoomRoom}
							className="mt-[8px] h-[32px] all-center w-full rounded-[6px] bg-[#FF9800] hover:bg-[#f49302] active:bg-[#FF9800]"
						>
							{!loading && <IoIosVideocam size={20} color="#fff" />}
							{loading == 'close' && <BaseLoading.White />}
							{!!isPopover && <div className="text-[#fff] ml-[8px]">Xem bản ghi</div>}
						</div>
					</PrimaryTooltip>
				)} */}
			</div>
		)
	}

	return <></>
}

export default ZoomManager
