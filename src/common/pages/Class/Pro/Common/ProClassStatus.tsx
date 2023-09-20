import { Popover, Spin } from 'antd'
import React, { useRef, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { classApi } from '~/api/learn/class'
import { ShowNostis } from '~/common/utils'
import { is } from '~/common/utils/common'
import { RootState } from '~/store'

const defaultClass = 'h-[32px] px-[8px] flex items-center cursor-pointer rounded-[4px] font-[500] hover:bg-[#f0f0f0] none-selection '

const ProClassStatusContent = ({ onUpdateStatus }) => {
	return (
		<div>
			<div onClick={(e) => onUpdateStatus(e, { Status: 1, StatusName: 'Sắp diễn ra' })} className={defaultClass + 'text-[#24913c]'}>
				<div>Sắp diễn ra</div>
			</div>
			<div onClick={(e) => onUpdateStatus(e, { Status: 2, StatusName: 'Đang diễn ra' })} className={defaultClass + 'text-[#1b73e8]'}>
				<div>Đang diễn ra</div>
			</div>
			<div onClick={(e) => onUpdateStatus(e, { Status: 3, StatusName: 'Đã kết thúc' })} className={defaultClass + 'text-[#e31616]'}>
				<div>Đã kết thúc</div>
			</div>
		</div>
	)
}

const ProClassStatus = (props) => {
	const { data, onUpdate } = props

	const popRef = useRef(null)

	const userInfo = useSelector((state: RootState) => state.user.information)

	const [updating, setUpdating] = useState<boolean>(false)

	function getColor() {
		if (data?.Status == 3) {
			return 'back-red'
		}

		if (data?.Status == 2) {
			return 'back-blue'
		}

		if (data?.Status == 1) {
			return 'back-green'
		}

		return ''
	}

	const handleUpdate = async (params) => {
		popRef.current?.close()
		setUpdating(true)
		try {
			const res = await classApi.updateClass({ ...params, Id: data?.Id })
			if (res.status == 200) {
				!!onUpdate && onUpdate({ ...params })
			}
		} catch (err) {
			ShowNostis.error(err.message)
		} finally {
			setUpdating(false)
		}
	}

	function handleUpdateStatus(e, params) {
		e.stopPropagation()
		handleUpdate(params)
	}

	return (
		<>
			{!is(userInfo).admin && !is(userInfo).manager && (
				<div onClick={(event) => event?.stopPropagation()} className={`class-status flex-shrink-0 ${getColor()}`}>
					{data?.StatusName}
				</div>
			)}

			{(is(userInfo).admin || is(userInfo).manager) && (
				<Popover
					ref={popRef}
					placement="bottom"
					title="Cập nhật trạng thái"
					content={<ProClassStatusContent onUpdateStatus={handleUpdateStatus} />}
					trigger="click"
					overlayClassName="show-arrow"
					style={{ zIndex: 10 }}
				>
					<div onClick={(event) => event?.stopPropagation()} className={`class-status flex-shrink-0 ${getColor()}`}>
						{data?.StatusName} {!updating && <IoIosArrowDown size={18} className="inline ml-[0px] mt-[-2px]" />}
						{updating && <Spin size="small" className="mt-[0px] mb-[-4px] ml-[4px]" />}
					</div>
				</Popover>
			)}
		</>
	)
}

export default ProClassStatus
