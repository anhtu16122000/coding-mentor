import { Dropdown, Tooltip } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { SiYoutube } from 'react-icons/si'
import { ZoomRoomApi } from '~/api/zoom'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../../Primary/Button'
import ModalSeminar from './ModalSeminar'
import ModalZoomRecord from './ModalZoomRecord'

export interface ISeminarItemProps {
	item: ISeminar
	onFetchData: Function
	onSubmit: Function
	selectOptions: { videoCourseList: Array<{ title: string; value: any }>; teacherList: Array<{ title: string; value: any }> }
	isLoading?: { type: string; status: boolean }
}

export default function SeminarItem(props: ISeminarItemProps) {
	const { item, onFetchData, onSubmit, isLoading, selectOptions } = props
	const [userRoleId, setUserRoleId] = useState(null)
	const [isDisabledStartButton, setIsDisabledStartBUtton] = useState(false)

	useEffect(() => {
		setUserRoleId(JSON.parse(localStorage.getItem('userData')).user.RoleId)
	}, [])

	const handleCreateZoomRoom = async () => {
		setIsDisabledStartBUtton(true)
		try {
			let res = await ZoomRoomApi.post(Number(item.Id))
			if (res.status == 200) {
				onFetchData && onFetchData()
				ShowNoti('success', res.data.message)
				window.open(`/zoom-view/?SeminarID=${item.Id}&name=${item.Name}`)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsDisabledStartBUtton(false)
		}
	}

	const handleCloseZoomRoom = async () => {
		setIsDisabledStartBUtton(true)
		try {
			let res = await ZoomRoomApi.put(item.Id)
			if (res.status == 200) {
				onFetchData && onFetchData()
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsDisabledStartBUtton(false)
		}
	}

	function getEnable() {
		const end = new Date(item.EndTime).getTime()
		const current = new Date().getTime()
		return current < end ? true : false
	}

	const renderButton = () => {
		return (
			<div className="flex cursor-pointer flex-col justify-center items-center gap-2 absolute top-8 bottom-0 left-0 right-0 opacity-tw-0 group-hover:opacity-tw-10 group-hover:top-0 ease-linear duration-500 z-10">
				{item.Status == 1 && item.Button == 0 && <p className="font-bold text-tw-white">Vui lòng đợi!</p>}

				{((item.Status == 3 && item.Button == 0) || item.Button == 3) && (
					<>
						<p className="font-bold text-tw-white">Đã kết thúc!</p>
					</>
				)}

				{item?.Button == 2 && (
					<PrimaryButton
						background="green"
						type="button"
						className="w-full"
						disable={isDisabledStartButton}
						children={<span>Tham gia</span>}
						icon="enter"
						onClick={() => window.open(`/zoom-view/?SeminarID=${item.Id}&name=${item.Name}`)}
					/>
				)}

				{(userRoleId == '1' || userRoleId == '2') && item.Button == 2 && (
					<PrimaryButton
						background="primary"
						type="button"
						children={<span>Đóng phòng học</span>}
						disable={isDisabledStartButton}
						icon="power"
						onClick={() => handleCloseZoomRoom()}
					/>
				)}

				{(userRoleId == '1' || userRoleId == '2') && item.Button == 1 && (
					<PrimaryButton
						background="green"
						type="button"
						disable={isDisabledStartButton}
						children={<span>Bắt đầu</span>}
						icon="enter"
						onClick={() => {
							handleCreateZoomRoom()
						}}
					/>
				)}

				{(userRoleId == '1' || userRoleId == '2') && item.Status == 3 && getEnable() && (
					<PrimaryButton
						background="green"
						type="button"
						disable={isDisabledStartButton}
						children={<span>Tạo phòng mới</span>}
						icon="enter"
						onClick={() => handleCreateZoomRoom()}
					/>
				)}

				{userRoleId == '3' && item.Status == 1 && item.Button == 1 && <p className="font-bold text-tw-white">Vui lòng đợi!</p>}
			</div>
		)
	}

	const [showDropdown, setShowDropdown] = useState(false)

	const content = (
		<div className="drop-shadow-lg rounded-xl px-3 py-3 bg-tw-white flex flex-col gap-2">
			{userRoleId == '1' && (
				<>
					<ModalSeminar
						onOpen={() => setShowDropdown(false)}
						mode="edit"
						item={item}
						isLoading={isLoading}
						onSubmit={onSubmit}
						selectOptions={selectOptions}
						onFetchData={onFetchData}
					/>
					<ModalSeminar
						onOpen={() => setShowDropdown(false)}
						mode="delete"
						item={item}
						isLoading={isLoading}
						onSubmit={onSubmit}
						selectOptions={selectOptions}
						onFetchData={onFetchData}
					/>
				</>
			)}

			<ModalZoomRecord onOpen={() => setShowDropdown(false)} item={item} />

			<div className="w-full">
				<PrimaryButton
					background="yellow"
					className="!w-[160px]"
					type="button"
					onClick={() => window.open(`/seminar/records/?seminar=${item.Id}&name=${item.Name}`, '_plank')}
				>
					<SiYoutube size={18} className="mr-2" /> Bản ghi Youtube
				</PrimaryButton>
			</div>
		</div>
	)

	return (
		<div className="m-2 h-[calc(100%-1rem)] relative rounded-xl bg-tw-white hover:drop-shadow-lg group">
			{item.Status == 1 && (
				<div
					className={`absolute z-20 px-2 py-1 left-0 top-0 bg-tw-green text-tw-white rounded-tl-xl rounded-br-xl border-r border-b border-tw-white`}
				>
					<p>{item.StatusName}</p>
				</div>
			)}
			{item.Status == 2 && (
				<div
					className={`absolute z-20 px-2 py-1 left-0 top-0 bg-tw-yellow text-tw-white rounded-tl-xl rounded-br-xl border-r border-b border-tw-white`}
				>
					<p>{item.StatusName}</p>
				</div>
			)}
			{item.Status == 3 && (
				<div
					className={`absolute z-20 ${
						item.Status == 3 ? 'block' : 'hidden'
					} px-2 py-1 left-0 top-0 bg-[#c4c4c4] text-tw-white rounded-tl-xl rounded-br-xl border-r border-b border-tw-white`}
				>
					<p>{item.StatusName}</p>
				</div>
			)}
			<div className="flex flex-col">
				<div className="relative group flex-shrink-0">
					<div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur-none group-hover:bg-[rgba(0,0,0,0.4)] group-hover:backdrop-blur-sm z-10 linear duration-500 rounded-xl group-hover:rounded-bl-none group-hover:rounded-br-none"></div>

					{renderButton()}

					<img
						className="rounded-xl linear duration-100 group-hover:rounded-bl-none group-hover:rounded-br-none aspect-video object-cover"
						src={item.Thumbnail && item.Thumbnail.length > 0 ? item.Thumbnail : '/images/loreal-workshop.png'}
						alt="thumbnail"
					/>
				</div>

				<div className="p-3 flex-grow flex-shrink-0 basis-auto">
					<p className="text-2xl flex justify-between items-end">
						<Tooltip placement="top" color={'#aa1d38'} title={item.Name}>
							<div className="in-1-line text-[18px] font-[700]">{item.Name}</div>
						</Tooltip>

						<div className="text-tw-black mt-[5px] mb-[-3px] right-0 cursor-pointer">
							<Dropdown
								visible={showDropdown}
								onVisibleChange={(event) => setShowDropdown(event)}
								overlay={content}
								placement="bottomRight"
								overlayClassName="z-10"
								trigger={['click']}
							>
								<button>
									<BsThreeDotsVertical />
								</button>
							</Dropdown>
						</div>
					</p>

					{!!item?.Description && <p className="text-base py-1 font-base text-[14px]">{item.Description}</p>}

					<p className="text-[14px]">
						Bắt đầu:
						<span className={`ml-1 font-bold ${getEnable() ? 'text-tw-green' : item.Status == 2 ? 'text-tw-yellow' : 'text-[#dd1a1a]'}`}>
							{moment(item.StartTime).format('HH:mm - DD/MM/YYYY')}
						</span>
					</p>

					<p className="text-[14px]">
						Kết thúc:
						<span className={`ml-1 font-bold ${getEnable() ? 'text-tw-green' : item.Status == 2 ? 'text-tw-yellow' : 'text-[#dd1a1a]'}`}>
							{moment(item.EndTime).format('HH:mm - DD/MM/YYYY')}
						</span>
					</p>

					<p>
						Giảng viên: <span className="font-bold text-tw-green">{item.LeaderName}</span>
					</p>

					{!!item?.VideoCourseName && (
						<p className="in-1-line">
							Khóa học: <span className="font-bold text-tw-green">{item.VideoCourseName}</span>
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
